English · [简体中文](law-to-check.zh-CN.md) · [ไทย](law-to-check.th.md)

# Law → check → research

**Audited:** 2026-09-10 · reproducible with `node lint/laws-check.mjs`

> "Every law below has a **check** — the rule id that enforces it. A law without
> a check is a wish, and wishes are why the last three MoMA passes did not hold."
> — [`LAWS.md`](../LAWS.md)

That sentence is the repository's central promise. This page tests it, because a
promise about enforcement is itself a claim that can be measured. Three things
turned out to be true and unwelcome:

1. **Law I's static check does not exist.** `origin-mechanism` is named in
   `LAWS.md` and implemented nowhere. The founding law — the one the repository
   is named for — is enforced by a wish.
2. **Four laws are enforced only by pasting a script into a console.** CI runs
   the static linter on `examples/`, `lint/self-check.mjs`, and `lint/laws-check.mjs`.
   It never runs the runtime auditor, so Laws I, IV, VI and VII have no automated
   enforcement at all.
3. **One check still contradicts the law it enforces.** Using the emphasis
   weights Law VIII itself cites produces `hairline` violations. A second
   contradiction — Law V mandating 160 / 220 / 280 — was real on the morning of
   this audit and was closed the same day. The record of that failure is kept
   below. It is not the current text of `LAWS.md`.

---

## The table

| Law | Check named in `LAWS.md` | Implemented | In CI | Agrees with the law |
|---|---|---|---|---|
| **I** One origin | `origin-mechanism` (static) | **no — nowhere in the repo** | no | — |
| **I** One origin | `near-miss` (runtime) | yes | **no** | yes |
| **II** The scale | `spacing-scale` | yes | yes | yes |
| **III** Size + leading are one token | `type-scale` | partial | yes | **checks size only** |
| **IV** The grid fills | `orphan-grid` (runtime) | yes | **no** | yes |
| **V** One rhythm per page | `grid-density` | yes | yes | **yes — corrected 2026-09-10** |
| **VI** Same skeleton | `ragged-row` (runtime) | yes | **no** | yes |
| **VII** No near miss | `near-miss` (runtime) | yes | **no** | yes |
| **VIII** One hairline | `hairline` | yes | yes | **no — see below** |
| **IX** Zero radius | `radius-zero` | yes | yes | yes |
| **X** Never say a number twice | human review | n/a | n/a | by design |

Eight check ids are implemented. `type-scale` is one of them and reads size
only. `origin-mechanism` is named and not written. Laws I, IV, VI and VII have
no run in CI. Law VIII still contradicts the emphasis weights it cites. Law V
agreed with `lint/scale.mjs` from 2026-09-10.

---

## The two conflicts, reproduced

### Law V mandates the numbers `scale.mjs` names as counter-examples

`LAWS.md` Law V: *"A page may use three: 160, 220, 280."*

`lint/scale.mjs`, in its own comment on `DENSITY`: *"A minimum that is not a span
width (160, 220, 240...) resolves to 5, 7, 9, 11 columns, which no 12-column page
can align to."*

The law mandates precisely the three values the source of truth lists as broken.
A stylesheet that obeys Law V exactly:

```css
.tight  { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.normal { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.wide   { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```

```
$ node lint/moma-lint.mjs that-file --strict
  MoMA LINT — 3 violations
        3  grid-density
      only 608/400/296/192px are permitted column minimums
```

**Obeying the law fails the build.** `self-check.mjs` reports "all derivations
hold" throughout, because it verifies `scale.mjs` against itself and never reads
`LAWS.md`. The checker could not see the thing it was protecting.

Fixed 2026-09-10: Law V now states the span-derived densities. The prose was
wrong; `scale.mjs`, `docs/grid.md` and the linter already agreed with each other.

### Law VIII forbids the emphasis weights it cites as precedent

Law VIII: *"One line weight (1px) and one line colour. A 2px border is a second
design language arguing with the first."* Then, two lines later, as its own
supporting evidence: *"rules are `.1rem` (1px) solid; `.2rem` and `.3rem` exist
only as deliberate emphasis, never as a default border."*

```
$ node lint/moma-lint.mjs a-file-using-2px-and-3px-emphasis --strict
  MoMA LINT — 2 violations
        2  hairline
      one border weight only (1px) — 2px is a second language
```

