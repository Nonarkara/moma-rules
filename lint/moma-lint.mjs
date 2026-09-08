#!/usr/bin/env node
/**
 * moma-lint — the static half of the enforcement.
 *
 * Reads source, not screenshots. Catches the violations that are decidable
 * from the text of the code: off-scale spacing, unapproved grid densities,
 * a fourth type size, a non-zero radius, a double hairline.
 *
 * The other half (near-miss edges, orphan grid cells, unequal cell heights)
 * is only decidable once the page is laid out — see audit/near-miss.mjs.
 *
 * RATCHET: a legacy codebase has thousands of violations. Blocking on all of
 * them means the rule gets disabled within a day. Instead we record a baseline
 * and fail only on violations ADDED after it. The baseline may only shrink;
 * `--update-baseline` refuses to write a larger one.
 *
 *   moma-lint <dir...>                     check against baseline
 *   moma-lint <dir...> --strict            ignore baseline, report everything
 *   moma-lint <dir...> --update-baseline   record current (only if smaller)
 *   moma-lint <dir...> --json              machine-readable
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { SPACE, TYPE, DENSITY, RADIUS, HAIRLINE, nearestOnScale } from "./scale.mjs";

const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".css", ".scss", ".html"]);
const SKIP = /node_modules|\.next|\.vercel|dist|build|coverage|\.git|worktrees|\.wrangler/;

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    if (SKIP.test(p)) continue;
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else if (EXT.has(extname(p))) out.push(p);
  }
  return out;
}

/* ── rules ─────────────────────────────────────────────────────────── */

