# MoMA Rules

**Dr Non's layout canon, in a form that executes.**

> "MoMA rules dictate that everything has to be aligned and there should be no
> loose edges to show that the builder is an amateur."

Three times these rules were written down as prose. Three times the pages drifted
back. This repository is the fourth attempt, and the difference is that here the
rules are **arithmetic and checks**, not advice.

**[→ The demonstration page](examples/index.html)** · **[→ The Ten Laws](LAWS.md)** ·
**[→ Why the lines still don't align](docs/why-lines-dont-align.md)**

> **[`docs/law-to-check.md`](docs/law-to-check.md) — the laws audited against their
> own checks (2026-09-10).** Six real machine checks, one declared-unimplemented,
> four laws outside CI, and until this audit two checks that contradicted the law
> they enforce. A page obeying Law V failed the build. Read it before trusting any
> claim of enforcement on this page.
>
> **v2 is proposed, not adopted:** [`docs/proposals/v2-architecture.md`](docs/proposals/v2-architecture.md)
> · study deck: [`docs/deck/`](docs/deck/)

> **Before the rules — [`BUILDER.md`](BUILDER.md): how this repository expects you to work.**
> Build something rough enough to tear apart. Imagine a human doing the job before you
> prompt an agent to do it. Give the agent the real source material, not a description of
> it. Test, because a hypothesis proves nothing. Have a second, different agent look for
> the flaw. The law in this repository is the floor, not the work.

---

## The short version

| | |
|---|---|
| **Base** | 4px |
| **Spacing** | a closed set of 15 values — `0 4 8 12 16 20 24 32 40 48 64 80 96 120 160` |
| **Type** | three sizes — 11 / 14 / 32, leading 16 / 20 / 36 |
| **Grid** | 12 × 88 + 11 × 16 + 2 × 24 = **1280** |
| **Densities** | only span widths — 192 / 296 / 400 / 608 (Law V said 160/220/280 until 2026-09-10) |
| **Hairline** | 1px, one colour, **and it never occupies layout space** |
| **Radius** | 0 (true circles exempt) |

## Why the last three passes failed

Measured on production, 2026-09-08 — the full forensic report is
[docs/why-lines-dont-align.md](docs/why-lines-dont-align.md):

1. **The rules were prose.** `grep -ci moma CLAUDE.md` → 0. No test, no lint, no
   CI job mentioned alignment. The one pass that happened was home-page only, and
   its own closing section lists five pages it never reached.
2. **There was no scale.** 86 distinct spacing values across `src/`, 40.1% off any
   4px grid. You cannot align 86 values with more care. The set has to close.
3. **The master origin was off-scale.** `--cockpit-x: 22px`.
4. **The hairline moved everything it framed.** A container with `border: 1px`
   lands its children 1px inside a container that uses `padding` — same intent,
   different mechanism. 124 elements on one edge, 62 on the other.
5. **Local fixes made it globally worse.** Correcting #4 live moved ten elements
   onto the origin and pushed the page's near-miss count *up*, 856 → 905, because
   the drift is ambient. Alignment cannot be repaired element by element.

## The two checks

Alignment has a static half and a runtime half, and reading code only ever
catches the first one.

### Static — runs on source, in CI

```bash
node lint/moma-lint.mjs src --strict
```

Catches `spacing-scale`, `grid-density`, `type-scale`, `radius-zero`, `hairline`.

### Runtime — runs on a laid-out page

```js
// paste audit/near-miss.browser.js into any console
```

Catches what does not exist until the browser has done layout:

- **near-miss** — edge pairs 1–6px apart. Two edges are the same or clearly
  different; the band between is the amateur mark.
- **ragged-row** — siblings in one row whose heights differ by more than 6px.
- **orphan-grid** — N items in C columns where `N % C ≠ 0`.

## Adopting it on a codebase that already has thousands of violations

Do not turn it on strict. It will be disabled within a day. Ratchet instead:

```bash
node lint/moma-lint.mjs src --update-baseline   # record today's debt
node lint/moma-lint.mjs src                     # fails only on NEW violations
```

The baseline **may only shrink**. `--update-baseline` refuses to write a larger
one, so the debt is a one-way valve: new work is clean, old work improves when
it is touched, and nobody has to stop and fix 2,000 things first.

## Self-verification

Every number published in these docs is recomputed from the source of truth:

```bash
node lint/self-check.mjs    # is the arithmetic internally consistent?
node lint/laws-check.mjs    # does the prose agree with the arithmetic?
```

`self-check` re-derives the page arithmetic, proves every divisor of 12 yields an
integer span that refills the row, and confirms all four densities resolve to a
divisor of 12 at 390 / 768 / 1024 / 1280 / 1440.

`laws-check` exists because that was not enough. `self-check` verifies
`scale.mjs` against itself and never opened `LAWS.md` — so it reported "all
derivations hold" for as long as Law V mandated three density values that
`scale.mjs` names as counter-examples and the linter fails on sight. A check that
cannot see the document it protects is not a check. `laws-check` reads the prose
and asserts that every check id named in `LAWS.md` is implemented, every value
the laws quote as legal is legal, every cell of Law V's column-count table
matches the formula, and no document points at a file that does not exist.

A rulebook with a wrong number in it teaches the wrong number to everyone who
reads it. CI runs all three, and also lints the demonstration page — if the
example ever breaks its own laws, the build fails.

## Layout

```
LAWS.md                      the ten laws, each with its check
lint/scale.mjs               the single source of numeric truth
lint/moma-lint.mjs           static checker + ratchet
lint/self-check.mjs          proves the published arithmetic
lint/laws-check.mjs          proves the prose matches the arithmetic
audit/near-miss.browser.js   runtime checker (console paste — not yet in CI)
docs/grid.md                 the grid, fully computed
docs/why-lines-dont-align.md the forensic report
docs/law-to-check.md         every law audited against its own check
docs/styles/luggage-tag.md   a style that fits the laws
docs/moma-study.md           what MoMA actually does (primary research)
docs/moma-vs-us.md           MoMA observed vs. our deliberate divergences
docs/deck/                   the MoMA Rules 2.0 study deck, slide by slide
docs/proposals/              proposed changes — filed, not in force
examples/index.html          the demonstration page — obeys its own laws
```

## The one law a machine cannot check

Law X — *never say a number twice*, and *hierarchy follows semantic weight*. It
is last on purpose. The other nine are automated precisely so that human
attention is left over for the one that needs it.
