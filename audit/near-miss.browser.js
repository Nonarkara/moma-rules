/**
 * NEAR-MISS — the runtime half of the enforcement.
 *
 * The static linter reads source. This reads the laid-out page, because the
 * violation the eye actually catches is not "6px is off the scale", it is
 * "these two lines are ALMOST in the same place".
 *
 * The insight: two edges are either the SAME (delta 0 — reads as alignment)
 * or CLEARLY DIFFERENT (delta > 6px — reads as intentional offset). An edge
 * pair 1-6px apart reads as a failed attempt at alignment. That band is the
 * amateur mark. It is invisible in code review and obvious on screen.
 *
 * Paste into any console, or run via audit/near-miss.mjs (Playwright).
 * Returns a report object; also logs a readable table.
 */
(function moma(NEAR_MISS = 6, MIN_SHARE = 2) {
  const els = [...document.querySelectorAll("body *")].filter((el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 8 && r.height >= 8 && r.width < innerWidth * 1.5;
  });

  const label = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim()
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const txt = (el.textContent || "").trim().slice(0, 24).replace(/\s+/g, " ");
    return `${el.tagName.toLowerCase()}${id}${cls}${txt ? ` "${txt}"` : ""}`;
  };

  // collect edge positions per axis
  const axes = { left: new Map(), right: new Map(), top: new Map(), bottom: new Map() };
  for (const el of els) {
    const r = el.getBoundingClientRect();
    const push = (axis, v) => {
      const k = Math.round(v * 2) / 2; // half-pixel resolution
      if (!axes[axis].has(k)) axes[axis].set(k, []);
      axes[axis].get(k).push(el);
    };
    push("left", r.left); push("right", r.right);
    push("top", r.top + scrollY); push("bottom", r.bottom + scrollY);
  }

  const nearMisses = [];
  for (const [axis, map] of Object.entries(axes)) {
    const vals = [...map.keys()].filter((v) => map.get(v).length >= MIN_SHARE).sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      for (let j = i + 1; j < vals.length; j++) {
        const d = vals[j] - vals[i];
        if (d === 0) continue;
        if (d > NEAR_MISS) break;
        nearMisses.push({
          axis, a: vals[i], b: vals[j], delta: Math.round(d * 100) / 100,
          weight: map.get(vals[i]).length + map.get(vals[j]).length,
          sample: [label(map.get(vals[i])[0]), label(map.get(vals[j])[0])],
        });
      }
    }
  }
  nearMisses.sort((x, y) => y.weight - x.weight || x.delta - y.delta);

  // unequal siblings inside the same grid/flex row — the "same skeleton" rule
  const raggedRows = [];
  for (const el of els) {
    const s = getComputedStyle(el);
    if (s.display !== "grid" && s.display !== "flex") continue;
    const kids = [...el.children].filter((k) => k.getBoundingClientRect().height >= 8);
    if (kids.length < 3) continue;
    const hs = kids.map((k) => Math.round(k.getBoundingClientRect().height));
    const min = Math.min(...hs), max = Math.max(...hs);
    if (max - min > NEAR_MISS)
      raggedRows.push({ container: label(el), n: kids.length, min, max, spread: max - min });
  }
  raggedRows.sort((a, b) => b.spread - a.spread);

  // orphan grid cells — N items in C columns where N % C !== 0
  const orphans = [];
  for (const el of els) {
    const s = getComputedStyle(el);
    if (s.display !== "grid") continue;
    const cols = s.gridTemplateColumns.split(" ").filter(Boolean).length;
    const n = [...el.children].filter((k) => k.getBoundingClientRect().height >= 8).length;
    if (cols > 1 && n > cols && n % cols !== 0)
      orphans.push({ container: label(el), items: n, cols, empty: cols - (n % cols) });
  }

  const report = {
    url: location.href,
    viewport: `${innerWidth}×${innerHeight}`,
    elements: els.length,
    nearMisses: nearMisses.slice(0, 25),
    nearMissTotal: nearMisses.length,
    raggedRows: raggedRows.slice(0, 12),
    raggedTotal: raggedRows.length,
    orphans,
  };
  console.log(`MoMA near-miss audit · ${report.viewport} · ${els.length} elements`);
  console.log(`  near-miss edges : ${report.nearMissTotal}`);
  console.log(`  ragged rows     : ${report.raggedTotal}`);
  console.log(`  orphan grids    : ${orphans.length}`);
  return report;
})
