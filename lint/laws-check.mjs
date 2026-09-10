#!/usr/bin/env node
/**
 * laws-check — does LAWS.md agree with the code that enforces it?
 *
 * `self-check.mjs` proves the arithmetic in `scale.mjs` is internally
 * consistent. It never reads `LAWS.md`, so for as long as it has existed it has
 * reported "all derivations hold" while Law V mandated three density values
 * that the linter fails and that `scale.mjs` names as counter-examples.
 *
 * A check that cannot see the document it protects is not a check. This reads
 * the prose and asserts two things against the source of truth:
 *
 *   1. every check id named in LAWS.md is actually implemented
 *   2. every number LAWS.md quotes as a legal value is legal in scale.mjs
 *
 * The first catches a law enforced by a wish. The second catches the prose
 * drifting from the arithmetic.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SPACE, TYPE, DENSITY, GRID, HAIRLINE, RADIUS } from "./scale.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");

const laws = read("LAWS.md");
if (!laws) {
  console.error("LAWS.md not found — nothing to check.");
  process.exit(2);
}

let fail = 0;
let gaps = 0;
const ok = (label) => console.log(`  ok    ${label}`);
const bad = (label, detail) => { fail++; console.log(`  FAIL  ${label}\n          ${detail}`); };
// A gap that the document declares in its own text is honest and does not fail
// the build. A gap it does not declare is a wish pretending to be a check.
const gap = (label) => { gaps++; console.log(`  GAP   ${label} — declared unimplemented in LAWS.md`); };

/* 1 ── every check id named in LAWS.md is implemented somewhere ───────── */

console.log("\nevery check LAWS.md names is implemented");

// Rule ids the static linter can emit, read from its own add() calls.
const linter = read("lint/moma-lint.mjs");
const staticRules = new Set([...linter.matchAll(/add\("([a-z-]+)"/g)].map((m) => m[1]));

// The runtime auditor implements its rules as report keys, not string ids.
const auditor = read("audit/near-miss.browser.js");
const runtimeRules = new Set();
if (/nearMisses\s*=/.test(auditor)) runtimeRules.add("near-miss");
if (/raggedRows\s*=/.test(auditor)) runtimeRules.add("ragged-row");
if (/orphans\s*=/.test(auditor)) runtimeRules.add("orphan-grid");

// A "**Check** ·" line may run on for several lines; read to the next blank line.
const claimed = new Map(); // id -> declared-unimplemented?
const lines = laws.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].startsWith("**Check**")) continue;
  let block = "";
  for (let j = i; j < lines.length && lines[j].trim() !== ""; j++) block += lines[j] + "\n";
  const declaredGap = /NOT IMPLEMENTED/i.test(block);
  for (const m of block.matchAll(/`([a-z-]+)`/g))
    claimed.set(m[1], claimed.get(m[1]) || declaredGap);
}

for (const [id, declaredGap] of [...claimed].sort((a, b) => a[0].localeCompare(b[0]))) {
  if (staticRules.has(id)) ok(`${id} — static linter`);
  else if (runtimeRules.has(id)) ok(`${id} — runtime auditor`);
  else if (declaredGap) gap(id);
  else bad(`${id} — named in LAWS.md, implemented nowhere`,
           `a law whose check does not exist is a wish. Implement it, or stop claiming it.`);
}

/* 2 ── every number LAWS.md presents as legal is legal ────────────────── */

console.log("\nevery value LAWS.md quotes as legal is legal in scale.mjs");

// Law V's density table: the minmax minimums the prose permits.
const lawV = /## V\.[\s\S]*?(?=\n## )/.exec(laws)?.[0] ?? "";
const declaredDensities = new Set(
  [...lawV.matchAll(/^\|\s*(\d{3})\s*(?:\([a-z]+\))?\s*\|/gm)].map((m) => Number(m[1])),
);
for (const m of lawV.matchAll(/may use three:\s*([\d,\s]+)/g))
  for (const n of m[1].split(",")) if (n.trim()) declaredDensities.add(Number(n.trim()));

const legalDensities = new Set(Object.values(DENSITY));
if (declaredDensities.size === 0) {
  bad("Law V quotes no density values", "the table or sentence changed shape — update this check");
} else {
  for (const d of [...declaredDensities].sort((a, b) => a - b)) {
    if (legalDensities.has(d)) ok(`Law V density ${d}px`);
    else bad(`Law V density ${d}px is not a legal density`,
             `scale.mjs permits ${[...legalDensities].sort((a, b) => a - b).join("/")}px. ` +
             `A page obeying Law V would fail grid-density.`);
  }
}

