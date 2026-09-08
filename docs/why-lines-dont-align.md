# Why the lines still don't align

*A forensic report. Every number here was measured on production on 2026-09-08,
not estimated.*

Dr Non's question: **"Sometimes I say MoMA rules and the system still allows
lines that don't align. Why?"**

There are five answers. Only the first is about discipline; the other four are
mechanical, which is why saying the words has never been enough.

---

## 1. The rules were prose, and prose does not execute

The MoMA rules lived in `docs/lessons/2026-08-20-the-moma-pass.md` — a lesson
doc describing six fixes that were made once, on one page.

Verified on 2026-09-08:

- `grep -ci moma CLAUDE.md` → **0**. The rules are not in the file every agent reads.
- No test, lint rule, or CI job in either repo mentions alignment.
- The lesson doc's own closing section says the audit was **home-only**, and lists
  `/trade`, `/signals`, `/portfolio`, `/simulate`, `/plan` as never audited.

A rule that nothing enforces is re-litigated by every new component, and every
new component is written by someone (or something) that has not read the lesson.
The first fix was real. It just had no mechanism to propagate.

---

## 2. There was no scale, so alignment was not arithmetically possible

Two elements land on the same edge when their spacing values come from the same
small set. Measured across `src/`:

| | daytraders | day2 |
|---|---|---|
| distinct spacing values | **86** | 25 |
| total uses | 5,028 | 402 |
| off any 4px grid | **40.1%** | 37.1% |
| spacing tokens defined | **1** (`--gap: 12px`) | 0 |

The off-grid values include 1, 3, 5, 7, 9, 11, 13, 15, 18, 22, 26, 34, 35, 37,
38, 42, 45, 50, 58, 70, 95, 97, 110, 118, 222px.

You cannot align 86 values. Not with more care, not with more review. The set has
to close first — that is Law II, and it is the precondition for every other law.

---

## 3. The page's master origin was itself off the scale

```css
--cockpit-x: 22px;   /* the horizontal origin every plane inherits */
```

22 is not a multiple of 4. The comment above it in `globals.css` is correct that
every plane reads this value "so the edges coincide by construction" — and they
do coincide, at a value that no other spacing in the system can meet. The datum
was sound; its value was not on the scale.

---

## 4. The hairline moved everything it framed

This is the mechanical heart of it, and it is invisible in code review.

Measured live at 1280×900:

| container | how it sets its origin | box left | first child left |
|---|---|---|---|
| `.rams-masthead` | `padding-left: 22px`, no border | 0 | **22** |
| `.rams-cell-grid` | `border: 1px`, `padding-left: 0` | 22 | **23** |
| `.picks-grid` | `border: 1px`, `padding-left: 0` | 22 | **23** |

Both containers intend the same origin. Both are "correct" in isolation. But a
border participates in layout and padding of the same value does not, so every
cell inside a framed grid sits exactly one pixel inside the wordmark above it.

At the time of measurement: **124 elements on x=22, 62 elements on x=23.**

The pattern that causes it is a good pattern — the hairline-grid trick, where
`gap: 1px` over a `background: var(--line)` draws every internal rule with no
extra markup:

```css
.rams-cell-grid {
  display: grid;
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);   /* ← this line displaces every child */
}
```

The fix is one property: frame with a shadow, which paints without occupying
space.

```css
  box-shadow: inset 0 0 0 1px var(--line);
```

Applied live, this moved the grid's child shift from **1px to 0** and pulled ten
elements onto the shared origin (x=22: 124 → 134).

---

## 5. …and fixing it locally made the page globally worse

This is the finding that matters most, and it is the reason the previous MoMA
passes kept regressing.

With the same fix applied live, the page-wide near-miss count went **up**:

```
before fix : 856 near-miss edge pairs
after  fix : 905 near-miss edge pairs   (+49)
```

The container-level fix was correct and did what it claimed. But pulling one
family of elements onto the origin moved all of their descendants 1px too, and
those descendants then landed 1px away from a *different* family that was never
on the origin either. The 1px drift is not a bug in two components. It is the
ambient state of a page with 86 spacing values and 31 column rhythms.

**Alignment cannot be fixed element by element.** Every local correction
redistributes the error. It can only be fixed by closing the value sets — one
origin, fifteen spacings, three densities — and then holding them closed with a
check that runs on every commit.

That is what this repository is.

---

## What actually holds

| Failure | Law | Enforced by |
|---|---|---|
| rules live in prose | — | `lint/` in CI, baseline that may only shrink |
| open spacing set | II | `spacing-scale` |
| origin off-scale | I | `spacing-scale` on the token |
| hairline displaces children | I | `origin-mechanism` |
| 31 column rhythms | V | `grid-density` |
| orphan cells | IV | `orphan-grid` (runtime) |
| ragged rows | VI | `ragged-row` (runtime) |
| 1–6px drift | VII | `near-miss` (runtime) |

The static half runs on source in CI. The runtime half runs against a rendered
page, because the near-miss, the orphan and the ragged row do not exist until
the browser has done the layout — which is exactly why reading the code has
never caught them.

## Method

- Static: `node lint/moma-lint.mjs <dir> --strict`
- Runtime: `audit/near-miss.browser.js` evaluated in the page at a fixed viewport
- Live measurements taken at `https://day.nonarkara.org`, 1280×900, 2026-09-08,
  1,793 laid-out elements
