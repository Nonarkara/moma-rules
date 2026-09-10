# Proposal · MoMA Rules 2.0 — a three-layer architecture

**Status:** proposed, not adopted. Nothing in this document is in force.
**Filed:** 2026-09-10 · **Deck:** [`../deck/`](../deck/) ·
**Audit that tests it:** [`../law-to-check.md`](../law-to-check.md)

---

## Verification note — read before the proposal

The proposal below is reproduced as written. Every factual claim it makes about
this repository was checked against the code on 2026-09-10. The results change
what should be done first, so they are stated up front rather than buried.

**Claims that held, and were understated:**

| Claim | What was found |
|---|---|
| "`LAWS.md` names 160/220/280 while `scale.mjs` permits 192/296/400/608" — described as a *documentation mismatch* | Not a mismatch. The three values Law V **mandated** are the three `scale.mjs` names in its own comment as **counter-examples of what breaks the grid**. A stylesheet obeying Law V produced 3 `grid-density` violations: **obeying the law failed the build.** `self-check.mjs` reported "all derivations hold" throughout, because it verified `scale.mjs` against itself and never read `LAWS.md`. **Fixed** — Law V now states the span-derived densities, and `lint/laws-check.mjs` reads the prose so this class cannot recur. |
| "Law VIII / One hairline → rule ladder" | Confirmed, and self-contradicting. Law VIII forbids 2px in its rule, then cites MoMA's 2–3px emphasis rules as its own supporting evidence two lines later. The linter fails both weights the law endorses. **Not fixed** — this is a hardening decision, see the open questions. |
| "the qualities that make MoMA beautiful … [are] outside the executable system" | Understated. `moma-study.md` §0 is titled **"the hard, checkable rules"** and lists 25, each measured and cited. About **four** reached an automated check. R1, R3b, R4, R8, R9, R9a, R17, R24 and R25 are researched, sourced, and entirely unenforced. |

**Claim that was already substantially solved:**

The core diagnosis says observed MoMA behaviour, Dr Non's stricter rules, and
aesthetic preference "are mixed together." [`moma-vs-us.md`](../moma-vs-us.md)
already separates them — explicitly, in a table, with the divergences named and
the uppercase question left open on purpose. Law III already states the paired
token as the MoMA rule and flags the three-size count as Rams. So the taxonomy
work is largely done **in the research layer**; what did not happen is
`LAWS.md` being updated to match its own research. That is a narrower and more
tractable problem than a taxonomy rewrite.

**A finding the proposal did not have:**

`LAWS.md` says *"a law without a check is a wish."* **Law I's static check,
`origin-mechanism`, is implemented nowhere in the repository** — the founding law,
the one the repository is named for. And the CI job runs only the static linter
and the self-check, so the runtime auditor never runs: **Laws I, IV, VI and VII
have no automated enforcement at all.** They are console pastes.

**Therefore: the proposal's sequence should be inverted.** v2 adds three layers on
top of the floor. Close the floor first — implement or formally withdraw
`origin-mechanism`, get the runtime auditor into CI, and reconcile Law VIII with
its own evidence. A composition vocabulary stacked on an unenforced foundation is
the fourth prose pass wearing a different hat, which is precisely the failure this
repository was built to end.

---

## The proposal, as filed

### Core diagnosis

The repository's forensic research is strong. The problem is taxonomy: observed
MoMA behavior, Dr Non's stricter arithmetic rules, and aesthetic preferences are
mixed together. That makes some invented constraints sound like MoMA law and
leaves the qualities that make MoMA beautiful—typographic force, image handling,
compositional contrast, responsive art direction, and named exceptions—outside
the executable system.

### Change the architecture

Use three layers:

1. **LAWS — the checkable floor.** Geometry, spacing rhythm, paired type tokens,
   color scope, image safety, and accessibility.
2. **MOVES — the compositional vocabulary.** Scale contrast, juxtaposition,
   layering, asymmetry, density shifts, full bleed, and deliberate cropping.
3. **REGISTERS — named scopes.** Institutional, campaign/editorial, special
   exhibition, retail. A rule can be strict in one register and deliberately
   different in another.

### Specific corrections

- **Law I / One origin → Derived origins.** Keep one token system, but allow
  nested origins and asymmetric editorial columns. MoMA's live layout uses
  multiple related insets.
- **Law III / Three sizes → Paired type tokens.** Three sizes are a Dr Non
  choice, not MoMA. The more faithful rule is closed type roles with size and
  leading bound together. Institutional defaults: 900 and 400; solid leading for
  display/labels, 4/3 for prose.
- **Add: no forced uppercase in the institutional register.** `text-transform`
  should fail lint there. Retail may opt into a different register.
- **Law IV / Grid fills → No accidental orphan.** Do not fabricate, delete, or
  pad semantic content merely to satisfy `N % C == 0`. A partial final row is
  allowed when it is an intentional content ending.
- **Law V / rhythm.** Fix the documentation mismatch: `LAWS.md` names 160/220/280
  while `scale.mjs` permits 192/296/400/608. Prefer span-derived tokens or MoMA's
  1–6 column formula.
- **Law VIII / One hairline → Rule ladder.** 1px is the default. 2px and 3px are
  explicit emphasis states, not forbidden values.
- **Law IX / Zero radius → Square by default, named exceptions.** MoMA itself has
  a few 4px controls and true circles. If zero remains a Dr Non hardening rule,
  label it as such.
