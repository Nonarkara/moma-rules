English · [简体中文](README.zh-CN.md) · [ไทย](README.th.md)

# MoMA Rules

Ten laws for a screen, and the checks that fail a build when a law is broken. Three earlier passes wrote the same rules as prose. The pages drifted back. This repository is the pass in which the numbers live in `lint/scale.mjs` and the prose is checked against them.

![The demonstration page, rendered dark at 1280×900. The bordered frame reports a child offset of +1px. The inset-shadow frame reports 0px.](docs/specimen.png)

`examples/index.html`, headless Chrome, viewport 1280×900, `data-theme="dark"`, IBM Plex Sans and IBM Plex Mono loaded, 2026-10-12. The two frames are the page measuring its own children. [Open the page.](examples/index.html)

The picture is not the 1280 formula. At this viewport the page’s border box is **1232px**, padding 24px on each side, inner measure **1184px**. The title computes to **64px / 65.28px**. Both facts are below, under what the checks do not see.

> “MoMA rules dictate that everything has to be aligned and there should be no loose edges to show that the builder is an amateur.”
>
> Dr Non, 2026-08-20

[The ten laws](LAWS.md) · [How a builder works](BUILDER.md) · [The grid, computed](docs/grid.md)

## The page, as four figures

Taken from `lint/scale.mjs`. `node lint/self-check.mjs` re-derives them.

| | |
|---|---|
| Column, gutter, margin | 88, 16, 24 |
| Content | 12 × 88 + 11 × 16 = **1232** |
| Page | 1232 + 2 × 24 = **1280** |
| Spacing | `0  4  8  12  16  20  24  32  40  48  64  80  96  120  160` |
| Type, size/leading | 11/16, 14/20, 32/36 |
| Legal `minmax` minimums | 192, 296, 400, 608 |
| Hairline, radius | 1px, and it must not take layout space. Radius 0. A true circle is exempt. |

Law V named 160 / 220 / 280 until 2026-09-10. Those three are the values `scale.mjs` uses as examples of what breaks a 12-column page. The law now names the span widths.

## What actually runs

| Command | What it reads |
|---|---|
| `npm run lint` | `node lint/moma-lint.mjs .` — static rules, against a baseline if one exists |
| `npm run check` | `node lint/self-check.mjs` only. It never opens `LAWS.md`. |
| `node lint/laws-check.mjs` | The English [LAWS.md](LAWS.md) against `lint/scale.mjs`. Not an npm script. |
| Paste [`audit/near-miss.browser.js`](audit/near-miss.browser.js) | Laid-out edges. There is no runner, and it is not in CI. |

CI is [`.github/workflows/moma.yml`](.github/workflows/moma.yml). On push and pull request it runs three things: `node lint/moma-lint.mjs examples --strict`, `node lint/self-check.mjs`, `node lint/laws-check.mjs`.

Static rules the linter can emit: `spacing-scale`, `grid-density`, `type-scale`, `radius-zero`, `hairline`.

Runtime rules the paste can report: `near-miss`, `orphan-grid`, `ragged-row`.

`origin-mechanism` is named in Law I and marked **not implemented**. `laws-check` accepts that, because the law says so in its own text.

## What the checks do not see

A build can be green and still be wrong. These are the gaps as of 2026-10-12, read off the source and off the render above.

- **Law I’s static check does not exist.** The founding corollary — a hairline may not occupy layout space — is a wish. The demonstration quote is itself `border-left: 1px`. `hairline` allows that weight. Nothing in CI asks whether the line pushed the words.
- **Four laws are a console paste.** Laws I, IV, VI and VII do not run in CI. Near-miss, orphan cells and ragged rows appear only after layout.
- **`type-scale` reads a bare `font-size: Npx`.** The masthead is `clamp(32px, 7vw, 64px)` with `line-height: 1.02`. At 1280×900 that is 64px on 65.28px. The strict lint of `examples/` reported 0 violations the same day. `laws-check` captures the leading in `micro 11/16` and never compares it to `LEADING`.
- **Law VIII still argues with itself.** The prose cites MoMA’s 2px and 3px emphasis. The linter rejects every weight but 1px. That conflict is open on purpose. Law V’s conflict is closed.
- **The linter does not read `.mjs`.** It walks `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss`, `.html`. The checker does not check itself.
- **There is no `npm run audit`.** An older line in [BUILDER.md](BUILDER.md) said there was.

