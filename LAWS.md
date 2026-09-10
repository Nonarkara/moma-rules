# The Ten Laws

> "MoMA rules dictate that everything has to be aligned and there should be no
> loose edges to show that the builder is an amateur."
> — Dr Non, 2026-08-20

Rams gave Braun ten principles. These are ten laws for the screen. A principle
is something you agree with. A law is something that fails your build.

Every law below has a **check** — the rule id that enforces it. A law without a
check is a wish, and wishes are why the last three MoMA passes did not hold.

---

## I. ONE ORIGIN

*Every left edge on a page descends from a single origin value. Every right edge
descends from its mirror. There is one horizontal origin per document, not one
per component.*

**Why.** A page's left margin is not a style, it is a datum. When two components
establish the same intended margin by different mechanisms — one with `padding`,
one with `border`, one with `margin` — they land in different places, because a
border occupies layout space and padding of the same value does not.

**The corollary that costs the most:** *a hairline may not occupy layout space.*
A 1px `border` on a container pushes every child 1px inward. A 1px rule drawn
with `box-shadow: inset`, `outline`, or a pseudo-element does not. Frame with
shadow; reserve `border` for the rare case where the line is meant to displace.

**Measured.** See [docs/why-lines-dont-align.md](docs/why-lines-dont-align.md):
on a live production page, `.rams-masthead` set its origin with `padding-left:
22px` and landed its children at x=22. `.rams-cell-grid` set the same intended
origin with `border: 1px` and landed its children at x=23. 124 elements on one
edge, 62 on the other, 1px apart, across every screen of the product.

**Check** · `near-miss` (runtime) · `origin-mechanism` (static — **DECLARED,
NOT IMPLEMENTED**; see [docs/law-to-check.md](docs/law-to-check.md). Deciding what
this check may flag without drowning an adopting codebase in false positives is
an open design question, and naming it here rather than quietly implementing a
guess is the honest state.)

---

## II. THE SCALE

*Spacing comes from a closed set of fifteen values. There is no sixteenth.*

```
0  4  8  12  16  20  24  32  40  48  64  80  96  120  160
```

**Why.** Two elements align when their values come from the same small set. They
cannot align when the set is open. This is arithmetic, not taste: a codebase with
86 distinct spacing values has 86 possible edges per axis, and no two of them
were chosen to relate.

**Measured.** daytraders `src/`: **86 distinct spacing values, 5,028 uses, 40.1%
off any 4px grid** — including 1, 3, 5, 7, 9, 35, 37, 38, 95, 97, 118, 222px.
day2 `app/src/`: 25 distinct, 37.1% off-grid.

The scale is not evenly spaced on purpose. It is dense where decisions are
frequent (4–24, the inside of a card) and sparse where they are rare (64–160,
the space between sections). A linear scale wastes resolution at the top.

**Check** · `spacing-scale`

---

## III. SIZE AND LEADING ARE ONE TOKEN

*Three type sizes — micro 11/16, body 14/20, display 32/36. A size may never be
chosen independently of its leading.*

The count is ours (it is Rams, not MoMA — see
[docs/moma-vs-us.md](docs/moma-vs-us.md)). The **binding** is MoMA's, and it is
the part that actually protects the rhythm: measured on moma.org, type is set
solid, with only two leading ratios in the entire production stylesheet (1.0 and
1.3333) and ~86% of text at 1.0. Size and leading derive from one token there,
so no one can pick a size and leave the leading behind.

Line-heights are on the 4-grid even though the sizes are not. Type sits on the
rhythm even when its sizes do not.

**Check** · `type-scale`

---

## IV. THE GRID FILLS

*A grid of C columns holds N items where `N % C == 0`. Always.*

**Why.** A 4-column grid with 7 items leaves one cell empty, and the eye reads
the hole before it reads the content. The empty cell is the single most legible
amateur mark on a page, because it is the one thing on screen that was clearly
not decided.

**The rule is: curate the universe to fit the grid, never pad the grid to fit
the universe.** The 2026-08-20 pass took five deploys to learn this — 7 items in
4 columns, then 8 in 4, then 8 in 3, before landing on 9 in 3.

```
 7 items ÷ 4 cols = 4 + 3   ✗ one orphan
 8 items ÷ 4 cols = 4 + 4   ✓
 8 items ÷ 3 cols = 3+3+2   ✗ one orphan
 9 items ÷ 3 cols = 3+3+3   ✓
12 items ÷ 3 cols           ✓   ÷ 4 cols ✓   ÷ 2 cols ✓   ÷ 6 cols ✓
```