- **Add: achromatic institutional chrome.** Black/white/contrast-safe greys by
  default; chroma belongs to art or a declared campaign state.
- **Add: image law.** Canonical artwork = `contain`, uncropped.
  Editorial/marketing imagery = `cover` only with explicit image gravity /
  safe-zone metadata. Restrict to a closed ratio set.
- **Add: responsive art direction.** Test at a curated viewport suite and include
  a long-title stress test modeled on the 'Rauschenberg test'.
- **Add: beauty review.** Static lint prevents drift; browser audit proves
  geometry; a human/agent visual review asks whether the page has hierarchy,
  contrast, density variation, intentional asymmetry, and one memorable
  compositional move.

### Suggested files

- `OBSERVED.md` — dated primary observations only.
- `LAWS.md` — machine-checkable rules only.
- `MOVES.md` — compositional patterns with good/bad diagrams.
- `REGISTERS.md` — scope and exception governance.
- `IMAGE-LAW.md` — canonical vs editorial image behavior.
- `lint/registers.mjs` — per-register policy.
- `audit/viewports.mjs` — screenshot/geometry suite.
- `audit/beauty-review.md` — twelve-question visual gate.
- `examples/` — rebuild as light-first, bold, art-led examples; remove dark
  terminal/dashboard styling from the canonical demo.

### The sentence to keep

**The law is the floor, not the work.** V2 should make that visible in the
repository structure itself.

---

## Primary source for the register argument

Pentagram's own account of the 2009 identity ([pentagram.com/work/moma/story](https://www.pentagram.com/work/moma/story),
Partner: Paula Scher; developed and applied by Julia Hoffmann, MoMA's Creative
Director for Graphics and Advertising) is the primary source for three of this
proposal's additions. It is worth quoting rather than paraphrasing, because it
states exemption as *policy*:

> "Individual exhibitions will continue to have their own identities, used in
> exhibition graphics, catalogues and websites."

That is `REGISTERS.md` in one sentence, from the institution's own designers —
the EXHIBITION register is exempt by declaration, not by negotiation. It is also
the print twin of the study's R17 (28 collection rotations locked, 12 special
exhibitions free).

Two further phrases from the same page underwrite the MOVES and IMAGE-LAW layers:

> "Dramatic cropping and juxtapositions of artwork" · "a brighter color palette"
>
> "One large image is selected as the focus, representing a current exhibition or
> signature work" · "A strong grid has been established for the uniform placement
> of elements"

Three things follow that the current repository does not encode:

1. **Crop and juxtapose are named institutional practice**, not editorial licence.
   Two of the six moves on deck slide 08 are Pentagram's own words.
2. **"One large image … as the focus" is the scale move as policy** — the same
   thing deck slide 13 asks as question 7, "What is the dominant thing on this
   screen?"
3. **"A brighter color palette" sits beside the measured achromatic chrome**
   (R8: exactly three chromatic values in 876KB of CSS). Both are true, and the
   only way to hold both is a register: chrome is achromatic, campaign is not.
   This is the strongest argument in the proposal, and it now has a primary
   source instead of an inference.

Pentagram's page also says the brief required a system that was **"organized and
flexible"** — flexibility stated as a requirement, by the people who designed the
identity. A rulebook that reads MoMA as strictness alone is reading half the brief.

**What Pentagram's page does not say**, and should not be cited for: nothing about
retail or the Design Store, no named colours, no adoption metrics. The STORE
register rests on this repository's own measurement of `store.moma.org`, and
should stay labelled that way.

---

## Open decisions — Dr Non's call, not the linter's

These are design decisions, so they are listed rather than made. Each is a real
fork where the research supports both answers.

1. **Law VIII — one weight or a ladder?** The measured behaviour is 1px default
   plus 2–3px emphasis. Keeping one weight is a defensible hardening; the law
   should then stop citing MoMA's ladder as its justification.
2. **Law IX — is zero radius MoMA or Dr Non?** The proposal says MoMA ships a few
   4px controls. If zero stays, label it a hardening rule the way Law III's three
   sizes are already labelled.
3. **Uppercase.** `moma-vs-us.md` deliberately left this open. Registers make it
   decidable: fail `text-transform` in institutional, permit it in retail. That
   is a mechanism, but choosing to apply it is still a decision.
4. **Law III — do the repo's 11/14/32 survive?** Deck slide 03 shows MoMA's
   40/22/18. All three would fail `type-scale` today. Either the scale changes or
   the deck is explicitly showing MoMA rather than the repo.
5. **Law I — one origin, or derived origins?** MoMA measurably runs two nested
   origins (80 outer, 128 inner at 1440). The single-origin rule exists to kill
   the near-miss band. Both are coherent; they are not both MoMA.
6. **`origin-mechanism` — implement or withdraw?** Deciding what it may flag
   without drowning an adopting codebase in false positives is unresolved. It is
   currently marked `DECLARED, NOT IMPLEMENTED` in `LAWS.md` so the gap is
   visible rather than silent.
7. **`examples/index.html`.** The proposal asks for light-first and art-led. The
   current demo is dark-first with an amber accent and uses `text-transform:
   uppercase` 10 times — so the canonical example contradicts R1 and R8, the
   repository's own research. Rebuilding it is a design job, not a lint fix.
