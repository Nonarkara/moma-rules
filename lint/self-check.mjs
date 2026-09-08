#!/usr/bin/env node
/**
 * The rulebook checks itself. Every derived claim in docs/ is recomputed here;
 * if the arithmetic in the prose ever stops matching the arithmetic in the
 * code, this fails. A rulebook with a wrong number in it teaches the wrong
 * number to everyone who reads it.
 */
import { GRID, span, DENSITY, SPACE, BASE } from "./scale.mjs";

let fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}: ${JSON.stringify(got)}${ok ? "" : ` != ${JSON.stringify(want)}`}`);
};

console.log("\nthe page reconciles");
eq("12 columns + 11 gutters", GRID.columns * GRID.column + (GRID.columns - 1) * GRID.gutter, GRID.content);
eq("content + 2 margins", GRID.content + 2 * GRID.margin, GRID.page);

console.log("\nevery divisor of 12 gives an integer span that refills the row");
for (const s of [1, 2, 3, 4, 6, 12]) {
  const n = GRID.columns / s;
  eq(`${n} x span(${s})`, n * span(s) + (n - 1) * GRID.gutter, GRID.content);
}

console.log("\nevery legal density resolves to a divisor of 12 at every viewport");
const divisors = new Set([1, 2, 3, 4, 6, 12]);
for (const [name, min] of Object.entries(DENSITY)) {
  for (const vw of [390, 768, 1024, 1280, 1440]) {
    const margin = vw < 768 ? 16 : GRID.margin;
    const cols = Math.max(1, Math.floor((vw - 2 * margin + GRID.gutter) / (min + GRID.gutter)));
    const ok = divisors.has(cols);
    if (!ok) fail++;
    console.log(`  ${ok ? "ok  " : "FAIL"}  ${name}(${min}) @ ${vw} -> ${cols} cols`);
  }
}

console.log("\nthe scale is closed and on base");
eq("every value is a multiple of BASE", SPACE.every((v) => v % BASE === 0), true);
eq("no duplicates", new Set(SPACE).size, SPACE.length);
eq("ascending", [...SPACE].sort((a, b) => a - b), SPACE);

console.log(fail ? `\n${fail} FAILED\n` : "\nall derivations hold\n");
process.exit(fail ? 1 : 0);