const SPACING_PROP =
  /\b(padding|margin|gap|rowGap|columnGap|inset)(?:Top|Right|Bottom|Left|Block|Inline|X|Y)?\s*:\s*(-?\d+)(?!\d*\s*(?:px)?["'`]?\s*\/\*\s*moma-ok)/g;
const SPACING_CSS =
  /\b(padding|margin|gap|row-gap|column-gap)(?:-top|-right|-bottom|-left)?\s*:\s*([^;{}"'<>]+)[;"]/g;
const MINMAX = /minmax\(\s*(\d+)px/g;
const FONT_SIZE_PX = /font-?[sS]ize\s*:\s*["'`]?(\d+)px/g;
const RADIUS_RE = /border-?[rR]adius\s*:\s*["'`]?(\d+)(px|%)?/g;
const BORDER_W = /border(?:-[a-z]+)?(?:-?[wW]idth)?\s*:\s*["'`]?(\d+)px/g;

const ALLOWED_DENSITIES = new Set(Object.values(DENSITY));
const ALLOWED_TYPE = new Set(Object.values(TYPE));

function checkFile(file, root) {
  const src = readFileSync(file, "utf8");
  const rel = relative(root, file);
  const out = [];
  const lineOf = (idx) => src.slice(0, idx).split("\n").length;
  const add = (rule, line, value, message) =>
    out.push({ file: rel, rule, line, value: String(value), message });

  // allow a file to opt out with a top-of-file pragma, deliberately loud
  if (/\/\*\s*moma-lint-disable-file\s*\*\//.test(src)) return out;

  let m;
  while ((m = SPACING_PROP.exec(src))) {
    const v = Math.abs(Number(m[2]));
    // A 1px gap is the hairline-grid idiom (Law VIII): the gap IS the rule.
    if (v === HAIRLINE && /^(gap|rowGap|columnGap)$/.test(m[1])) continue;
    if (!SPACE.includes(v))
      add("spacing-scale", lineOf(m.index), `${m[1]}: ${m[2]}`,
        `${v}px is off the scale — nearest legal value is ${nearestOnScale(v)}px`);
  }
  while ((m = SPACING_CSS.exec(src))) {
    for (const tok of m[2].trim().split(/\s+/)) {
      const px = /^(-?\d+)px$/.exec(tok);
      if (!px) continue;
      const v = Math.abs(Number(px[1]));
      if (v === HAIRLINE && /gap/.test(m[1])) continue;
      if (!SPACE.includes(v))
        add("spacing-scale", lineOf(m.index), `${m[1]}: ${tok}`,
          `${v}px is off the scale — nearest legal value is ${nearestOnScale(v)}px`);
    }
  }
  while ((m = MINMAX.exec(src))) {
    const v = Number(m[1]);
    if (!ALLOWED_DENSITIES.has(v))
      add("grid-density", lineOf(m.index), `minmax(${v}px`,
        `only ${[...ALLOWED_DENSITIES].join("/")}px are permitted column minimums — ` +
        `each distinct minimum adds another column rhythm to the page`);
  }
  while ((m = FONT_SIZE_PX.exec(src))) {
    const v = Number(m[1]);
    if (!ALLOWED_TYPE.has(v))
      add("type-scale", lineOf(m.index), `${v}px`,
        `three type sizes only (${[...ALLOWED_TYPE].join("/")}px) — ${v}px is a fourth`);
  }
  while ((m = RADIUS_RE.exec(src))) {
    const v = Number(m[1]);
    // A true circle is a shape, not a softened rectangle — Law IX exempts it.
    if (v !== RADIUS && m[2] !== "%" && v !== 9999)
      add("radius-zero", lineOf(m.index), `${v}px`, `radius must be 0 — found ${v}px`);
  }
  while ((m = BORDER_W.exec(src))) {
    const v = Number(m[1]);
    if (v !== 0 && v !== HAIRLINE)
      add("hairline", lineOf(m.index), `${v}px`,
        `one border weight only (${HAIRLINE}px) — ${v}px is a second language`);
  }
  return out;
}

/* ── runner ────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const dirs = args.filter((a) => !a.startsWith("--"));
if (!dirs.length) {
  console.error("usage: moma-lint <dir...> [--strict] [--update-baseline] [--json]");
  process.exit(2);
}
const root = process.cwd();
const baselinePath = join(root, ".moma-baseline.json");

let findings = [];
for (const d of dirs) for (const f of walk(d)) findings = findings.concat(checkFile(f, root));

const key = (f) => `${f.file}::${f.rule}::${f.value}`;
const counts = findings.reduce((a, f) => ((a[f.rule] = (a[f.rule] || 0) + 1), a), {});

if (flags.has("--update-baseline")) {
  const next = {};
  for (const f of findings) next[key(f)] = (next[key(f)] || 0) + 1;
  const prev = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : null;
  const prevTotal = prev ? Object.values(prev.counts).reduce((a, b) => a + b, 0) : Infinity;
  const nextTotal = findings.length;
  if (prev && nextTotal > prevTotal) {
    console.error(
      `REFUSED — the baseline may only shrink.\n` +
      `  recorded: ${prevTotal}\n  now:      ${nextTotal}  (+${nextTotal - prevTotal})\n` +
      `Fix the new violations instead of widening the baseline.`);
    process.exit(1);
  }
  writeFileSync(baselinePath,
    JSON.stringify({ recorded: new Date().toISOString(), total: nextTotal, counts: next }, null, 2) + "\n");
  console.log(`baseline written: ${nextTotal} known violations` +
    (prev ? ` (was ${prevTotal}, −${prevTotal - nextTotal})` : ""));
  process.exit(0);
}

let blocking = findings;
if (!flags.has("--strict") && existsSync(baselinePath)) {
  const base = JSON.parse(readFileSync(baselinePath, "utf8")).counts;
  const budget = { ...base };
  blocking = findings.filter((f) => (budget[key(f)] > 0 ? (budget[key(f)]--, false) : true));
}

if (flags.has("--json")) {
  console.log(JSON.stringify({ total: findings.length, blocking: blocking.length, counts, findings: blocking }, null, 2));
  process.exit(blocking.length ? 1 : 0);
}

console.log(`\n  MoMA LINT — ${findings.length} violations in ${dirs.join(", ")}`);
for (const [rule, n] of Object.entries(counts).sort((a, b) => b[1] - a[1]))
  console.log(`    ${String(n).padStart(5)}  ${rule}`);

if (!blocking.length) {
  console.log(`\n  PASS — no new violations beyond the recorded baseline.\n`);
  process.exit(0);
}
console.log(`\n  ${blocking.length} NEW violation(s) — not in the baseline:\n`);
for (const f of blocking.slice(0, 40))
  console.log(`    ${f.file}:${f.line}\n      ${f.rule} · ${f.value}\n      ${f.message}\n`);
if (blocking.length > 40) console.log(`    …and ${blocking.length - 40} more\n`);
process.exit(1);
