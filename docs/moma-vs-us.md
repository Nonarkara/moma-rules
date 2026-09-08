# What MoMA actually does, and where we deliberately differ

The rules in this repo are named after MoMA. That made it worth finding out what
MoMA actually does, rather than repeating folklore about it. The primary research
is in [moma-study.md](moma-study.md) — measured from moma.org's production CSS
and its collection records, not from design blogs.

Some of it confirms the canon. Some of it contradicts it. Both are recorded here,
because a rulebook that quietly drops its own disconfirming evidence is the same
failure mode as a dashboard that quietly drops a bad number.

---

## Where MoMA confirms the laws

| Finding (measured) | Our law |
|---|---|
| Spacing is a **0.4rem / 4px scale** — 22 of 22 layout values are multiples; the only non-multiples are hairlines | **II · The scale** |
| **Hairline = `.1rem` (1px) solid.** Emphasis rules are .2/.3rem. Nothing heavier is used as a rule | **VIII · One hairline** |
| **Achromatic.** 150 × `#000`, 54 × `#fff`, a grey ramp — and exactly **three** chromatic values in the entire stylesheet | our single-accent rule, stated harder than we state it |
| **Column formula** `calc(100%/n − gutter×(n−1)/n)`, gutter 24 or 32px | **V · One rhythm** — same instinct, one formula, no per-component invention |
| **Fixed label field order**, always the same, never re-ordered per object | **VI · Same skeleton** |

The most striking confirmation is the negative space in their stylesheet. A
876KB production CSS file with **three chromatic values** is a stronger version of
"one accent" than anything we had written down.

---

## Where MoMA contradicts us

### 1. MoMA never sets uppercase. We set it everywhere.

**Zero `text-transform` declarations in 876KB of production CSS.**

Our canon specifies uppercase micro labels (`.t-micro { text-transform:
uppercase }`) and uses them on every surface. MoMA does not do this at all. Where
MoMA wants a label to recede it changes size and colour, never case.

This is a real divergence, not a misunderstanding, and it is **left unresolved on
purpose** — it is a design decision for Dr Non, not for the linter. Worth knowing
before defending the uppercase eyebrow as "the MoMA way": it is not.

### 2. MoMA uses nine type sizes. We use three.

Measured: 12 / 14 / 16 / 18 / 22 / 24 / 32 / 40 / 60px, on a `62.5%` root so
1rem = 10px. Two weights in real use (900 and 400, bold dominating 141:60), and
type set **solid** — only two leading ratios exist, 1.0 and 1.3333, with ~86% of
text at 1.0.

Our three sizes are a *stricter* rule than MoMA's, and we keep it. But we should
stop describing "three sizes" as MoMA practice. It is Rams practice. MoMA's
actual discipline is not the count of sizes — it is that **size and leading
derive from one token**, so a size can never be chosen independently of its
rhythm. That principle is worth stealing, and Law III now states it.

### 3. MoMA's grid is 1–6 fractional columns. Ours is 12 integer columns.

MoMA splits the container into n equal parts, n ∈ 1…6, by percentage. That is
simpler than our grid and it is what an institution with one house style can
afford.

We deliberately differ, and the reason is Law VII. `100% / 3` is `33.333…%`,
which lands on fractional pixels, and fractional pixels are exactly the 1–6px
near-miss band that this whole repository exists to eliminate. Our 88px column
with a 16px gutter yields **integer** spans at every division.

The two systems are compatible rather than opposed:

```
MoMA n :  1   2   3   4   5   6
ours   : 12   6   4   3   —   2      (span 12, 6, 4, 3, —, 2)
```

**Every column count MoMA uses is expressible in our grid as an integer, except
5.** Twelve is the integer refinement of MoMA's one-through-six. We give up n=5,
which no divisor grid can hold, and we gain edges that land on whole pixels.

---

## The sentence worth keeping

From the study's comparison of MoMA against the Swiss school it exhibited but
never adopted:

> Swiss design uses a mathematical module to **compose** a page. MoMA uses an
> American jobbing typeface and a plain column split to **get out of the way of
> the object**. Both are disciplined; only one is trying to be beautiful on its
> own terms.

This is the correct reading of "MoMA rules" for a trading instrument. The laws in
this repo are not there to make a beautiful page. They are there so that nothing
on the page competes with the number the reader came for. Alignment is not
aesthetics; it is **deference**.

That also settles a recurring argument about the luggage tag and every other
style question: a style is admissible here if it gets out of the way of the
datum, and inadmissible if it asks to be looked at. The tag qualifies — it is a
label attached to an object, which is precisely what a wall label is.

---

## What the research changed in this repo

- **Law III** restated: the rule is that size and leading derive from one token,
  not merely that there are three sizes (MoMA §1.2b).
- **Law VIII** strengthened with MoMA's own ratio: rules are 1px; 2–3px exists
  only for emphasis, never as a default border.
- **docs/styles/luggage-tag.md** takes its field order from MoMA's actual label
  order — Title → Date → Medium → Location, then Medium / Dimensions / Credit /
  Object number / Department — and its punctuation from their citation string
  (`Artist. Title. Date` — periods), en dashes for spans, italic for titles only.
- **The uppercase question** is raised and left open, above.

## Honesty note

The study marks its own gaps as `UNVERIFIED` rather than filling them — notably
whether physical gallery wall labels use the same field order as the website.
The website order is solid; the wall order is not verified. That distinction is
kept here rather than smoothed away.