Twelve is the friendliest count on a page: it divides by 2, 3, 4, and 6. Where
you can choose the number of things, choose twelve.

**Check** · `orphan-grid` (runtime)

---

## V. ONE RHYTHM PER PAGE

*`repeat(auto-fit, minmax(Xpx, 1fr))` picks its own column count from X and the
container width. Each distinct X is another rhythm. A page may use four, and they
are span widths of the master grid — 192, 296, 400, 608. Not thirty-one.*

**Measured.** daytraders uses **31 distinct minmax minimums**, which at a 1280px
viewport produce **12 different column counts** — 11, 10, 9, 8, 7, 6, 5, 4, 3
columns, stacked down one page. Sections whose columns disagree cannot have
aligned interior edges. This is guaranteed by construction, not by carelessness.

The permitted minimums are **derived, not chosen**: each is the width of a span
of the 12-column grid, so `auto-fit` resolves to a column count that divides 12
at every viewport. That is the whole reason they are legal and 160/220/280 are
not — the latter resolve to 5, 7, 9 and 11 columns, which no 12-column page can
align to and which cannot fill a row without an orphan (Law IV).

| minmax | span | 390px | 768px | 1024px | 1280px | 1440px |
|---|---|---|---|---|---|---|
| 192 (sixth)   | 2 of 12 | 1 | 3 | 4 | 6 | 6 |
| 296 (quarter) | 3 of 12 | 1 | 2 | 3 | 4 | 4 |
| 400 (third)   | 4 of 12 | 1 | 1 | 2 | 3 | 3 |
| 608 (half)    | 6 of 12 | 1 | 1 | 1 | 2 | 2 |

Four densities, four rhythms, every one of them a divisor of 12, and a reader who
can see the page is one object.

**This law said 160 / 220 / 280 until 2026-09-10.** Those are the three values
`lint/scale.mjs` names in its own comment as counter-examples, so a page obeying
the law failed `grid-density` on every line. `self-check.mjs` reported "all
derivations hold" the entire time, because it verified `scale.mjs` against itself
and never read this file. `lint/laws-check.mjs` now reads it — see
[docs/law-to-check.md](docs/law-to-check.md).

**Check** · `grid-density`

---

## VI. SAME SKELETON

*Every cell in a row has the same skeleton: same `min-height`, same number of
lines, same slots in the same order. A cell that wraps to four lines beside cells
of two makes the row look unplanned, because it was.*

Long values get `text-overflow: ellipsis` and a `title`. The full string is not
more important than the row.

**Check** · `ragged-row` (runtime — flags sibling height spread > 6px)

---

## VII. NO NEAR MISS

*Two edges are the same, or they are clearly different. Nothing between.*

Delta 0 reads as alignment. Delta > 6px reads as an intentional offset. Delta
1–6px reads as a failed attempt at alignment — and that band is precisely what
the eye catches and calls amateur. It is invisible in code review and obvious on
screen, which is why it survives every prose-only design pass.

**Measured.** The production home page carries **856 near-miss edge pairs** at
1280×900. The heaviest single pair is a 1px split affecting 186 elements.

**Check** · `near-miss` (runtime)

---

## VIII. ONE HAIRLINE

*One line weight (1px) and one line colour. A 2px border is a second design
language arguing with the first.*

MoMA holds the same ratio and is worth quoting as precedent: rules are `.1rem`
(1px) solid; `.2rem` and `.3rem` exist only as deliberate emphasis, never as a
default border. And the surface they sit on is achromatic — 876KB of production
CSS containing **exactly three chromatic values**, because the colour is
supposed to be in the art, not the chrome.

**Check** · `hairline`

---

## IX. ZERO RADIUS

*Corners are square. Not "subtle". Zero. True circles (`50%`) are exempt because
a circle is a shape, not a softened rectangle.*

**Check** · `radius-zero`

---

## X. NEVER SAY A NUMBER TWICE

*A value appears once per screen. A chip reading "8 TODAY" above a list whose
header reads "TODAY 8" is the build being lazy in public.*

Hierarchy follows semantic weight: the thing the reader looks up by (the symbol,
the name, the number) is the largest thing in the cell. The category label is
metadata — a 9px eyebrow at 75% opacity, not a coloured button. When the label
outweighs the datum, the hierarchy is inverted.

**Check** · human review (this is the one law a machine cannot check, which is
why it is last — and why the other nine are automated, so attention is left over
for this one.)
