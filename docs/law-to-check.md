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
2. **Four laws are enforced only by pasting a script into a console.** The CI job
   runs the static linter and the self-check. It never runs the runtime auditor,
   so Laws I, IV, VI and VII have no automated enforcement at all.
3. **Two checks contradict the law they enforce.** Following Law V to the letter
   produces three `grid-density` violations. Using the emphasis weights Law VIII
   itself endorses produces two `hairline` violations.

---

## The table

| Law | Check named in `LAWS.md` | Implemented | In CI | Agrees with the law |
|---|---|---|---|---|
| **I** One origin | `origin-mechanism` (static) | **no — nowhere in the repo** | no | — |
| **I** One origin | `near-miss` (runtime) | yes | **no** | yes |
| **II** The scale | `spacing-scale` | yes | yes | yes |
| **III** Size + leading are one token | `type-scale` | partial | yes | **checks size only** |
| **IV** The grid fills | `orphan-grid` (runtime) | yes | **no** | yes |
| **V** One rhythm per page | `grid-density` | yes | yes | **no — see below** |
| **VI** Same skeleton | `ragged-row` (runtime) | yes | **no** | yes |
| **VII** No near miss | `near-miss` (runtime) | yes | **no** | yes |
| **VIII** One hairline | `hairline` | yes | yes | **no — see below** |
| **IX** Zero radius | `radius-zero` | yes | yes | yes |
| **X** Never say a number twice | human review | n/a | n/a | by design |

Six real machine checks, one phantom, one partial, four outside CI, two in
conflict with their own law.

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

## Also found

- `lint/moma-lint.mjs:10` and `audit/near-miss.browser.js:13` both reference
  `audit/near-miss.mjs` (Playwright). That file does not exist. The runtime half
  has no programmatic runner, which is why it is not in CI.