The measured MoMA behaviour (R7) is a **default plus two emphasis states**. The
law collapsed that to a single permitted value. Left unresolved on purpose: this
is a hardening decision, not an arithmetic error — see
[the v2 proposal](proposals/v2-architecture.md).

---

## The bigger gap: research that never became law

[`docs/moma-study.md`](moma-study.md) §0 is titled **"the hard, checkable
rules"** and lists twenty-five, each measured and cited. Mapping them against the
executable layer:

| Research finding | State |
|---|---|
| R6 4px spacing scale | **law + check** (II) |
| R7 hairline 1px, 2–3px emphasis | law + check (VIII), **check disagrees** |
| R3a size and leading from one token | law (III), **check does not test the pairing** |
| R5 column formula n ∈ 1–6 | **deliberate divergence**, documented in `moma-vs-us.md` |
| R1 no `text-transform` in the institutional voice | researched · **no law · no check** |
| R3b two weights only, 900 and 400 | researched · **no law · no check** |
| R4 one family, no serif in the system | researched · **no law · no check** |
| R8 achromatic chrome — 3 chromatic values in 876KB | researched · **no law · no check** |
| R9 closed aspect-ratio set | researched · **no law · no check** |
| R9a outer page margin 80px, inner grid origin 128px at 1440 | researched · **no law · no check** |
| R17 two-tier governance — 28 locked, 12 free | researched · **no law · no mechanism** |
| R24 exhibitions and catalogues exempt by stated policy | researched · **no law · no mechanism** |
| R25 artworks whole, editorial crops — crop begins 2009 | researched · **no law · no check** |
| R10–R16, R19–R23 | catalogue and label conventions — correctly live in `styles/`, not laws |

The research is not thin. It is stranded. Roughly four of the twenty-five
checkable findings reached an automated check, and the two most transferable
governance findings (R17, R24) have no mechanism at all.

**This is what the [v2 proposal](proposals/v2-architecture.md) is actually
for** — and it reorders that proposal's own sequence. v2 asks for three new
layers (`LAWS` / `MOVES` / `REGISTERS`) on top of the floor. The floor has a
phantom check in Law I, four laws outside CI, and two checks that contradict
their law. **Close the floor, then add the layers.** A composition vocabulary
stacked on an unenforced foundation is the fourth prose pass wearing a different
hat.

---

## Also found, on the day of the audit

An earlier sentence of this page said `lint/moma-lint.mjs` and
`audit/near-miss.browser.js` both name `audit/near-miss.mjs`. They do not.
The linter points at `audit/near-miss.browser.js`. That file says there is no
programmatic runner, which is why the runtime half is not in CI. Nothing in
`lint/` or `audit/` refers to `audit/near-miss.mjs`.

## Read again, 2026-10-12

`examples/index.html` was rendered in headless Chrome, viewport 1280×900,
`data-theme="dark"`, IBM Plex loaded. The same day,
`node lint/moma-lint.mjs examples --strict` reported 0 violations.

| What | Measured |
|---|---|
| `h1` | 64px / 65.28px, weight 700. The declaration is `clamp(32px, 7vw, 64px)` and `line-height: 1.02`. |
| The two frames | bordered child `+1px`; inset-shadow child `0px` |
| `.page` | border box 1232px, padding 24px + 24px, inner measure 1184px |
| `.quote` | `border-left-width: 1px`, `padding-left: 16px` |

The title is a fourth size the `type-scale` check cannot see, because the check
matches a bare `font-size: Npx` and this declaration is a `clamp()`. The quote
rule is the displacement Law I forbids, at a weight `hairline` allows.
`origin-mechanism` is the check that would have to notice, and it is not
written.

`lint/laws-check.mjs` captures the leading half of `micro 11/16` and does not
compare it to `LEADING`. `type-scale` never reads `line-height`.

`lint/moma-lint.mjs` walks `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss` and
`.html`. It does not read `.mjs`, so the checker does not check itself.

Law X tells the category label to be “a 9px eyebrow”. 9 is not in `TYPE`
(11 / 14 / 32). A declaration `font-size: 9px` fails `type-scale`. The sentence
prescribes a size the rest of the system forbids. It is left here as found.

`package.json` has two scripts. `lint` runs `node lint/moma-lint.mjs .`.
`check` runs `node lint/self-check.mjs` only. There is no `audit` script.
CI, in `.github/workflows/moma.yml`, runs the strict lint of `examples/`,
`self-check`, and `laws-check`. It does not paste the browser script.
