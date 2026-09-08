# The Grid, computed

Nothing on this page is a preference. Every number is derived from four
starting values, and the derivation is checkable.

## The four values

```
columns   12
column    88px
gutter    16px
margin    24px
```

## The page

```
  12 columns x  88px   = 1056
+ 11 gutters x  16px   =  176
─────────────────────────────
  content width        = 1232
+  2 margins x  24px   =   48
─────────────────────────────
  page width           = 1280
```

1280 is not chosen because it is a common desktop width. It **falls out** of
choosing a column of 88 (= 4 × 22) and a gutter of 16. Had we chosen a column of
80, the page would be 1184. The point is that the page width is a consequence,
not an input — which is why the content never has to be nudged to fit it.

## Why twelve

Twelve is the smallest useful number with four non-trivial divisors: 2, 3, 4, 6.
Every one of them produces an **integer** span:

| you want | span | width | check |
|---|---|---|---|
| twelfths | 1 | 88 | 12 × 88 + 11 × 16 = 1232 |
| sixths | 2 | 192 | 6 × 192 + 5 × 16 = 1232 |
| quarters | 3 | 296 | 4 × 296 + 3 × 16 = 1232 |
| thirds | 4 | 400 | 3 × 400 + 2 × 16 = 1232 |
| halves | 6 | 608 | 2 × 608 + 1 × 16 = 1232 |
| full | 12 | 1232 | 1 × 1232 = 1232 |

`span(s) = s × 88 + (s − 1) × 16`

Every row reconciles to exactly 1232. No remainder is left to absorb, so no
component needs a "nudge" — and nudges are where the 1px drift comes from.

## The densities, derived

A responsive grid is normally written `repeat(auto-fit, minmax(Xpx, 1fr))`, and
X is normally picked by eye. That is the single largest source of misalignment
in a large codebase, because each X resolves to its own column count.

The fix is to allow only those X that **are span widths**. Verified across every
common viewport (margins 16 below 768, 24 above):

| minmax | 390 | 768 | 1024 | 1280 | 1440 | divides 12? |
|---|---|---|---|---|---|---|
| 88 (span 1) | 3 | 7 | 9 | 12 | 13 | **no** |
| **192** (span 2) | 1 | 3 | 4 | 6 | 6 | yes |
| **296** (span 3) | 1 | 2 | 3 | 4 | 4 | yes |
| **400** (span 4) | 1 | 1 | 2 | 3 | 3 | yes |
| **608** (span 6) | 1 | 1 | 1 | 2 | 2 | yes |

Four legal densities. Every one of them, at every width, resolves to a count
that divides 12 — so its cell edges fall on master column lines, and a
twelve-item collection fills it without an orphan (Law IV).

Span 1 (88px) is excluded: it yields 7 and 13 columns, which nothing can align
to. Twelve columns is the *drawing* grid; it is not a legal auto-fit density.

## Compare: what the codebase does today

daytraders uses **31 distinct minmax minimums** — 5, 38, 42, 56, 64, 72, 78, 88,
90, 92, 96, 100, 104, 110, 118, 120, 130, 140, 150, 160, 180, 190, 200, 220,
240, 260, 280, 300, 320, 360, 440 — producing **12 different column counts on a
single 1280px page**. Sections at 5, 7 and 9 columns cannot share an interior
edge with anything, and none of them can be filled without an orphan.

## Mobile

Below 768 the margin drops to 16 and the column becomes fluid:

```
column = (100vw − 32 − (cols − 1) × 16) / cols
```

The *column* is fluid; the **gutter and margin stay on the scale**. This is the
line to hold: fluid widths are fine, fluid spacing is not, because spacing is
what two neighbouring components must agree on.

## In CSS

```css
:root {
  --col: 88px;
  --gutter: 16px;
  --margin: 24px;
  --content: 1232px;

  --span-2: 192px;   /* sixths   */
  --span-3: 296px;   /* quarters */
  --span-4: 400px;   /* thirds   */
  --span-6: 608px;   /* halves   */
}

.page {
  max-width: var(--content);
  margin-inline: auto;
  padding-inline: var(--margin);
}

/* the only four legal responsive grids */
.grid-sixths   { display: grid; gap: var(--gutter);
                 grid-template-columns: repeat(auto-fit, minmax(var(--span-2), 1fr)); }
.grid-quarters { display: grid; gap: var(--gutter);
                 grid-template-columns: repeat(auto-fit, minmax(var(--span-3), 1fr)); }
.grid-thirds   { display: grid; gap: var(--gutter);
                 grid-template-columns: repeat(auto-fit, minmax(var(--span-4), 1fr)); }
.grid-halves   { display: grid; gap: var(--gutter);
                 grid-template-columns: repeat(auto-fit, minmax(var(--span-6), 1fr)); }
```

## The hairline grid, done correctly

The pattern where `gap: 1px` over a coloured background draws every internal
rule is excellent and should be kept. Only the frame changes — Law I:

```css
/* WRONG — the border displaces every child by 1px */
.hairline-grid { display: grid; gap: 1px; background: var(--line);
                 border: 1px solid var(--line); }

/* RIGHT — the frame paints without occupying layout space */
.hairline-grid { display: grid; gap: 1px; background: var(--line);
                 box-shadow: inset 0 0 0 1px var(--line); }
```

Both draw an identical frame. Only the second leaves the children on the page's
origin.
