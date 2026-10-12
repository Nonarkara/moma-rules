English · [简体中文](typography.zh-CN.md) · [ไทย](typography.th.md)

# Type has a reader / MoMA Rules

Dr Non's interpretation of Robert Bringhurst, *The Elements of Typographic
Style*, supplied second edition / 1997 printing, selected close reading.

Law III binds size and leading. Its three sizes are our chosen system, not a
universal rule from Bringhurst and not MoMA's typography. Keep that executable
law; add this reader-facing proof before declaring the work finished.

## Procedure

1. Read the actual text. Name the reader's act, medium, scripts and existing
   project font policy. Map heading, paragraph, action, caption and error roles.
2. Proof the approved body family first. A title face must not become the body
   merely because it is dramatic. Keep one family if it covers the real roles.
3. Compare companions by proportion, stroke contrast, apparent size and rhythm,
   not just serif/sans labels. A companion needs a role and contract permission.
4. Couple size/leading with measure and spacing. Use actual lines, not a rule
   that 66ch fits all prose or scripts. The CSS unit is zero-glyph width.
5. Keep Latin casing/tracking separate from Thai/CJK rules. Check stacked marks,
   punctuation, line breaks and script coverage; request a scoped exception
   where a house contract cannot support them. Seek fluent-reader review.
6. Proof phone width, enlarged text, blocked fonts, actual colours and emphasis
   with available cuts. Record what fails, not only what the lint tool passes.

## Receipt

Reader/task/medium; real content; approved families by role; actual cuts/licence;
fallback; alternative rejected and observed reason; size/leading/measure;
proof conditions and failures; exceptions; pending fluent/human task review.

An unreadable essential explanation blocks release. Show the failed specimen
and request a documented project exception rather than silently adding a fourth
size or claiming that Law III guarantees usability. The existing `type-scale`
check verifies token discipline, not typographic fitness or human authorship.
It matches a bare `font-size: Npx`. It does not read `line-height`, and it does
not see `clamp()`. `lint/laws-check.mjs` captures the leading in `micro 11/16`
and never compares it to `LEADING` in `lint/scale.mjs`.

## What the demonstration page sets

Rendered 2026-10-12, viewport 1280×900. The body is IBM Plex Sans at 14px / 20px,
which is the body token. The title is `clamp(32px, 7vw, 64px)` with
`line-height: 1.02`, computed at 64px / 65.28px, weight 700. That is a fourth
size. `node lint/moma-lint.mjs examples --strict` reported 0 violations the same
day. Law III did not fail, because the check cannot see this declaration.

The micro labels on that page are uppercase, with tracking. MoMA’s institutional
voice does not do this — see [moma-vs-us.md](moma-vs-us.md). Thai and Chinese
do not inherit Latin tracking or case. A translation that letter-spaces Thai,
or uppercases Chinese, has already failed the reader this note is about.

## Source and reuse

[Portable skill and source ledger](https://github.com/Nonarkara/dr-non-vibecoding-skills/tree/main/skills/bringhurst-contextual-type).
[Palette reading room and downloadable guide](https://colors.nonarkara.org/reading#typography).
Selected printed pp. 17–33 and chapter 6 pp. 93–117 ground the principles.
Browser proofing is a contemporary adaptation. No cover-to-cover completion
claim; no source scan or extracted chapter redistribution; no author endorsement.
This original guide is MIT; this does not change the licence of the whole MoMA
Rules repository, the source book or any font files.