The full table, including the day Law V failed its own build, is [docs/law-to-check.md](docs/law-to-check.md).

Law X — never say a number twice, and let hierarchy follow the thing the reader came for — has no check. It is last so the other nine can spend the machine’s attention, and leave a person this one.

## Adopting it on a dirty codebase

Do not turn `--strict` on first. It will be switched off within a day. Ratchet.

```bash
node lint/moma-lint.mjs src --update-baseline   # record today's debt
node lint/moma-lint.mjs src                     # fail only on new violations
```

`--update-baseline` refuses to write a larger file. The debt shrinks. It does not grow. This repository has no `.moma-baseline.json`. The demonstration page is clean under the static rules the linter can see, and unclean in the ways the last section names.

## Where to read

Set in English, 简体中文 and ไทย. The checker reads the English laws.

| | |
|---|---|
| [LAWS.md](LAWS.md) | The ten laws, each with its check |
| [BUILDER.md](BUILDER.md) | The method above the law. Read it first if you are about to build. |
| [docs/grid.md](docs/grid.md) | The 1280 page, derived |
| [docs/typography.md](docs/typography.md) | A reader, a text, a script. Law III does not certify any of those. |
| [docs/why-lines-dont-align.md](docs/why-lines-dont-align.md) | The 2026-09-08 measurement the laws were written to answer |
| [docs/law-to-check.md](docs/law-to-check.md) | Every law against the check that claims to enforce it |

Still English, because they are the measurement record:

[docs/moma-study.md](docs/moma-study.md) · [docs/moma-vs-us.md](docs/moma-vs-us.md) · [docs/styles/luggage-tag.md](docs/styles/luggage-tag.md) · [docs/design-slop-field-guide.md](docs/design-slop-field-guide.md) · [docs/deck/README.md](docs/deck/README.md) · [docs/proposals/v2-architecture.md](docs/proposals/v2-architecture.md)

v2 is proposed. It is not in force. The audit asks to close the floor before adding layers.

The other two editions of this cover carry the same numbers and the same gaps. They are not a line-aligned translation. `lint/laws-check.mjs` does not read them. If a number disagrees, the English `LAWS.md` and `lint/scale.mjs` win.

## Sources

- The sentence at the top is Dr Non’s, 2026-08-20, as kept in [LAWS.md](LAWS.md).
- Dieter Rams’s ten principles are the analogy that file draws. These laws are not those principles. The three type sizes are the stricter choice, and [docs/moma-vs-us.md](docs/moma-vs-us.md) says so.
- The production figures — 86 spacing values, 40.1% off a 4px grid, an origin at 22px, 124 edges against 62, 856 near-miss pairs — come from the measurement of day.nonarkara.org on 2026-09-08, written up in [docs/why-lines-dont-align.md](docs/why-lines-dont-align.md). This edition did not remeasure that site.
- What MoMA’s own pages do is the study in [docs/moma-study.md](docs/moma-study.md), from production CSS and collection records, not from a design blog.
- Type, as a reader’s problem: Robert Bringhurst, *The Elements of Typographic Style*, second edition, 1997 printing, selected pages 17–33 and chapter 6, pages 93–117. Scope, licence and the refusal of a cover-to-cover claim are in [docs/typography.md](docs/typography.md). No scan of the book is in this repository. No endorsement is implied.
- The same reading is the portable skill at [skills/bringhurst-contextual-type/SKILL.md](skills/bringhurst-contextual-type/SKILL.md), and the reading room of [Palette](https://github.com/Nonarkara/palette) at [colors.nonarkara.org/reading#typography](https://colors.nonarkara.org/reading#typography). This cover follows that contract where a Markdown file can: one specimen, no badge row, no gradient, no emoji standing in for a mark.
- The demonstration page asks for IBM Plex Sans and IBM Plex Mono. The specimen was rendered with those families loaded.
- `package.json` marks the repository `UNLICENSED` and private. The typography note’s MIT line applies to that note, not to the rest of this repository.

---

![A manga panel: a cat under an amber umbrella, a small square robot at its side, rain as vertical rules, a twelve-column pavement.](docs/closing-panel.jpg)

A plate for the end of the book. A cat, an umbrella, a small robot. It is not a diagram of the laws. The pavement is a grid, the collar is a luggage tag, and one stone does not sit with the others. Made for this edition. Not a scan of a printed comic.