// Law V's published column-count table must match the formula, cell by cell.
// This table is the reason the law is believable; a wrong cell in it teaches the
// wrong number to everyone who reads the law.
const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const vRows = lawV.split("\n").filter((l) => l.trim().startsWith("|"));
const header = vRows.find((l) => /minmax/.test(l));
if (!header) {
  bad("Law V has no column-count table", "the table changed shape — update this check");
} else {
  const vws = cells(header).slice(2).map((c) => Number(c.replace(/\D/g, "")));
  const colsAt = (min, vw) => {
    const margin = vw < 768 ? 16 : GRID.margin;
    return Math.max(1, Math.floor((vw - 2 * margin + GRID.gutter) / (min + GRID.gutter)));
  };
  let seen = 0;
  for (const line of vRows) {
    const c = cells(line);
    const min = Number((c[0] || "").replace(/\D/g, ""));
    if (!min || !Object.values(DENSITY).includes(min)) continue;
    seen++;
    const published = c.slice(2).map(Number);
    const computed = vws.map((vw) => colsAt(min, vw));
    if (JSON.stringify(published) === JSON.stringify(computed))
      ok(`Law V table ${min}px -> ${computed.join("/")} cols at ${vws.join("/")}px`);
    else
      bad(`Law V table row ${min}px is wrong`,
          `published ${published.join("/")} but the formula gives ${computed.join("/")}`);
  }
  if (seen !== Object.keys(DENSITY).length)
    bad(`Law V table lists ${seen} densities, DENSITY has ${Object.keys(DENSITY).length}`,
        `every legal density must appear in the law's table`);
}

// Law II's scale block must be the scale, exactly.
const lawII = /## II\.[\s\S]*?(?=\n## )/.exec(laws)?.[0] ?? "";
const quotedScale = /```\n([\d\s]+)\n```/.exec(lawII)?.[1];
if (!quotedScale) {
  bad("Law II quotes no spacing scale", "the code block changed shape — update this check");
} else {
  const got = quotedScale.trim().split(/\s+/).map(Number);
  if (JSON.stringify(got) === JSON.stringify(SPACE)) ok(`Law II scale matches SPACE (${SPACE.length} values)`);
  else bad("Law II scale does not match SPACE", `LAWS.md: ${got.join(" ")}\n          scale.mjs: ${SPACE.join(" ")}`);
}

// Law III's type sizes and leadings.
const lawIII = /## III\.[\s\S]*?(?=\n## )/.exec(laws)?.[0] ?? "";
for (const m of lawIII.matchAll(/(micro|body|display)\s+(\d+)\/(\d+)/g)) {
  const [, role, size, lead] = m;
  if (TYPE[role] === Number(size)) ok(`Law III ${role} size ${size}px`);
  else bad(`Law III ${role} size ${size}px`, `scale.mjs TYPE.${role} = ${TYPE[role]}px`);
}

// Law VIII's hairline and Law IX's radius.
if (new RegExp(`\\(${HAIRLINE}px\\)`).test(laws)) ok(`Law VIII hairline ${HAIRLINE}px`);
else bad("Law VIII does not state the hairline width", `HAIRLINE = ${HAIRLINE}`);
if (RADIUS === 0 && /Zero\.|radius/i.test(laws)) ok(`Law IX radius ${RADIUS}`);

/* 3 ── no dangling file references ────────────────────────────────────── */

console.log("\nno document points at a file that does not exist");
const refs = new Set();
for (const src of ["LAWS.md", "README.md", "lint/moma-lint.mjs", "audit/near-miss.browser.js"])
  for (const m of read(src).matchAll(/\b((?:lint|audit|docs|examples)\/[A-Za-z0-9._/-]+\.(?:mjs|js|md|html))/g))
    refs.add(m[1]);
for (const r of [...refs].sort()) {
  if (existsSync(join(root, r))) ok(r);
  else bad(`${r} is referenced but does not exist`, `either write it or remove the reference`);
}

const gapNote = gaps ? `  (${gaps} declared gap${gaps > 1 ? "s" : ""} — visible, not hidden)` : "";
console.log(
  fail
    ? `\n${fail} FAILED — the rulebook disagrees with itself\n`
    : `\nthe prose and the code agree${gapNote}\n`,
);
process.exit(fail ? 1 : 0);
