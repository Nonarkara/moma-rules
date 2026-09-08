# MoMA as a Design System — Primary Research

**Compiled:** 2026-09-08
**Purpose:** Primary research for a rigorous design rulebook. Every claim below is either (a) measured directly from a file I downloaded, (b) quoted from a source I fetched, or (c) explicitly marked **UNVERIFIED**.

**Method note.** `moma.org` sits behind Cloudflare. Plain `curl` gets a 403 challenge on sub-pages, and `WebFetch` gets 403 on most sub-pages (the homepage is an exception). Three methods were used, and which one produced a given fact is disclosed at the point of use:
1. The homepage HTML and the four production stylesheets were downloaded directly with `curl` (HTTP 200) and measured locally. **All CSS numbers in §1 are measured, not reported.**
2. Collection object pages, MoMA's own blog posts, and MoMA's Collections Management Policy PDF were read through the `r.jina.ai` text proxy. Content was cross-checked against MoMA's own CC0 dataset, which agrees.
3. **The live site was additionally rendered in a real browser at 1440×900** and computed styles, class names, element geometry and scroll behaviour were read from the DOM. §1.2b, §1.2c, §1.2d and parts of §1.9 come from that session and are marked as such. This caught things static CSS could not: the paired typography token, the solid leading, the two-weight reality, the header state machine, and a third-party widget that contaminates naive measurement.

---

## 0. Executive summary — the hard, checkable rules

These are the findings that convert directly into enforcement rules. Each links to the section with evidence.

| # | Rule | Evidence |
|---|---|---|
| R1 | **No `text-transform` on `moma.org`.** Zero declarations in 876 KB of production CSS; zero uppercase elements live. **Scope note:** the *store* does use it (155 elements) — the museum site and the store are different systems. | §1.3, §1.10 |
| R2 | **Root is `font-size: 62.5%`.** 1rem = 10px. Every value below is stated in that frame. | §1.2 |
| R3 | **A small closed size set.** Static CSS declares nine: 12/14/16/18/22/24/32/40/60 px. The live token system renders 16/18/20/22/30/40/60 px. Union is ~11 sizes; **neither list is open-ended.** | §1.2, §1.2b |
| R3a | **Type is set SOLID.** Only two leading ratios exist: **1.0** and **1.3333**. ~86% of text is at 1.0. Size and leading derive from one token. | §1.2b |
| R3b | **Two weights in use: 900 and 400.** Nothing between, despite 5 shipped. Bold dominates 141:60. | §1.2d |
| R4 | **One family.** `"MoMA Sans", var(--language-font-face), Helvetica, sans-serif`. Plus `MoMA Sans Condensed`. No serif in the system. | §1.1 |
| R5 | **Column formula:** `width: calc(100%/n − gutter×(n−1)/n)`, n ∈ 1–6, gutter = 2.4rem or 3.2rem. Verified exact against all 8 emitted values. | §1.4 |
| R6 | **Spacing is a 0.4rem (4px) scale.** All 22 layout step values are exact multiples; non-multiples are only hairlines and optical nudges. Dominant rhythm 24/32px; section breaks 48/64/96/128px. | §1.5 |
| R7 | **Hairline = `.1rem solid` (1px).** Emphasis rules are `.2rem`/`.3rem`. Nothing heavier for a rule. | §1.6 |
| R8 | **Achromatic.** 150 × `#000`, 54 × `#fff`, then a grey ramp. Exactly **three** chromatic values in the entire stylesheet. | §1.7 |
| R9 | **Aspect ratios are a closed set:** padding-top of 50 / 56.25 / 66.667 / 75 / 80 / 100 / 125 / 177.6 %. | §1.8 |
| R9a | **Header is not fixed.** It scrolls away, collapsing to `partial` on scroll-down and restoring to `full` on scroll-up. Outer page margin at 1440px is 80px (= `--page-spacing--fixed` + `--page-spacing`). | §1.9 |
| R10 | **Label order is fixed:** Title → Date → Medium → Location, then Medium / Dimensions / Credit / Object number / Department. | §4.2 |
| R11 | **Citation string:** `Artist. Title. Date` — periods, not commas or pipes. | §4.3 |
| R12 | **Object number is `sequence.year`** (`472.1941`), not year-first. Parts append `.n`; ranges use `-`. | §4.5 |
| R13 | **Dimensions:** `H x W" (H x W cm)` — imperial with vulgar fractions and a straight inch mark, metric in parens to one decimal. | §4.6 |
| R14 | **En dash for spans** (`1853–1890`, `10:30 a.m.–5:30 p.m.`). Hyphen only for elided work dates (`1976-77`). | §4.7 |
| R15 | **Year is omitted when it is the current year**; in a range, stated once at the end if both dates share a year, twice if they differ. | §1.9, §2 |
| R16 | **Titles are italic. Always.** Artist names and all metadata are roman. | §4.2 |
| R17 | **Two-tier typeface governance.** ~70% of surfaces locked to the house face with zero discretion; ~30% enumerated in advance as licensed exceptions. MoMA's own numbers: 28 collection rotations locked, 12 special exhibitions free. | §2 |
| R18 | **The identifying mark is the double-storey `g`** — named by MoMA itself as the tell. Not Helvetica's single-storey. | §2, §6 |
| R19 | **Captions go BELOW the plate, flush left, number first, hanging.** Never above. Verified across four eras of catalogues. | §3.6 |
| R20 | **The book states its own numbering convention in the front matter.** Ninety years of it. If you use an asterisk or a marginal number, say so explicitly. | §3.6 |
| R21 | **Text block starts at a fixed top; the page is allowed to end early.** No vertical justification, no filling — a 6-entry page may leave 60% white. | §3.6 |
| R22 | **Design entries carry price AND point of sale.** A MoMA design catalogue is also a shopping guide. 1934 → 1955 unbroken. | §3.6 |
| R23 | **The object-on-white convention is NOT MoMA's.** Verified across five catalogues: grey, black, in-room, dark sweeps. **Isolation is the MoMA principle; white is not.** | §3.7 |
| R24 | **Exhibition identities and catalogues are exempt from the institutional system, by stated policy** (Pentagram). The print twin of R17. | §2, §3.8 |
| R25 | **Cropping artwork began in 2009.** Before that MoMA reproduced artworks whole. Editorial imagery crops; artworks do not. | §1.8, §2 |

---

## 1. moma.org — measured from production code

### Files measured

Downloaded 2026-09-08, HTTP 200, direct `curl` with a browser UA:

| File | Bytes |
|---|---|
| `https://www.moma.org/` (HTML) | 218,676 |
| `/dist/main.da694f524e0c6879f84a.css` | 593,325 |
| `/dist/sol.7be4943c7e0064bb3dfa.css` | 270,481 |
| `/dist/commons.385caa24f52511533641.css` | 6,400 |
| `/dist/home-refresh.ffa3d4a180e4a03fedc2.css` | 6,223 |

The bundle named **`sol`** appears to be MoMA's internal design-system bundle. Its purpose is **UNVERIFIED** — the name is not documented publicly that I could find.

### 1.1 Typeface

The body rule, verbatim from `main.css`:

```css
body {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: "MoMA Sans", var(--language-font-face), Helvetica, sans-serif;
  font-kerning: normal;
  font-weight: 400;
  text-rendering: optimizeLegibility;
}
```

```css
:root { --language-font-face: "MoMA Sans" }
```

Three families are declared: **`MoMA Sans`**, **`MoMA Sans Condensed`**, and — only in `sol.css`, twice — **`MoMA Sans Store`**. There is also exactly one `font-family: Courier, monospace` in `sol.css`.

**There is no serif anywhere in the system.** This is a real difference from most museum systems.

Self-hosted WOFF2, from `/dist/dist/moma-sans/`. The shipped weight axis:

| `font-weight` | File |
|---|---|
| 100 | `moma-sans__light.woff2` |
| 300 | `moma-sans__light.woff2` |
| 400 | `moma-sans__regular.woff2` |
| 600 | `moma-sans__medium.woff2` |
| 700 | `moma-sans__semibold.woff2` |
| 900 | `moma-sans__bold.woff2` |

Note the deliberate mapping: **100 and 300 both resolve to Light**, and the named files are light / regular / medium / semibold / bold. So five real weights are exposed across six CSS weight slots, each with a matching italic. Condensed ships the same axis.

`font-kerning: normal` and `text-rendering: optimizeLegibility` are set globally — kerning is on by default, which matches the "thorough down to the last detail" register.

### 1.2 Type scale

```css
html { -webkit-text-size-adjust: 100%; font-size: 62.5% }
```

**1rem = 10px.** Every distinct `font-size` in rem across the whole bundle:

```
1.2rem  1.4rem  1.6rem  1.8rem  2.2rem  2.4rem  3.2rem  4rem  6rem
  12px    14px    16px    18px    22px    24px    32px   40px  60px
```

Nine sizes. Note the gaps: **there is no 2.0rem and no 2.8rem** — the scale steps 1.8 → 2.2 → 2.4 → 3.2, then doubles roughly. It is not a geometric ratio scale; it is a hand-picked set.

**Important correction from live measurement.** This static list is incomplete. The rendered page also produces **20px and 30px**, which appear nowhere as a literal `font-size` in the stylesheets. They come from the token mechanism described in §1.2b, where the size is computed as `calc(N * 0.1rem)` with `N` supplied per component. So the static grep undercounts. The union of static and rendered sizes is roughly 12/14/16/18/20/22/24/30/32/40/60 px — still a closed, hand-picked set, but read §1.2b for the actual mechanism before writing any rule from this table.

`letter-spacing` is used **five times total** across 876 KB, and only ever negative and tiny: `-.02rem`, `-.01rem`, `-.02em`, plus two `normal` resets. There is **no positive tracking anywhere** — which follows from R1, since positive tracking is mostly used to letterspace caps.

### 1.2b The real type system — measured in a live browser

The static grep above tells only part of the story. Rendering the page at 1440×900 and reading computed styles reveals that MoMA drives typography through a **paired token**, not through loose `font-size` rules:

```css
font-size:   calc(<sizeMultiplier> * <N> * 0.1rem);
line-height: calc(<leadingRatio>  * <N> * 0.1rem);
```

`N` is the size in the system's own "pt" units and `0.1rem` = 1px. **Size and leading are computed from the same `N`**, so leading is always an exact ratio of the size — never `normal`, never a loose unitless inherit.

Every distinct pair actually rendered on the homepage, by element count:

| `font-size` | `line-height` | Ratio | Count |
|---|---|---|---|
| 18px | 18px | **1.0** | 96 |
| 30px | 30px | **1.0** | 68 |
| 22px | 22px | **1.0** | 52 |
| 18px | 24px | 1.3333 | 36 |
| 40px | 40px | **1.0** | 20 |
| 16px (0.888×18) | 18px | 1.125 | 18 |
| 20px | 20px | **1.0** | 2 |
| 16px | 21.3px | 1.3333 | 2 |
| 60px | 60px | **1.0** | 1 |
| 22px | 29.3px | 1.3333 | 1 |

**Only two leading ratios exist in the system: 1.0 and 1.3333 (4/3).** And ~86% of text elements (239 of 296) are **set solid at 1.0**.

This is the single most characteristic typographic fact about moma.org, and it is completely checkable. It is also what produces the dense, tight, poster-like texture that reads as "MoMA" — it is not a font choice, it is a *leading* choice. The 4/3 ratio is reserved for running prose.

Note also the third mechanism: `0.8888888889 × 18` = 16px set on 18px leading. **A size can be shrunk within a slot while keeping the slot's leading**, so mixed-size text stays on one baseline rhythm.

### 1.2c The atomic class DSL and its named scale

Class names in the served markup are a bespoke atomic system of the form `@<breakpoint>/$<namespace>/<property>:<value>`:

```
$typography/size:medium-large      $color/background:white
@768/$typography/size:40pt         @1280/layout/grid:gap:page
$typography/weight:regular         layout/z-index:9
$typography/baseline:body          typography/truncate:2
```

The named typographic scale, harvested from live class names:

```
$typography/size:small
$typography/size:medium
$typography/size:medium-large
$typography/size:large
$typography/size:extra-large
$typography/size:extra-extra-large
$typography/size:down   /  $typography/scale:down
```

plus explicit point-size escapes (`size:20pt`, `24pt`, `30pt`) and responsive overrides (`@768/$typography/size:18pt`, `22pt`, `40pt`).

So there are **seven named steps plus a `down` modifier**, with numeric escapes available. Utilities are namespaced too: `typography/nowrap`, `typography/truncate:2`, `typography/markdown`.

### 1.2d Weights actually used

Across every text-bearing element on the rendered homepage (third-party widgets excluded):

| `font-weight` | Count |
|---|---|
| **900** (Bold) | 141 |
| **400** (Regular) | 60 |

**Two weights. Nothing else.** No Light, no Medium, no Semibold — despite all of them being shipped as WOFF2 (§1.1). And the *dominant* weight is **900**, not 400: MoMA's homepage is mostly bold.

This corrects a natural but wrong assumption. MoMA is not delicate, light-weight type on white. It is **heavy type, set solid, flush left, in black**. The restraint is in the *palette and the size range*, not in the weight.

**Caveat on measurement hygiene:** the live page loads a third-party Klaviyo marketing widget (`static.klaviyo.com`, 329 CSS rules) which injects its own `--kl-reviews-*` typography tokens with 14px/16px defaults and ratios like 1.14, 1.29, 1.71. **None of these are MoMA's system** and all figures above exclude them. Anyone auditing moma.org by scraping computed styles naively will contaminate the result with Klaviyo's scale.

### 1.3 Case — the strongest single finding

```
text-transform declarations, all four stylesheets: 0
```

Not one. In 876 KB of production CSS covering the entire museum website, MoMA never applies `text-transform`. Eyebrows, labels, nav, buttons, timestamps — none are machine-uppercased. Where capitals appear they are authored into the content, not imposed by the stylesheet.

This is a genuinely distinguishing rule and is trivially enforceable.

### 1.4 Grid

MoMA does **not** use CSS Grid. `grid-template-columns` appears **zero** times; `grid-gap` appears once. The layout system is **flexbox with `calc()` widths and margin gutters**, applied through BEM classes of the form `.grid-item--<type>`.

Every emitted column width in the bundle:

| Width | Implied n | Gutter |
|---|---|---|
| `calc(50% - 1.2rem)` | 2 | 2.4rem |
| `calc(50% - 1.6rem)` | 2 | 3.2rem |
| `calc(33.33333% - 1.6rem)` | 3 | 2.4rem |
| `calc(33.33333% - 2.13333rem)` | 3 | 3.2rem |
| `calc(25% - 1.8rem)` | 4 | 2.4rem |
| `calc(25% - 2.4rem)` | 4 | 3.2rem |
| `calc(20% - 2.56rem)` | 5 | 3.2rem |
| `calc(16.66667% - 2.66667rem)` | 6 | 3.2rem |

Every one of these satisfies exactly:

```
width = calc(100%/n − gutter × (n−1)/n)
```

Check: n=6, gutter 3.2 → 3.2 × 5/6 = 2.66667 ✓. n=5 → 3.2 × 4/5 = 2.56 ✓. n=3, gutter 2.4 → 2.4 × 2/3 = 1.6 ✓. All eight verify.

Gutters are **2.4rem (24px)** at smaller widths and **3.2rem (32px)** at larger. Confirmed by the accompanying rules `margin-left: 2.4rem` (42 uses) and `margin-left: 3.2rem` (57 uses) on `:nth-of-type(n)`, zeroed on `:nth-of-type(<n>n+1)` to start each row flush.

**Column counts in use: 1, 2, 3, 4, 5, 6.** Not 12.

**A caveat that matters.** A parallel set of widths exists using 99% instead of 100% (`calc(49.5% - 1.2rem)`, `calc(33% - 1.6rem)`, `calc(24.75% - 2.4rem)`, `calc(19.8% - 2.56rem)`, `calc(16.5% - 2.66667rem)`), along with `width: 99%`. These sit inside `@supports(-ms-ime-align: auto)` — they are a **legacy IE/Edge fallback**, not the live grid. I initially misread these as a deliberate 99% safety track; they are not. The live grid divides by 100%.

**On the "12×12" claim.** The Lined & Unlined talk notes describing the 2019 identity work state the design system uses a **"12x12 modular system"**. That is a claim about the *brand/print identity system* from a conference write-up. It is **not** what the website ships — the site ships the 1–6 flex system above. Do not conflate the two.

### 1.5 Spacing scale

All rem values used in `margin*`/`padding*`, by frequency:

```
2.4rem (126)  3.2rem (122)  9.6rem (79)  4.8rem (73)  6.4rem (66)
3.6rem (64)   4.0rem (55)   2.8rem (52)  6.0rem (32)  6.8rem (32)
5.6rem (32)   1.2rem (32)   0.8rem (32)  8.4rem (30)  12.8rem (30)
7.2rem (28)   1.6rem (22)   2.0rem (17)  8.0rem (9)   5.2rem (9)
```

Tested against a 0.4rem (4px) base:

- **22 distinct values are exact multiples of 0.4rem**: 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2, 8.0, 8.4, 9.6, 12.8.
- The 16 non-multiples are dominated by hairlines and optical nudges: 0.1, 0.15, 0.2, 0.5, 0.6, 0.7, 1.0, 1.1, 1.4, 2.2, 2.3, 3.0, 3.4, 6.6, 8.3, 16.6.

So: **layout spacing is a strict 4px scale; sub-4px values exist only for rules and optical correction.** The dominant rhythm is 24px / 32px, with large section breaks at 48 / 64 / 96 / 128px.

The page rhythm is tokenised:

```css
:root {
  --page-spacing: 2.4rem;
  --page-spacing--fixed: 2.4rem;
  --uneven-column-width--side: calc(33.33333% - var(--page-spacing--fixed)*2/3);
  --uneven-column-width--main: calc(100% - var(--uneven-column-width--side) - var(--page-spacing--fixed));
  --header-height: 10.8rem;
  --header-height--chin: 2rem;
  --header-height--headroom: 5.6rem;
  --link-enlargement: 0.4rem;
  --rights-maximum: 200rem;
  --visible-height: 100vh;
}
```

Redefined at breakpoints to `--page-spacing: 3.2rem; --page-spacing--fixed: 4.8rem; --header-height: 19.2rem; --link-enlargement: 0.8rem`.

Two things worth stealing:

- **`--uneven-column-width--side` / `--main`** is a named 1:2 asymmetric split derived from the gutter, not hardcoded. MoMA's editorial pages are a sidebar + main, and the split is computed.
- **`--link-enlargement: 0.4rem → 0.8rem`** is an explicit token for growing a link's hit area beyond its text box. Touch-target expansion is a first-class token, not an afterthought.

### 1.6 Rules and hairlines

```
border-bottom: .1rem solid   × 15   (1px — the standard hairline)
border-bottom: .2rem solid   ×  6   (2px)
border-bottom: .3rem solid   ×  6   (3px)
border: .3rem solid #000     ×  1
border: none                 × 34
border: 0                    ×  2
```

The 1px `.1rem` bottom rule is the workhorse. The 2px and 3px variants are used for emphasis/active states. There are also alpha-stepped borders — `.2rem solid rgba(0,0,0,.33)`, `rgba(0,0,0,.13)`, `rgba(0,0,0,.07)` — a three-step opacity ladder on black rather than three different greys.

**Corners:** `border-radius: 50%` × 7 (circular affordances only), `.4rem` × 5, `.15rem` × 1, plus `border-radius: 0` and one `border-radius: 0 !important`. So MoMA is *nearly* square-cornered but not absolutely — it permits a 4px radius on a handful of controls and uses circles for round elements. It is **not** a zero-radius system.

**Links:** `text-decoration` appears only twice, both `none` (one `!important`). Underlines are therefore drawn with borders rather than `text-decoration` — which is why the `.1rem solid` bottom rule count is high. This gives control over underline offset and weight.

### 1.7 Colour

Hex frequency across `main.css`:

| Colour | Count | Role |
|---|---|---|
| `#000` | 150 | text, rules |
| `#fff` | 54 | ground |
| `#999` | 14 | secondary text |
| `#bbb` | 4 | |
| `#aaa` | 4 | |
| `#eee` | 3 | fills |
| `#888` | 3 | |
| `#767676` | 3 | see below |
| `#ddd` | 2 | |
| `#666` | 1 | |
| `#444` | 1 | |
| **`#ff8f1c`** | **2** | orange |
| **`#007933`** | **1** | green |

Two observations that make good rules:

- **Pure black on pure white.** Not `#111` on `#fafafa`. MoMA commits to `#000`/`#fff` and takes the contrast.
- **Exactly three chromatic declarations in 593 KB.** `#ff8f1c` twice and `#007933` once. Their semantic role is **UNVERIFIED** (green is plausibly a success/in-stock state and orange an alert, but I did not confirm the selectors). Either way, the ratio is the finding: **~204 achromatic declarations to 3 chromatic ones.**
- **`#767676`** is the well-known lowest grey that still passes WCAG AA (4.5:1) on white. Its presence suggests the grey ramp was contrast-checked rather than picked by eye.

The identity literature says "MoMA is black and white and multicolor" and that colour under the 2019 system "serves to reinforce a new seasonal approach". That colour lives in **imagery and campaign art**, not in the chrome. The chrome is achromatic.

**`text-align`:** only five declarations total (2 left, 2 center, 1 initial). The system relies on the default — **everything is flush left, ragged right, by omission.** This matches Order's stated "left-aligned, tight spacing".

### 1.8 Images

There is no `aspect-ratio` property in use for layout. Ratios are held with the **percentage padding-top box**:

| `padding-top` | Ratio | Count |
|---|---|---|
| 50% | 2:1 | 24 |
| 75% | 4:3 | 21 |
| 56.25% | 16:9 | 18 |
| 66.6666667% | 3:2 | 12 |
| 100% | 1:1 | 6 |
| 80% | 5:4 | 3 |
| 177.6% | ~9:16 (portrait) | 3 |
| 125% | 4:5 | 3 |

That is a **closed set of eight ratios** — a genuinely enforceable rule.

Cropping: `object-fit: cover` (3 uses) with `object-position` nudges of `center 20%` and `center 80%` — i.e. deliberate off-centre crops for editorial imagery. `object-fit: contain` appears once, and `object-position: center var(--picture--object-position--y, center)` in `sol.css` exposes vertical crop position as a per-image variable.

**The important distinction:** promotional/editorial images are cropped (`cover`). Artworks are not — an artwork is shown whole, letterboxed (`contain`), on its own ground. Pentagram's description of the 2009 system confirms the editorial half: artworks appear "either shown whole or strategically cropped".

Image delivery is via a Sanity CDN with `?auto=format` and `-resize` params, plus MoMA's own `/media/` service with base64-encoded transform instructions and a `?sha=` cache key.

### 1.9 Navigation and date formatting

`position: fixed` appears 3 times; `position: sticky` **zero** times. The header is fixed, with height tokenised as `--header-height` (10.8rem mobile → 19.2rem desktop) split into `--header-height--chin` and `--header-height--headroom` — i.e. the header is modelled as two stacked bands, not one bar. `scroll-margin-top: calc(var(--page-spacing) + var(--nav-height, 0rem))` keeps anchor targets clear of it.

**Measured live at 1440×900.** The header is **`position: relative`** and scrolls away with the page — it is *not* fixed or sticky at desktop. Instead it runs a **Headroom.js-style state machine**, observed by scrolling and reading the class list:

| Scroll state | Classes on the header |
|---|---|
| At top | `headroom header--top header--full header--not-bottom` |
| Scrolling **down** | `headroom header--not-top header--partial header--not-bottom` |
| Scrolling **up** | `headroom header--not-top header--full header--not-bottom` |

So the header has three independent binary axes — `top / not-top`, `full / partial`, `bottom / not-bottom` — and **collapses to `partial` on downward scroll, restoring to `full` on upward scroll.** This is exactly the two-band model the tokens describe: `--header-height--headroom` is the band that collapses, `--header-height--chin` is what remains. Measured height at 1440px: **166px** full (`--header-height: 16.6rem`).

**Measured page margins at 1440px viewport:**

| Element | Left inset | Width | Right inset |
|---|---|---|---|
| Content wrapper | 80px | 1280px | 80px |
| Inner grid | 128px | 1184px | 128px |

The 80px outer margin is exactly `--page-spacing--fixed` (4.8rem/48px) **+** `--page-spacing` (3.2rem/32px) = 80px, and the inner inset adds another 48px. So the margins are composed from the tokens, not hardcoded. At 1440px the page gives **11.1% of its width to outer margin** (5.56% each side).

**Live colour check** (text colours on rendered elements, third-party excluded): `rgb(0,0,0)` × 159, `rgb(255,255,255)` × 18, `rgb(102,102,102)` (`#666`) × 12, `rgb(118,118,118)` (`#767676`) × 7 — then just `rgb(247,82,189)` (a pink) × 2 and `rgb(2,176,66)` (a green) × 1. **Three chromatic text colours out of ~200 elements**, confirming the static analysis. The pink is consistent with Order's "seasonal" colour approach — campaign colour, not system colour.

Breakpoints found: 360, 375, 412, 480, 568, 600, 667, 724, 767, 768, 864, 900, 1024, 1216, 1280, 1440, 1550, 2000 px. Container `max-width` values include 102.4rem, 128rem, 144rem, 200rem, and prose measures at 45.2 / 52 / 54.8 / 60.4rem — **so body copy is capped around 452–604px**, a classic measure limit.

**Date formatting, transcribed from the live homepage:**

```
Through Sep 12
Through Nov 29
Through Jan 2, 2027
Aug 1, 2026–Summer 2027
Sep 20, 2026–May 2, 2027
Open today, 10:30 a.m.–5:30 p.m.
```

Rules extractable from this:
- Three-letter month abbreviations, **no period** (`Sep`, not `Sept.`).
- **The year is omitted when it is the current year** and included when it is not. `Through Sep 12` vs `Through Jan 2, 2027`.
- Ranges use an **en dash with no surrounding spaces**.
- A range end may be a season, not a date: `Summer 2027`.
- Times: `10:30 a.m.–5:30 p.m.` — lowercase, with periods, en dash, no spaces.
- Status eyebrows are sentence case: `Last chance`, `Coming soon`, `Member Last Look, Sep 13`.

**House-style quirk, from the footer:** `11 West 53 Street, Manhattan`. MoMA writes **"53 Street", not "53rd Street"** — ordinal suffixes are dropped from street numbers. Small, but it is a real and checkable house rule.

Film citations use period separation: `Minari. 2020. Written and directed by Lee Isaac Chung`.

### 1.10 The Design Store — a separate property

`store.moma.org` is **not the same system as `moma.org`**. It is a Shopify storefront on its own subdomain. Evidence:

- `sol.css` declares a third family, **`MoMA Sans Store`**, used twice — the store has its own cut.
- Store URLs are Shopify-shaped (`/collections/…`, `/products/…`) with a separate help centre on Zendesk (`storehelpcenter.moma.org`).
- Navigation is commerce-shaped in a way the museum site never is: price-band collections (`$25 & Under` … `$250 & Under`), faceted price filters (`$0 - $25`, `$26 - $50`, `$51 - $100`, `$101 - $150`, `$151 - $200`, `$201 - $300`, `$301 - $500`), promotional banners ("Further Markdowns! Save up to 50% off"), and a ship-to country selector.

Note the case shift: the store writes **`$25 & Under`** in title case with an ampersand, and runs exclamation-marked promotional copy. The museum site does neither. **The store is permitted a louder register than the museum.** That is itself a useful rule — the commerce surface is explicitly not held to the gallery's restraint.

**Measured live in a browser** (the product grid is client-rendered, so this required a real session; `products.json` returns 403).

Font stack on the store: `"MoMA Sans", arial, sans-serif` — **note the `arial` fallback, where the museum site uses `Helvetica`.** Same primary face, different fallback, so the two properties were configured independently.

Product card field order, with measured type:

| Slot | Example | Size / leading | Weight |
|---|---|---|---|
| Badge | `NEW` | 11px / 12.65px | 400 |
| Title | `Andy Warhol Brillo Boxes Skateboard from The Skateroom` | 14px / 16.1px | 400 |
| Price | `฿6,747` | 14px / 20px | 400 |
| Variant note | `available in 3 colors` | 12px / 24px | 400 |
| Action | `Quickview` | 11px / 16px | 400 |

(Prices render in Thai baht because the store geolocates the visitor — that is commerce behaviour, not a design fact.)

**The store is a genuinely different typographic system, and the contrasts are sharp:**

| | moma.org | store.moma.org |
|---|---|---|
| `text-transform: uppercase` | **0 elements** | **155 elements** (`NEW`, `Quickview`) |
| Weights in use | 900, 400 only | 400 (1513), 500 (44), 200 (6), 600 (3), 700 (1) |
| Dominant weight | **900 Bold** | **400 Regular** |
| Leading | 1.0 solid (~86%) or 1.3333 | 1.15, 1.43, 1.45, 2.0 — no solid setting |
| Fallback | Helvetica | arial |

So **R1 must be scoped precisely: the museum site never uses `text-transform`; the store does.** Anyone citing "MoMA never uses uppercase" as a universal rule is overreaching — it is true of `moma.org` and false of `store.moma.org`.

Product titles do credit the maker, using the preposition **`from`**: `Andy Warhol Brillo Boxes Skateboard from The Skateroom` — artist/subject, then object, then `from`, then manufacturer. This is a commerce-flavoured echo of the tombstone, not the tombstone itself: there is **no medium, no dimensions, no date and no credit line** on a store card.

Artwork cards on the homepage are **two lines: artist name, then title** — artist first, title second. Birth names are parenthesised (`Man Ray (Emmanuel Radnitzky)`), and a work drawn from a series reads `Untitled from Flowers` with the series title italicised.

---

## 2. Identity and typography history

A single through-line: **every MoMA typeface since 1964 is a redrawing of Franklin Gothic.** The Lined & Unlined notes put it as "each reinvention of MoMA's look is really a slight redrawing of Franklin Gothic."

### Timeline

| Year | Event | People |
|---|---|---|
| 1902 | **Franklin Gothic** released by American Type Founders | Morris Fuller Benton |
| ~1930s | MoMA already using a version of Franklin Gothic. MoMA's own blog says its use dates "as long ago as the 1930s"; type.today says research showed use "since at least 1934" | — |
| **1964** | **The MoMA logotype**, set in **Franklin Gothic No. 2** | **Ivan Chermayeff** (Chermayeff & Geismar) |
| **2003–04** | **MoMA Gothic** — the logotype redrawn as a custom face. One weight | **Matthew Carter** |
| **2009** | Institutional identity system | **Pentagram, Paula Scher**, with **Julia Hoffmann**, MoMA Creative Director for Graphics and Advertising |
| **2017** | **MoMA Sans** — 23 weights | **Christian Schwartz**, Commercial Type; italics **Greg Gazdowicz**; Cyrillic **Ilya Ruderman**; direction from MoMA in-house + **Made Thought**; input from Matthew Carter |
| **2019–20** | Identity system for the museum expansion | **Order**; **Triboro** (expansion graphic); **Gensler** (signage); **PepRally / Erica Gorochow** (motion); web sprints with Order and **Doberman** |

Sources differ on the MoMA Gothic date — Pentagram and Wallpaper* say 2004, type.today says "around 2003". Treat it as **2003–04**.

**Unresolved conflict on MoMA Sans's weight count.** Three figures circulate and I could not reconcile them:

| Source | Claim |
|---|---|
| type.today | **23 weights** |
| A parallel research pass | **four weights, two widths** |
| **My own measurement of the shipped WOFF2 files (§1.1)** | **five named weights** (light/regular/medium/semibold/bold) across six CSS weight slots, each with an italic, in two widths |

The web-font measurement is the only one I made directly, so **prefer it for anything about the website**; the retail/print family may well be larger. Note also that MoMA acquired MoMA Sans into its own collection as an artwork, and **it is not licensable** — so it cannot be used outside MoMA regardless.

### What each step actually changed

**1964, Chermayeff.** The logotype in Franklin Gothic No. 2. It has been continuously in service since; the Graphéine piece calls it part of "international museum graphic vernacular".

**2004, Carter.** The problem was drift: the Franklin the museum was using "did not seem to be real Franklin" — somewhere in its digital evolution it had "lost its spirit and become a soul-less hybrid digital version." Carter compared the brief to "asking an architect to design an exact replica of a building." So this step was **restoration, not redesign** — recovering a degraded asset. One weight only.

**2009, Pentagram/Scher.** Made MoMA Gothic "the principal font for all typography" and turned the logotype into "a graphic device" rather than a corner mark. Specifically:
- "a strong grid has been established for the uniform placement of elements"
- the logo gets "consistent vertical placement similar to the signage on the museum's façade" — **the print system is aligned to the building**
- "dramatic cropping and juxtapositions of artwork, and a brighter color palette"
- artworks "either shown whole or strategically cropped"
- events organised into text blocks held separate from featured imagery

Two further points from Pentagram's own account that matter a great deal:

> "**Prior to this, the museum did not typically crop images of artworks.**"

So **cropping artwork is a 2009 innovation, not a MoMA tradition** — for the museum's first eighty years, an artwork image was reproduced whole. That is the historical backing for the §1.8 distinction between cropped editorial imagery and uncropped artwork.

> "Individual exhibitions will continue to have their own identities, used in exhibition graphics, **catalogues** and websites."

**Catalogues and individual exhibitions are deliberately exempt from the institutional identity.** This is the print-side twin of the two-tier governance rule (R17) and is developed in §3.8.

**2017, Schwartz.** The brief was explicitly **"evolution, not revolution."** Before this, MoMA ran a mixture — Carter's Franklin revival plus Trade Gothic, ITC Franklin Gothic and News Gothic Condensed — which produced inconsistency. MoMA Sans consolidated all of it into "a single typographic voice." Changes:
- larger x-height, stated as being for readability by older visitors
- cleaner lines, warmer character
- a proper weight range (the old set lacked adequate light and bold)
- a condensed width that works at text sizes, not just display

Schwartz analogised it to "the evolution from Akzidenz-Grotesk to Neue Haas Grotesk" — applying that logic to Franklin instead. And the governing sentiment, which is the single most useful quote in this whole document for a rulebook:

> "if the typeface is catching your attention at all…in a museum of fine arts, then something is not right."

**2019–20, Order.** Described as deliberately incremental — "subtle 3% changes rather than radical redesign," citing Rick Rubin and Virgil Abloh. Bold MoMA Sans became a primary identifier when the logotype is absent. Colour became seasonal rather than fixed. The system moved "from the grids and guides of editorial and print publishing into a dynamic feed of colour, image, type and motion." The website moved from centred black-and-white layouts to **left-aligned** layouts with strategic colour and full-bleed imagery.

**Note on the 2019 grid:** the "12×12 modular system" and "left-aligned, tight spacing" descriptions come from conference notes on the identity work, and are about the brand system. The shipped website uses the 1–6 column flex system measured in §1.4. **Do not treat 12×12 as a web rule.**

### MoMA's own account — two primary sources

Both of these are MoMA's own blog, retrieved via the `r.jina.ai` proxy after direct fetches returned 403.

**"From the Archives: A Brief Homage to Franklin Gothic" (2010-02-26).** MoMA's Department of Graphic Design, writing about its own metal set of Franklin Gothic:

> "The Franklin Gothic typeface is the primary influence for nearly all MoMA materials; it's the basis of our logo (see the top of your screen) and our official font 'MoMA Gothic,' which were both created by Matthew Carter. We were happy to see that MoMA used a version of Franklin Gothic as long ago as the 1930s."

And — directly relevant to §6 — **MoMA itself names the double-storey `g` as the identifying mark**:

> "Can you spot Franklin Gothic on the walls of MoMA, in our subway advertisements, or anywhere else? Look for the 'two story' lowercase 'g' with a unique 'ear' to be certain!"

The post's image captions confirm the archival depth: exhibition announcements for *Corot-Daumier* (1930) and *Paintings and Lithographs: Toulouse Lautrec & Odilon Redon* (1931), and **"A MoMA wall label from the 1930s."**

**"One Typeface Fits All at MoMA" (2013-04-08), by MoMA Design Studio.** This is the single most useful governance document I found, because it states the rule *and* the licensed exception:

> "At MoMA, we are tasked to design roughly 40 different title walls each year… To manage workload, we made the decision four years ago to have two-thirds of the workload 'templatized' by sticking to one typeface—our house font, MoMA Gothic (which is based on Franklin Gothic)—for all collection rotations."

The stated split of the ~40 title walls per year:

| Tier | Count | Typeface rule |
|---|---|---|
| **Collection rotations** | 28 | Locked to MoMA Gothic. No choice. |
| **Special exhibitions** (temporary loan shows, 6th and 3rd floors) | 12 | Free — "we use other fonts, and even create new fonts ourselves" |

The decision was taken "four years ago" from 2013, i.e. **~2009** — the same moment as the Pentagram system.

The stated rationale is worth quoting because it is a design-governance argument, not an aesthetic one:

> "By eliminating automated typeface options, the designer can focus on their idea instead of figuring out which one of the million computerized typefaces to choose from, and the design inevitably becomes stronger as a result."

> "When one variable is taken away from the design process it doesn't have to limit you; it can actually make your design more impactful."

The post also records internal resistance — the decision "got quite mixed reviews from curators and our in-house designers," who feared "losing their freedom of expression." And it cites Massimo Vignelli's claim that designers need only five typefaces.

**This is the most transferable finding in the whole study.** MoMA's system is not "one typeface forever." It is **two tiers with a hard numeric ratio**: roughly 70% of surfaces are locked to the house face with zero discretion, and roughly 30% are explicitly licensed to break the rule — and the exceptional set is *enumerated in advance*, not claimed ad hoc. The freedom is budgeted.

Also note the date formatting in that post's captions, which refines R15:

```
November 22, 2009–April 26, 2010     ← years differ: both stated
July 24–November 7, 2011             ← same year: stated once, at the end
```

### Franklin Gothic's character — why this matters for §6

Per Wikipedia: designed by **Morris Fuller Benton** for **American Type Founders**, released **1902**. A grotesque/industrial sans. Key traits:
- descends from **nineteenth-century American foundry models** consolidated into ATF in 1892 — not European sources
- **double-storey `a` and `g`**, and a `Q` whose tail curls down from the centre — "uncommon in German-influenced sans-serif designs"
- optimised for "display and trade use such as headlines rather than for extended text"

This is the crux of §6. MoMA's institutional face is an **American commercial jobbing type from 1902**, not a Swiss neo-grotesque.

---

## 3. Publications and exhibition catalogues

**Method for this section.** MoMA's HTML pages are Cloudflare-protected, but **MoMA's PDF archives are open to `curl` with a browser User-Agent**. Full catalogue scans live at `moma.org/documents/moma_catalogue_{exhibitionID}_{objectID}.pdf` and press releases at `moma.org/momaorg/shared/pdfs/docs/press_archives/{n}/releases/{file}.pdf`. **Nearly everything below was read from those primary scans**, not from secondary description — seven catalogues across four eras (1934, 1936, 1941, 1950, 1953, 1955, 1972, 1973, 2017) plus contemporaneous press releases.

### 3.1 *Machine Art* (1934) — read from the original catalogue

**Dates: MoMA's own sources contradict each other.** The catalogue title page reads **"Machine Art / March 6 to April 30, 1934."** The 1 March press release says it "opens Wednesday, March 7" and "will continue until April 16." The 23 April release says it "closes April 30." MoMA's current website says March 5 – April 29. **Use the catalogue's own dates and note the run was extended.**

Masthead: **"Philip Johnson, Director of the Exhibition; Ernestine M. Fantl, Assistant."**

**Design credits — verbatim from the catalogue's acknowledgments page:**

> for the design of the cover — **Prof. Josef Albers**, Black Mountain College, Black Mountain, N. C.
> for the photography in the catalog — **Miss Ruth Bernhard**
> for his assistance in designing the installation — **Mr. Jan von Ruhtenberg**, of Stockholm

**Correction:** secondary sources (including my own earlier draft of this document) credit Albers with the *page layouts*. **The catalogue credits him for the cover only.** Note also that the scanned copy is the **cloth-bound edition, whose cover is plain black cloth** — Albers's ball-bearing cover belongs to the **paper-bound** edition.

**Colophon:** *"Twenty-five hundred copies of this catalog were printed for the trustees of the Museum of Modern Art, New York, by the **Blanchard Press, Inc.**, New York, March, Nineteen Thirty-four."*

**Extent and price** (3 March press release): "**116 pages and 115 half-tone illustrations**, more than in any previous catalog issued by the Museum. The price is **$1.50 for the paper-bound, $3.50 for the cloth-bound**."

**A widely repeated claim is false:** Machine Art was *not* MoMA's first exhibition catalogue. The book's own back matter lists dozens of prior MoMA catalogues with page counts, plate counts and prices — *Painting in Paris*, *Henri-Matisse*, *American Folk Art*, *Modern Architecture*, *Edward Hopper*.

**The catalogue states its own listing rule, printed in the book:**

> Listing of each object is as follows: Name of the object / Name of the manufacturer / Name of the designer / **Price**
> Unless otherwise specified the object may be purchased from the manufacturer.
> **An asterisk before a catalog number indicates that the work is illustrated by a plate which bears the same number.**

Six divisions (industrial units; household and office equipment; kitchen ware; house furnishings and accessories; scientific instruments; laboratory glass and porcelain), and "within each division the objects are listed according to use." Checklist runs **entries 1–402**; the exhibition held "more than a thousand items."

**Prices carry the retail channel** — this answers the question I earlier marked UNVERIFIED, and the answer is yes:

```
$12.95. Department and hardware stores
$193.50. Licensed plumbers
75¢ to $1.35. Lewis & Conger
$857.00                        ← no channel = buy from the manufacturer
```

**The famous ball bearing.** Catalogue entry **`*50. Self-aligning ball bearing / SKF Industries`** — and that is the *entire* entry: **no designer, no price**. MoMA's later collection record attributes it to **Sven Wingquist, 1907**, chrome-plated steel, gift of the manufacturer, accession **211.1934**. **The Wingquist attribution is a later museum act, not a 1934 one.**

**Epigraphs and essays.** Three epigraphs: **Plato, *Philebus* 51c** (Greek then English); **Aquinas, *Summa Theologiae*** quoted via Maritain's *Art et Scolastique* (1927, p. 250); **L. P. Jacks, *Responsibility and Culture***. The foreword is signed **"A. H. B., Jr."** and ends *"Not only must we bind Frankenstein — but we must make him beautiful."* The history essay is signed **"P. J."**

**Installation:** false ceilings of muslin; walls in "pastel blue, pink and gray"; stands of aromatic cedar and Circassian walnut; shelves of black and white Carrara glass. Three named display methods: **isolation, grouping, variation**. A third-floor "jewel room" showed precision instruments **on black velvet**.

**The beauty contest** (23 April release): judges **Amelia Earhart, Prof. John Dewey and Prof. Charles R. Richards** chose (1) a section of large steel spring, (2) an aluminium outboard propeller, (3) the self-aligning ball bearing. **Frances Perkins, Secretary of Labor, judged by catalog from Washington.** The public chose a Carl Zeiss triple mirror.

**A second misattribution to kill.** The quote "everyday articles of excellent design at reasonable prices" is routinely attributed to the Machine Art press release. It appears in **none** of the three 1934 releases nor the catalogue. MoMA's own 2019 wall text attributes it to the press release for ***Useful Household Objects under $5.00* (1938)**.

### 3.2 *Cubism and Abstract Art* (1936) — Barr's diagram, transcribed

**2 March – 19 April 1936.** Organised by **Alfred H. Barr, Jr.**

**Barr designed and drew the diagram himself.** MoMA's own scholarship (Glenn D. Lowry, *Abstraction in 1936: Barr's Diagrams*) captions it: *"On the front-cover dust jacket is **a diagram designed by Barr** charting the sources and evolution of modern art. Offset, printed in color, **10⅛ × 21⅞ in.**"* MoMA holds **six hand-drawn drafts**, one in pencil and ink **on a paper envelope**. No other designer is credited.

**The diagram as actually rendered from the jacket scan:**

- Pale grey ground; **two ink colours, black and red**.
- **Red date scale down both left and right margins**, 1890–1935 in five-year steps.
- **Red boxes** = external sources: JAPANESE PRINTS, NEAR-EASTERN ART, NEGRO SCULPTURE, MACHINE ESTHETIC. **Black box** = MODERN ARCHITECTURE.
- **Red arrows** from the red boxes; **black arrows** for internal lineages; **dotted arrows** for weaker influence.
- Movement nodes in caps with year + city beneath (SUPREMATISM 1913 Moscow; BAUHAUS 1919 Weimar 1925 Dessau; …).
- **Only seven artists named** — six with death dates (Van Gogh, Gauguin, Cézanne, Seurat, Redon, Rousseau) plus Brancusi. Earlier drafts named many more; **Barr edited names out**.
- Two terminal labels at 1935: **NON-GEOMETRICAL ABSTRACT ART** / **GEOMETRICAL ABSTRACT ART**.
- **A solid red band across the foot** carries "CUBISM AND ABSTRACT ART" reversed out in white sans caps.

**A trap to avoid: the claim that the chart is set in Futura is UNVERIFIED.** It is widely repeated in secondary sources and search summaries — it was in the first draft of this document, from exactly such a summary, and has been removed. No fetched source confirms it, and MoMA's own detailed essay on the diagram never names the typeface. **Do not assert Futura.**

Lowry identifies two likely precedents: Covarrubias's *The Tree of Modern Art* (*Vanity Fair*, May 1933) and **Malevich's Analytical Charts, 1925–27**, four of which Barr showed and personally smuggled out of Germany in 1935. Barr kept revising the chart — Lowry quotes a 1941 letter to Monroe Wheeler giving line-by-line arrow corrections.

**Colophon:** *"Three thousand copies of this catalog were printed for the Trustees of the Museum of Modern Art by **The Spiral Press**, New York, April, 1936."* Jacket flap: "248 Pages, 223 Illustrations… Price: $3.00."

Note the division of labour: Barr wrote the essay, but **"Catalog by Dorothy C. Miller and Ernestine M. Fantl"** and **"Bibliography by Beaumont Newhall."**

**The transferable principle stands: the cover is not a title page — it is the argument, drawn by the curator.**

### 3.3 *Good Design* (1950–1955)

A joint **MoMA / Merchandise Mart, Chicago** program. From the 1953 catalogue: *"The Museum has appointed **Edgar Kaufmann, Jr., Director of the activity**."*

**It was a two-city, twice-yearly cycle, not an annual show.** Selections were made ~6 weeks before the Winter (January) and Summer (June) markets and installed in Chicago for a year; *"A New York version of Good Design is presented in the Museum of Modern Art each autumn… for about eight weeks."* Chicago showed ~500 items in ~5,500 sq ft. **The program began January 1950 in Chicago; the first New York show opened November 1950.**

New York editions: **22 Nov 1950** – 28 Jan 1951 · 27 Nov 1951 – 27 Jan 1952 · 23 Sep – 30 Nov 1952 · 22 Sep – 29 Nov 1953 · 8 Feb – 20 Mar 1955. *(Wikipedia gives 21 Nov for the first; **the printed catalogue cover says 22 November** — prefer the catalogue.)*

**Selection criteria, verbatim:**

> "Basis of selection is: **eye-appeal, function, construction and price, with emphasis on the first**."
> "Selection Committees … consist of one business man actively interested in art or design; one designer, craftsman or teacher; and the Director, who acts as permanent Committee Chairman. **A majority vote of the Committee is final.**"

Jurors included **Philip Johnson and Eero Saarinen** (Jun 1951), **Russel Wright** (Jan 1953), **Florence Knoll** (Jun 1953), Serge Chermayeff (Jun 1950).

**Installation designers, from the catalogues:** *"**Charles Eames, Finn Juhl, Paul Rudolph and Alexander Girard** have designed the first four of these installations"* (1950, 1951, 1952, 1953). 1955 is **UNVERIFIED**.

**And it is both Eameses.** Kaufmann's 1950 foreword: *"settings brilliantly designed by **Ray and Charles Eames**, who came from Los Angeles especially for this."* (The June 1950 press release credits only Charles — the catalogue is the better source.)

**The catalogue as an object.** The 1950 catalogue is a slim **~16-page saddle-stitched booklet with no product photographs whatsoever** — cover mark, foreword, then a pure tabulated checklist. Kaufmann states the policy: *"**Retail stores and approximate prices in New York are listed for the convenience of visitors to the exhibition.**"*

The checklist is a **four-column table: ITEM | DESIGNER | MANUFACTURER | STORE** (price inside the store cell), entries 1–256, column heads in italic sans caps:

```
18.  Molded plastic chair, metal legs — Charles Eames — Herman Miller Furniture Co.
     — Sachs Quality Stores, $34.95
243. Plastic bottle caps — Edward J. Towns — Towns Quality Products, Inc.
     — McCrory 5¢ & 10¢ stores, 3 for 25¢
```

By **1953** numbering switches to letter-prefixed sections (A—Furniture … L—Household Appliances; entries read `K 33`, `L 1`), with asterisks marking handmade items that "cannot be duplicated precisely." The **1955** edition adds an **APPROX. RETAIL** column at the front and a **"SHOWN GOOD DESIGN"** column giving the season each item debuted.

**The Good Design tag — partially verified, and my earlier claim needs narrowing.** MoMA's own 2019 checklist credits **MORTON GOLDSHOLL alone**, for *Good Design*, **1953**, 7⅞ × 7 11/16 in. Steven Heller in *PRINT* says Morton Goldsholl designed the **1950** logo; Wikipedia credits **Morton *and Millie* Goldsholl**. **The 1950 date and the joint Millie credit are UNVERIFIED against any MoMA source.** The mark on the 1953 cover is a flat orange field with a **solid black disc**, "GOOD / DESIGN" reversed out in white geometric-sans caps.

MoMA's 2019 wall text on the retail kit: *"A MoMA Good Design Kit provided participating retail outlets throughout the US with sample store layouts, advertising, and **logo labels** to promote sales."*

**Correction, stated explicitly by MoMA's sources:** "**No awards were granted** to designers whose work was put on view." Good Design was a *selection*, not a prize.

### 3.4 *Italy: The New Domestic Landscape* (1972)

**26 May – 11 September 1972.** *(My earlier draft said 23 May from a secondary source; MoMA press release No. 26 says 26 May.)* *"Directed and installed by **Emilio Ambasz, Curator of Design**."* **180 objects plus 11 environments commissioned by the Museum**, each environment on a 16 × 16 ft footprint, most containing a TV screen showing a 3–4 minute film by its designer. Objects were shown on the Garden terraces "in containers especially designed by Mr. Ambasz."

**Catalogue colophon, verbatim — this is the fact most often fumbled:**

> The Museum of Modern Art, New York, in collaboration with **Centro Di, Florence**
> **Produced by Centro Di, Florence** · **Coordinating editor: Helen M. Franc**
> **Layout: Matilde Contri (Centro Di)** · **Cover design: Emilio Ambasz**
> Printed in Italy, April 1972 · Hardbound ISBN 0-87070-394-3 · Paperbound ISBN 0-87070-393-5

**So there IS a separate layout credit — Matilde Contri of Centro Di.** My earlier draft said none was found; that was wrong.

**Extent, from MoMA's press release: "432 pages; 380 illustrations (110 in color); clothbound $15.00; paperbound $7.95."** *(A widely-circulated figure of "430 pages, 520 illustrations, 124 in colour" comes from secondary sources and conflicts with MoMA's own number — prefer MoMA's.)*

Structure is four parts, not a simple objects/environments split. Environments are grouped as **Design as postulation** (Aulenti, Sottsass, Colombo, Rosselli, Zanuso & Sapper, Bellini) · **Design as commentary** (Pesce) · **Counterdesign as postulation** (La Pietra, Archizoom, Superstudio, Gruppo Strum, Enzo Mari) · plus competition winners. Essayists include **Gregotti, Mendini, Celant, Tafuri, Menna**, Portoghesi, Benevolo and Argan.

**Caption convention — objects carry no numbers at all**; indexes key to *page* numbers. The caption block sits small, flush left, in the lower outer margin:

```
Designer / Object name. Design year (Production year) / Materials, inches (cm) / Manufacturer. Gift of the manufacturer
```

**Backgrounds are dark, not white** — black-to-charcoal graduated studio sweeps that make coloured plastics glow.

### 3.5 *Items: Is Fashion Modern?* (2017)

**1 October 2017 – 28 January 2018.** **Paola Antonelli**, Senior Curator, with **Michelle Millar Fisher**, Curatorial Assistant. **111** garments, accessories and accoutrements; MoMA commissioned prototypes for items it could not collect.

**Full design credit, from the catalogue colophon:**

> Edited by **Rebecca Roberts** · Image consultancy by **Sarah Rafson, Point Line Projects**
> **Book concept and design by Lana Cavar and Natasha Chandani, Clanada**
> Illustrations by **Narcisa Vukojevic** · Production by **Hannah Kim**
> **This book is typeset in Circular Pro and Burgess. The paper is 100 gsm Munken Polar Rough and 135 gsm Magno Starr.**

**288 pages, hardcover, 8 × 10 in., 350 colour, $45, ISBN 978-1-63345-036-3.**

**Note the deliberate split: Elle Kim (Senior Art Director) and Kevin Ballon did the *exhibition graphics*; Clanada did the *book*.** Point Line Projects did image licensing only — do not credit them with design.

Structure: an **A–Z encyclopedia** from *501s* to *YSL Touche Éclat*, interleaved with five commissioned photo essays. **Captions are grouped in a block at the foot of the outer column, keyed by superscript figure numbers** — not set beneath each image. Imagery is location and set-styled photography, archival material and sketches — **not white-ground product shots**.

### 3.6 The recurring rules — what actually recurs across ninety years

Derived from reading the 1934, 1936, 1941, 1950, 1953, 1955, 1972, 1973 and 2017 books.

**Rule 1 — The book states its own numbering convention, in the front matter.** The most consistent habit across ninety years.
- 1934: *"An asterisk before a catalog number indicates that the work is illustrated by a plate which bears the same number."*
- 1936: *"Figures in parentheses in captions beneath illustrations refer to numbers in catalog section."*
- 1953: *"items that are handmade cannot be duplicated precisely. These items are designated by an asterisk."*
- 1973: *"**Illustration numbers are given in the margin.** … Accession numbers, given in parentheses, do not necessarily correspond to dates of design or manufacture. The letters SC indicate Study Collection."*

**Rule 2 — Dual numbering: an illustration number and a checklist number, explicitly cross-linked.** 1934 collapses them into one (asterisk marks which entries are illustrated). 1936 runs two parallel systems — figures 1–223 and catalogue 1–386 — with captions reading `Fig (Cat) Artist: Title, date`, e.g. **`43 (250) Russolo: Automobile (Dynamism), 1913 (not in exhibition)`**. 1973 hangs illustration numbers in the **left margin**. 1972 abandons numbering entirely.

**Rule 3 — Captions go BELOW the plate, flush with its left edge, plate number first, hanging left.** Verified by rendering pages. **A caption never sits above a plate in anything examined.** The modern departure: 1972 moves the block to the lower outer margin; 2017 groups captions at the foot of the column.

**Rule 4 — The caption/entry data stack is fixed and ordered.** For design objects: **Designer → Nationality/dates → Manufacturer → Title → Date → Medium → Dimensions (imperial then metric in parens) → Credit line.** MoMA states this itself in its published educator guide:

> "Sven Wingquist. Swedish, 1876–1953. SKF Industries, Inc. USA. Self-Aligning Ball Bearing. 1907. Chrome-plated steel, h. 1 3/4" (4.4 cm), diam. 8 1/2" (21.6 cm). Gift of the manufacturer"

Note the **"company design"** convention for anonymous corporate authorship: *"American Steel & Wire Co., company design. American, est. 1898."*

**Rule 5 — Price and point of sale are part of the record, for design shows.** 1934 lists price + retail channel per entry; 1950 devotes a whole **STORE** column; 1955 promotes **APPROX. RETAIL** to the front. **A genuine ninety-year through-line: MoMA's design catalogue is also a shopping guide.**

**Rule 6 — Margin discipline: the text block starts at a fixed top position and the page is allowed to end early.** 1934 checklist pages begin at an identical top line regardless of content; a page with six entries leaves the bottom **60% of the leaf empty**. **No vertical justification, no filling.** Plates sit within margins at their own natural proportions — **plates are not forced to a common measure**, and their right edges are deliberately ragged against each other.

**Rule 7 — Running heads carry the section, with "—Continued".** 1934: `SCIENTIFIC INSTRUMENTS—Continued`, letterspaced small caps with "Continued" in italic. 1941 uses a running **foot** instead.

**Rule 8 — The colophon is a fixed sentence.** *[edition size] copies of this catalog were printed for the Trustees of the Museum of Modern Art by [press], [city], [month, year].* The modern equivalent survives as the *Items* colophon naming typefaces and paper stocks.

**Rule 9 — Essays are signed with initials; the checklist is separately authored and credited.** 1934: "A. H. B., Jr." and "P. J." 1936: "Catalog by Dorothy C. Miller and Ernestine M. Fantl"; "Bibliography by Beaumont Newhall." **The checklist is treated as scholarship with authors, not as back matter.**

**Rule 10 — Dual binding, dual price, stated in the back matter.** 1934: paper $1.50 / cloth $3.50. 1972: paper $7.95 / cloth $15.00. Back-matter book lists use a fixed formula: *"200 pages; 65 plates; paper bound—$1.50; bound in boards—Out of print."*

### 3.7 What does NOT recur — and the white-background myth

- **Typeface and register change completely by era.** 1934 and 1936 are **serif**, two-column oldstyle. 1941 *Organic Design* is entirely **sans-serif** with an asymmetric image-left/text-right grid. 1950 is a **sans tabular grid**. 1973 is serif with **full-bleed images**. 2017 is Circular Pro + Burgess.
- **Full-bleed vs. plate-with-margin flips.** 1934 and 1936: strictly **plate-within-margin, never bleeding**. 1973: **full-bleed images running off three edges.** So "the plate floats in white" is a **pre-war convention, abandoned by the 1970s**.
- **Captions are sometimes abolished entirely.** 1941 *Organic Design* has **no plate captions at all** — objects are identified by bold positional cues inside the running text: *"the arm of the reclining chair demonstrates this use **(upper left)**… The light stacking chairs **(center left)**…"*

**The "object photographed on seamless white" convention — the clearest negative finding in this research.**

| Catalogue | Actual ground |
|---|---|
| 1934 *Machine Art* | light grey, graduated grey, solid black; some shot **in a room, on a carpet** |
| 1936 *Cubism* | black-and-white halftones, one per page |
| 1941 *Organic Design* | furniture in room settings on grey grounds |
| 1972 *Italy* | **dark** black-to-charcoal studio sweeps |
| 2017 *Items* | location and set-styled photography, archival images, sketches |

**Not one of the five uses a seamless-white system.** The Met's 2024 exhibition *The Real Thing: Unpackaging Product Photography* locates white-centred product shots in early commercial studio work c. 1915, with the 1920s–30s avant-garde pushing *away* from it.

> **Do not credit MoMA with the object-on-white convention. MoMA's own historic practice contradicts the attribution.** What MoMA actually did — verified in *Machine Art* 1934 — was **isolate the object from its context** (pedestals, muslin false ceilings, screened molding, black velvet). Isolation is the MoMA principle; white is not.

### 3.8 MoMA's published style guidance — and the policy that matters most

- **There is no publicly available MoMA design or typographic style guide.** A "Captions — MoMA Style Guide" document was once on Scribd but now returns HTTP 410. **UNVERIFIED.**
- **The caption stack is documented indirectly** through MoMA's educator guide *Made for Living* (Rule 4 above).
- **MoMA Library's cataloguing instructions are public** and confirm each exhibition gets a **MoMA exhibition number** recorded in MARC field 024 — which is why catalogue PDF URLs carry it (`moma_catalogue_**1784**_…` = Machine Art).
- **MoMA's editorial house style is not published.** Whether it follows Chicago plus the Association of Art Editors guide is **UNVERIFIED**.

**And the single most important policy finding for a rulebook.** Pentagram's own account of the 2009 identity states:

> "Individual exhibitions will continue to have their own identities, used in exhibition graphics, **catalogues** and websites."

**MoMA's catalogues are deliberately exempt from the institutional identity system.** There is no single "MoMA book look," *by design policy*. This is the print-side counterpart of the two-tier rule in §2 (R17): the institution locks the wayfinding layer and explicitly frees the publication layer.

### 3.9 Who designs MoMA's books

**The most important correction: MoMA has no tradition of a house book designer.** The verified pattern across ninety years is a small in-house design/production staff in the Department of Publications commissioning marquee catalogues out to **rotating outside studios**.

**Monroe Wheeler built the program.** Joined 1935; **Director of Publications 1939**; first Director of Exhibitions 1940; retired 1967. He had co-founded the fine press **Harrison of Paris**. MoMA's 1969 press release: *"Under Mr. Wheeler's direction, the Museum published **over 350 books** … known throughout the world for their **excellence of layout and design**,"* more than twenty of which won design awards.

**The only clearly documented in-house design chief was Kathleen Haven**, named **Design Coordinator and administrative head of a Graphics Design Group** in April 1969, coordinating "all phases of the Museum's graphics for exhibitions, publications, posters, signs, brochures, and invitations."

**There is no Publications creative director today** — a verified negative. MoMA's job postings show a Production Director over a Production Manager and **one** Publications Designer, with book designers hired freelance.

| Title | Year | Designer |
|---|---|---|
| *The Family of Man* | 1955 | **Leo Lionni** |
| *Annette Messager*; *Lilly Reich* | 1995 | **Emily Waters** |
| *Design and the Elastic Mind* | 2008 | **Irma Boom** |
| *Color Chart* | 2008 | **Takaaki Matsumoto and Hisami Aoki** |
| *Home Delivery* | 2008 | **Naomi Mizusaki** |
| *Gabriel Orozco* | 2009 | **Pure+Applied** |
| *In & Out of Amsterdam* | 2009 | **Mevis & Van Deursen** |
| *Items: Is Fashion Modern?* | 2017 | **Clanada** (Lana Cavar, Natasha Chandani) |
| *Neri Oxman: Material Ecology* | 2020 | **Irma Boom** |
| MoMA seasonal catalogues 2017–2024 | | **Amanda Washburn** (in-house) |

**On the names suggested in the brief:**

- **Bruce Mau — the premise is a confusion.** BMD's MoMA work was **2004 signage and wayfinding**; invited to redesign the logo, the firm **declined to change it**. **No evidence of any MoMA book or catalogue.**
- **Takaaki Matsumoto — real, but only two MoMA projects verified**: *Color Chart* (2008, with **Hisami Aoki**, a co-credit almost always dropped) and *MoMA Now*. His museum work is mostly for the Met, Philadelphia and the Whitney.
- **Emily Waters — real designer, wrong title.** She designed at least two MoMA catalogues in the 1990s, but her own Cooper Union bio lists MoMA as a **client** and her project line as "identity and environmental graphics." **"Senior book designer" and "design manager" are both UNVERIFIED.**
- **Herbert Bayer** is credited by MoMA as **editor** of *Bauhaus 1919–1928* (1938), **not designer**. The designer credit is commonly asserted and **UNVERIFIED**.
- **Frances Keech was not a publications director** — evidence points to secretary to Monroe Wheeler, later a donor with a named fund.

---

## 4. The wall label / object label standard

This is the best-evidenced section. Two independent primary sources agree: MoMA's own CC0 collection dataset, and the live collection pages.

### 4.1 The dataset

`https://github.com/MuseumofModernArt/collection` — MoMA's own collection metadata, **CC0 1.0**, 160,699 works, CSV and JSON, UTF-8. (Note: the CSV is stored via Git LFS; the raw `raw.githubusercontent.com` URL returns an LFS pointer. Use `media.githubusercontent.com/media/...` to get the real file.) I parsed 57,760 rows from a 25 MB range request.

Field order in `Artworks.csv`, verbatim:

```
Title, Artist, ConstituentID, ArtistBio, Nationality, BeginDate, EndDate,
Gender, Date, Medium, Dimensions, CreditLine, AccessionNumber,
Classification, Department, DateAcquired, Cataloged, ObjectID, URL, ImageURL,
OnView, Circumference (cm), Depth (cm), Diameter (cm), Height (cm),
Length (cm), Weight (kg), Width (cm), Seat Height (cm), Duration (sec.)
```

The tombstone fields, in MoMA's own storage order: **Title → Artist → ArtistBio → Date → Medium → Dimensions → CreditLine → AccessionNumber → Classification → Department.**

### 4.2 The canonical on-page label

Transcribed from `moma.org/collection/works/79802` (van Gogh, *The Starry Night*), read via the `r.jina.ai` proxy:

Above the fold, in order:

```
The Starry Night              ← italic
Saint Rémy, June 1889         ← place, month year
Oil on canvas                 ← medium
MoMA, Floor 5, 501 The Alfred H. Barr, Jr. Galleries   ← location
```

Then, after the interpretive text, the structured block — **these are the literal field labels MoMA prints**:

```
Medium         Oil on canvas
Dimensions     29 x 36 1/4" (73.7 x 92.1 cm)
Credit         Acquired through the Lillie P. Bliss Bequest (by exchange)
Object number  472.1941
Department     Painting and Sculpture
```

Verified on a second object in a different department — `works/2`, Otto Wagner, Architecture & Design:

```
Ferdinandsbrücke Project, Vienna, Austria (Elevation, preliminary version)
1896
Ink and cut-and-pasted painted pages on paper
Not on view

Medium         Ink and cut-and-pasted painted pages on paper
Dimensions     19 1/8 x 66 1/2" (48.6 x 168.9 cm)
Credit         Fractional and promised gift of Jo Carole and Ronald S. Lauder
Object number  885.1996
```

The order holds across departments. Four rules fall out:

1. **The field label is `Object number`, not `Accession number`** — even though the underlying data field is `AccessionNumber`. Public-facing wording differs from the schema.
2. **Medium is stated twice** — once in the running head block, once in the structured block. Redundancy is accepted for scannability.
3. **When a work is off view, the location line becomes the literal string `Not on view`** — the slot is never empty. This is a good pattern: the field always renders, with an honest null.
4. **Title is italic; everything else is roman.** No bold in the tombstone at all.

### 4.3 The citation string

The `<title>` of each object page is MoMA's canonical one-line citation:

```
Vincent van Gogh. The Starry Night. Saint Rémy, June 1889 | MoMA
Otto Wagner. Ferdinandsbrücke Project, Vienna, Austria (Elevation, preliminary version). 1896 | MoMA
```

**`Artist. Title. Date`** — full stops as separators, not commas, not pipes, not dashes. The date segment is `Place, Month Year` when place is known, else bare year.

### 4.4 Artist identity

From the artist block: `Vincent van Gogh` / `Dutch, 1853–1890`.

In the dataset, the same information is parenthesised:

```
(Austrian, 1841–1918)
(French, born 1944)
(Austrian, 1876–1957)
(French and Swiss, born Switzerland 1944)
```

Rules:
- Living artist: `born YYYY`, no en dash, no open range.
- Dual nationality: `French and Swiss` — spelled out with "and".
- Nationality ≠ birthplace: `born Switzerland 1944` appends the country.
- On the artist page the parens are dropped; in metadata they are kept.

### 4.5 Object number format

**`sequence.year`** — the sequence comes **first**. Confirmed across many rows:

```
885.1996     DateAcquired 1996-04-09
1.1995       DateAcquired 1995-01-17
2.1997       DateAcquired 1997-01-15
472.1941     (The Starry Night)
```

Multi-part works append a part number, and ranges use a hyphen:

```
3.1995.1        one sheet
3.1995.10       tenth sheet
3.1995.1-24     the set of 24
```

This is worth flagging because it is **the opposite of the common US museum convention**, which is year-first (`1996.885`). General museum-registration sources describe the year-first three-part system as standard practice; MoMA does not follow it. Anyone building a fake accession number from general knowledge will get it backwards.

### 4.6 Dimensions

```
19 1/8 x 66 1/2" (48.6 x 168.9 cm)
16 x 11 3/4" (40.6 x 29.8 cm)
20 x 20" (50.8 x 50.8 cm)
29 x 36 1/4" (73.7 x 92.1 cm)
Each: 14 x 18" (35.6 x 45.7 cm)
```

Rules:
- **Height × width**, in that order.
- Imperial first, **vulgar fractions** (`36 1/4`), a **straight double-prime inch mark** closing the imperial pair only.
- Metric in parentheses, **one decimal place**, `cm` after the second number only.
- The separator is a lowercase **`x`**, not `×`.
- Multi-part works are prefixed `Each: `.

### 4.7 Dashes

Two different marks, used consistently:

- **En dash** for life dates and closed spans: `1841–1918`, `1853–1890`, `10:30 a.m.–5:30 p.m.`, `Sep 20, 2026–May 2, 2027`.
- **Hyphen** for elided work dates: `1976-77`.

So `1976-77` (a work made over two years, second year elided, hyphen) and `1841–1918` (a life span, full years, en dash) are formatted differently on purpose.

### 4.8 Credit line grammar

Opening constructions, by frequency in the 57,760-row sample:

| Count | Opening |
|---|---|
| 22,110 | `Gift of …` |
| 5,048 | `Purchase` |
| 898 | `Given anonymously` |
| 713 | `Acquired through …` |
| 464 | `Transferred from …` |
| 416 | `Anonymous gift` |

Longer forms observed verbatim:

```
Gift of Jo Carole and Ronald S. Lauder
Fractional and promised gift of Jo Carole and Ronald S. Lauder
Purchase and partial gift of the architect in honor of Lily Auchincloss
Gift of the architect in honor of Lily Auchincloss
Acquired through the Lillie P. Bliss Bequest (by exchange)
```

Rules:
- Sentence case; no terminal period.
- The donor is a **named person**, or a **named fund** (`the Lillie P. Bliss Bequest`, `Inter-American Fund`, `the Abbott-Levy Collection`).
- Acquisition mechanism is stated honestly and can be compound: `Fractional and promised gift of`, `Purchase and partial gift of`.
- Qualifiers ride in parentheses at the end: `(by exchange)`.
- A donor may be described by role rather than name: `Gift of the architect`.
- Dedications use `in honor of`.

**Why the grammar is so consistent: it is legally constrained, not stylistic.** MoMA's own *Collections Management Policy* (2020-04-20, PDF on moma.org) establishes:

- The acquisition mechanisms are a **closed legal set**. The policy lists the ways title is acquired as "**gift, bequest, purchase, transfer, or exchange**" — which maps one-to-one onto the credit-line openings observed in the data (`Gift of`, `… Bequest`, `Purchase`, `Transferred from`, `(by exchange)`).
- **"Fractional and Promised Gifts"** is a formally defined, capitalised category in the policy, requiring "a legally binding promissory document approved by the Office of the General Counsel." So `Fractional and promised gift of …` is not a stylistic flourish — it is a legal status being stated.
- **The number is assigned by the Registrar** "immediately after the Trustee committee meeting at which an acquisition is approved."
- Critically, the Museum maintains the **"exact credit line at time of acquisition."** The credit line is **fixed at the moment of acquisition and not subsequently rewritten.**

That last point is the transferable discipline: *the label records what was true when the object entered, and is never retroactively tidied.* A credit line is a historical record, not a caption to be edited for consistency.

### 4.9 Departments and classifications

Departments in the sample: `Drawings & Prints` (30,417), `Photography` (19,450), `Architecture & Design` (7,887), `Painting & Sculpture` (6). MoMA also has Film and Media & Performance departments not represented in my byte range.

**Inconsistency worth noting:** the dataset writes `Painting & Sculpture` with an ampersand; the live object page prints `Department  Painting and Sculpture` spelled out. Data layer and presentation layer differ.

Classifications are a controlled vocabulary, title case, singular: `Illustrated Book`, `Photograph`, `Design`, `Drawing`, `Print`, `Architecture`, `Periodical`, `Multiple`, `Notebook`, `Portfolio`, `Painting`, plus archive-specific values like `Mies van der Rohe Archive`.

### 4.10 Publication citations on object pages — and an honest inconsistency

Object pages attribute their interpretive text to a MoMA publication. **Two different citation styles are live on the site simultaneously.**

Style A — older, running Chicago-ish, with page number and terminal period:

```
The Museum of Modern Art, MoMA Highlights, New York: The Museum of Modern Art,
revised 2004, originally published 1999, p. 33.

Publication excerpt from an essay by Terence Riley, in Matilda McQuaid, ed.,
Envisioning Architecture: Drawings from The Museum of Modern Art,
New York: The Museum of Modern Art, 2002, p. 40.
```

Style B — newer, parenthetical imprint, no page number, no terminal period:

```
Publication excerpt from MoMA Highlights: 375 Works from The Museum of Modern Art,
New York (New York: The Museum of Modern Art, 2019)
```

Constant across both: the imprint is always **`New York: The Museum of Modern Art`** — the institution writes its own name in full, with the definite article, never "MoMA" in a citation. Publication titles are italic. Editors are marked `, ed.,`. Contributed essays are credited `an essay by <name>, in <editor>, ed., <title>`.

This inconsistency is worth recording rather than smoothing over: it shows that even a system this disciplined carries two generations of style on the same page, because the older text was migrated with its original citation intact rather than being rewritten — the same conservatism seen in §4.8, where the credit line is fixed at acquisition.

### 4.11 What I could not verify

- **The physical wall label's typographic specification** — point sizes, leading, label board dimensions, mounting height, line-break rules. **UNVERIFIED.** MoMA has not published this and I found no reliable transcription of the spec.
- One secondary source states MoMA "designs roughly 40 different title walls each year and uses one house font, MoMA Gothic (based on Franklin Gothic), for all collection rotations," and that "the smallest in-gallery signs are object labels." I could not fetch MoMA's own post to confirm this (403), so treat as **weakly sourced**.
- General museum-label guides describe a size hierarchy (artist name largest, then title, then year, with credit lines smallest). This is **generic practice, not MoMA-specific**, and should not be attributed to MoMA.
- **Whether physical gallery labels use the same field order as the website.** The website order is solid; the wall order is **UNVERIFIED**.

---

## 5. The luggage-tag / shipping-label aesthetic

### 5.1 Real dimensions — the standard manila tag series

Manila shipping tags are sold in a **numbered standard series, #1 to #8**. Full table, from Kenmore Label & Tag's product spec (cross-checked against a MACO/Amazon listing which agrees on #5 = 4¾ × 2⅜"):

| Tag No. | Inches (L × W) | Decimal | mm (approx) |
|---|---|---|---|
| #1 | 2¾ × 1⅜ | 2.750 × 1.375 | 70 × 35 |
| #2 | 3¼ × 1⅝ | 3.250 × 1.625 | 83 × 41 |
| #3 | 3¾ × 1⅞ | 3.750 × 1.875 | 95 × 48 |
| #4 | 4¼ × 2⅛ | 4.250 × 2.125 | 108 × 54 |
| #5 | 4¾ × 2⅜ | 4.750 × 2.375 | 121 × 60 |
| #6 | 5¼ × 2⅝ | 5.250 × 2.625 | 133 × 67 |
| #7 | 5¾ × 2⅞ | 5.750 × 2.875 | 146 × 73 |
| #8 | 6¼ × 3⅛ | 6.250 × 3.125 | 159 × 79 |

**The single most useful fact in this section, which I verified arithmetically across all eight sizes:**

> **Every standard manila shipping tag is EXACTLY 2:1.**

Width is exactly half the length in all eight cases — not approximately, exactly. And the series is a clean arithmetic progression:

```
Tag #n:  length = 2.25 + 0.5n  inches
         width  = 1.125 + 0.25n inches   (= length / 2)
```

Verified: #1 → 2.750 × 1.375 ✓ … #8 → 6.250 × 3.125 ✓. All eight ratios compute to 2.0000.

**This is a hard, checkable layout rule**, and it has a pleasing consequence for this project: a 2:1 box is exactly MoMA's most-used image ratio, `padding-top: 50%` (§1.8). A tag-shaped element and MoMA's widest standard image crop are the same rectangle. If you build a "tag" component, `aspect-ratio: 2 / 1` is not a stylistic choice — it is the real object's dimension.

Note the orientation convention: **the tag is landscape in its stated dimensions** (length first, along the axis away from the hole), even though tags usually *hang* portrait. So a hanging tag reads as a 1:2 portrait rectangle; the spec table states it as 2:1 landscape.

### 5.2 Stock and material

From the same supplier spec:

- **Caliper: 10 point or 13 point** — i.e. 0.010" or 0.013" thick (roughly 0.25 mm / 0.33 mm). 10pt is offered at ~10% lower cost; 13pt is the heavier standard.
- Described as "heavy duty stock," sold in packs of 1,000.
- **Colour: "Manila (tan/buff colored stock)."** The supplier's own words. Manila is a *buff/tan*, not white and not brown kraft.
- **Eyelet: "fiber-reinforced eyelets for additional strength."** The default reinforcement is a **fibre washer, not metal.** A metal eyelet ("Fiber w/Metal") is an upgrade costing ~50% more.

That last point corrects a common misconception: the archetypal shipping tag has a **fibre patch ring**, and the metal grommet is the premium variant. If you are drawing a tag and reaching for a chrome grommet by default, you are drawing the expensive one.

- **Attachment**: sold separately — 12" galvanised tag wires in various gauges, 12" cotton tag strings, or "Diamond Deadlock" fasteners. So string, wire and clip are all standard; string is not the only idiom.

A second, independent research pass confirmed the table above from a different supplier (Uline, seven per-SKU spec pages fetched individually) and extended the series:

| Tag No. | Inches | Ratio |
|---|---|---|
| #10 | 7¼ × 3⅝ | 2.000 |
| #12 | 8 × 4 (15 pt stock) | 2.000 |

**#9 and #11 appear not to exist** — no supplier lists them; the series runs 1–8, then 10, then 12. The 2:1 rule holds at every size. Cross-manufacturer confirmation that this is an industry standard rather than one vendor's scheme: MACO #1 = 2¾ × 1⅜", Global Industrial #7 = 5¾ × 2⅞", Avery 12601 = 2¾ × 1⅜" and Avery 12608 = 6¼ × 3⅛".

### 5.3 Anatomy — verified

**Hole and reinforcement.** Sources disagree slightly, and the disagreement is real rather than an error:

| Spec | Hole diameter | Source |
|---|---|---|
| Uline, all sizes #1–#8 | **¼″** reinforced *paper* eyelet | Uline product pages |
| MACO #1 | **¼″**, "fiber patch reinforced" | maco.com |
| Global Industrial #7 | **3/16″** | globalindustrial.com |
| Uline 2-part inspection tag | **7/32″** | uline.com S-7222PS |
| AMS Printing | **3/16″ hole, fiber patch 9/16″ overall** | amsprinting.com |
| St. Louis Tag | **3/16″** standard, **3/8″** for padlocks/cable ties | stlouistag.com |

**Working range: hole 3/16″–¼″; fibre patch ≈ 9/16″ outside diameter — the patch is roughly 3× the hole.**

**The default reinforcement is a fibre patch, not metal.** Kenmore lists "Fiber-Reinforced Eyelet (standard)" with "Fiber w/Metal" as a +50% upgrade; St. Louis Tag adds "Double Reinforced" (fibre backing plus metal eyelet). Fibre patches are small circular paper discs, brown or white. **If you draw a chrome grommet by default, you are drawing the expensive variant.**

**Corners.** The chamfer is cut at **45°**, the trade calls them "luggage, angled, or shoulder corners," and this is "the traditional swing tag silhouette… used for over a century." Crucially: on manila shipping tags the standard die is **"2 Clipped Corners & 2 Square corners"** — **only the two corners at the eyelet end are cut.** Rounded alternatives exist at 2 mm or 7 mm radius. Square is the no-cost default. All die-cut.

**String and wire.** Both are 12″:
- **Wire:** 12″ of **26-gauge galvanised annealed steel**. Kenmore supplies the detail that actually matters visually: *"a 12″ twisted wire leaves two strands about **5½″** from edge of tag."*
- **String:** 12″ **100% cotton**, tied through the eyelet. MACO specifies *"12″ string (6″ double strand)"* — **the string is doubled, so the visible drop is half its length.**

**Stock, restated with the trade equivalence:** Uline states on every SKU that **"13 point stock = 175 lb card stock"** and **"Not acid free."** A point is exactly 1/1000″, so 13 pt = 0.013″. 15 pt appears only at #12.

**Manila the material.** Originally recycled **abacá** (Manila hemp) rope fibre — patented as paper by Mark Hollingsworth and sons in **1843** — later wood pulp. Now "semi-bleached wood fibers," **buff-coloured**, with fibres "usually visible to the naked eye," and "just as strong as kraft paper but has better printing qualities." Against kraft: kraft is "coarse, deep brown" from long softwood fibres; manila is "light yellow-brown, often called buff" and "typically smoother, which makes it better for printing and writing."

**Colour value — use with care.** There is **no authoritative Pantone or paper-industry definition of "manila."** The only value found with a fetched source tying it explicitly to manila paper is **buff `#F0DC82`** — and that source is a colour-naming site, not a materials spec. Other circulating values (Pantone 13-1024 TCX, `#EBC396`, `#D5B59C`, `#F1D592`) are colour-catalogue entries. A real scanned tag is duller and greyer than any of them. **Treat any single hex value as approximate.**

### 5.4 The typographic grammar of a real tag

The best-documented real specimen is a **Uline 2-part inspection tag, "Rejected," #5 size**: the word **"Rejected" in red**, **consecutive numbering 000–499**, three layers (paper / carbon / coloured cardstock), 7/32″ reinforced hole, 12″ cotton string.

**That is the entire system: one large word in a single spot colour, plus a machine-set serial, plus a carbon duplicate.**

And there is an honest economic reason for it. Uline's custom-print options: ink in black, red, blue or green (PMS +$50), **plate charge $25 per side and $25 per ink colour**. A second colour meant a second plate. **Tag typography is monochrome by default because colour cost money**; where a colour appears it is one word, and that word is a status. Put this in the rulebook as the *why*, not just the *what*.

**Serial numbers.** Consecutive numbering came from a **numbering machine** set into the letterpress forme — printers called them "numbering blocks" or "clocks" — where "the impression… pushes down a plunger which forces numbered wheels to rotate." The mechanism has a fixed number of digit wheels, which is exactly why serials are **zero-padded and fixed-width** ("000-499"). Variable-width serials are inauthentic.

**Typefaces of industrial ephemera** (all verified):

| Typeface | Origin | Note |
|---|---|---|
| **Franklin Gothic** | Benton, ATF, 1902 | "Gothic" was "a contemporary term meaning sans-serif"; "particularly suitable for display and **trade use**" |
| **News Gothic** | Benton, ATF, 1908 | Lighter companion; condensed cuts for headlines |
| **Copperplate Gothic** | Frederic W. Goudy, ATF, 1901 | **Capitals only.** Tiny wedge serifs that "emphasize the blunt terminus" of strokes. Used on business cards and etched on the doors of law offices and banks |
| **DIN 1451** | Prussian State Railways *Musterzeichnung IV 44*, 1905; DIN sheet 1931; released 1936 | Created as "a standardized lettering style for use on all of its rolling stock." Widths: **Mittelschrift**, **Engschrift**, **Breitschrift**. Drawn on "a coarse grid… executed with compass and rulers" |

**DIN 1451 is the single most on-point historical reference for a shipping idiom** — it is literally the lettering standard invented to mark freight. And note the delicious coincidence with §2: **Franklin Gothic, MoMA's own face, is on this list as a trade type.** MoMA's institutional typeface and the shipping-tag vernacular share an origin in American jobbing printing.

**The luggage tag proper.** The first **separable coupon ticket was patented by John Michael Lyons of Moncton, New Brunswick, on 5 June 1882.** It carried "**the issuing station, the destination, and a consecutive number for reference**"; the lower half went to the passenger, and "the upper portion—equipped with a hole—was attached to baggage using a brass sleeve and strap." The **Warsaw Convention of 1929** formalised baggage checks in aviation. Modern IATA tags are thermal adhesive paper with a ten-digit "license plate" number.

**Note the structural rhyme:** the 1882 two-part perforated stub with a matching serial and the 2-part carbon inspection tag are the same mechanism — **a receipt split in two, bound by a number.**

### 5.5 The registrar's tag — the best-sourced material, and the most transferable

**Why the tag exists** (Collections Trust, *Labelling and marking booklet*):

> "Every item in a museum collection must carry its identity number at all times… If this bond between the object and its documentation is broken, the consequences may be serious… At worst, the object will lose its provenance and other associated information for all time."

Four governing criteria: **Secure**, **Reversible**, **Safe for the object**, and the one a designer should steal:

> "**Discreet but visible** – The recommended methods should not spoil the appearance of the object, nor obscure important detail. However, the number should be visible enough to reduce the need to handle the object."

**The tie-on label technique**, verbatim: "white acid free paper or card labels or **Tyvek** tags with tape or string"; write the number "using a suitable **drawing ink and drawing pen**"; tie "using a **reef knot**." The listed cons are wonderfully unromantic: "Easy to remove and lose. / Paper labels may fall apart in a flood. / Cotton string may wick oil from the object… / **Paper and cotton labels are an insect food source.**"

**US federal standard — NPS Museum Handbook Part II, Appendix J.** Numbers must be "legible and easily found… durable but not damaging… **unobtrusive (not directly visible when the object is on display)**… reversible."

And the single most useful rule in this entire document for UI work:

> "It's much easier to find catalog numbers if you **place them in the same position on similar objects**. For example, number framed images on the reverse lower right corner."

That is a positional-consistency rule, and it is exactly what a design system needs: *the identifier always lives in the same corner.*

NPS on tags specifically: "**Use an acid-free, cotton tag with cotton string, and place it in a visible location. Don't use metal-rimmed tags. Don't attach tags with tape or glue.**" Prohibited: nail-on tags, tags attached with wire, staples, paper clips, and anything permanent — "etching, scribing, imprinting, stamping, engraving, or scratching." And: "Some old numbers and tags may be historically important and shouldn't be removed."

**Number formatting — Collections Trust, *Numbering* (2024).** Four explicit prohibitions, verbatim, all directly portable to a UI:

- "Do not abbreviate the year to just two digits… eg does '64.68' mean 1964 or 1968?"
- "Do not place the year element last as this will cause a problem for computerised sorting"
- "Do not use the entry number as an accession number"
- "**Do not preface the object number with a '0' eg use 2024.5 instead of 2024.05.**"

Note the direct tension with §4.5: **MoMA places the year last** (`472.1941`), which Collections Trust explicitly advises against for sortability. Both are real; MoMA's convention predates computerised sorting. Worth knowing before copying either.

**A finding worth a rule of its own.** The four real accession numbers collected across this research follow **four different conventions**:

```
MoMA    67.1943.a-rrr
MoMA    2517.2008
LACMA   M.63.14
Walker  LIB2000.486.1-.96
```

**Real accession numbers are institutionally idiosyncratic — and that is precisely what makes them read as authentic rather than decorative.** A UI that invents one clean uniform format will look designed; real ones look inherited.

### 5.6 The tag as an art idiom — including two corrections to the brief

**Correction 1 — Ed Ruscha.** No Ruscha work, exhibition, or catalogue entry built on the tag idiom could be found. MoMA, Whitney, Tate, Getty, LACMA, NGA, Gagosian and edruscha.com were all searched. **UNVERIFIED — do not assert one.**

What *is* verifiable is better anyway: Tate on Ruscha's "use of the imagery and techniques seen in **commercial art** such as advertising," his photographs as "merely a collection of facts" and his books as "like '**a collection of readymades**.'" Getty on his "keen interest in the **vernacular**." And *Actual Size* (1962, LACMA M.63.14) — a Spam can's *label* enlarged to fill the picture. **Cite Ruscha for the commercial-print register — paste-up, trade typography, the label as the entire image — not for tags.**

**Correction 2 — fashion.** **Comme des Garçons: UNVERIFIED**, no brand, museum or design-press source documents a shipping-tag identity. **Visvim: contradicted by the brand's own page**, which discusses its seasonal *Dissertation* publication and says nothing about hangtags. **Do not attribute a tag idiom to either.**

The one strong fashion case is **Maison Martin Margiela**, per MoMu Antwerp: the labels are "**empty cotton rectangles that are sewn in by hand. The four white stitches visible on the outside of the garments have become a well-recognized signature.**" Conceptually this is the closest garment analogue to a registrar's tag — **an anonymous, uninscribed label whose visible attachment is itself the mark.**

**Duchamp — the readymade *is* a caption.** Tate: "He CHOSE it. He took an ordinary article of life, and placed it so that its useful significance disappeared **under the new title and point of view**" — a shift "from artist-as-maker to **artist-as-chooser**." This is the theoretical licence for the whole idiom: *the tag is the title, and the title is the work.*

MoMA's *Box in a Valise*, 1935–41, object number **67.1943.a-rrr**, medium "Leather valise containing miniature replicas, photographs, color reproductions… and one 'original' drawing." MoMA's gallery label: "Duchamp assembled twenty-four deluxe boxes, known as Series A… Each box was **signed, numbered**, and housed in a leather suitcase." **Duchamp editioned his own retrospective the way a registrar accessions a collection.**

**Fluxus — the strongest anchor.** The medium line itself names the label:

> **George Maciunas, *Burglary Flux Kit*, 1971.** Medium: **"Plastic box with offset label, containing 23 keys."** Object number 2517.2008.

"Plastic box with offset label" is a museum-catalogued, five-word definition of the label-as-object. MoMA notes Maciunas "was **trained as a graphic designer**," that Fluxus Editions were "affordable items made in multiples," that he "often designed and assembled the projects himself, **unifying their appearance**," and that many were "inventively constructed for mailing." MoMA's *Charting Fluxus* covers Fluxshop stationery, a numbered distribution list, a pricelist, "Fluxus News Policy Letter No. 6," index-card notes and a yearbox prospectus — **an entire practice built from office-clerical formats.**

Note the formal rhyme: the *Boîte-en-valise* and the Fluxkit are both **a case full of labelled compartments**.

*(Fluxus rubber-stamping: **UNVERIFIED** — no museum source. The verified vernacular is offset lithography plus typewriter/clerical formats plus printed labels.)*

**Mark Dion, *Tate Thames Dig*, 1999** (T07669) — a double-sided mahogany "cabinet of curiosities," objects "organised **loosely according to type**, allowing antiques to sit alongside contemporary objects, lost treasures next to ephemera or junk," in categories ceramic / glass / bone / leather / shells / organic / plastic / metal. Dion uses the wunderkammer "to make the viewer **question why the modern museum is organised in the manner that it is**." Related Tate works are titled in a registrar's grammar — a person, a comma, a department: *Mrs. Herbert Fowler, Anthropology*; *Miss Mary Buckmore, Paleontology*.

### 5.7 The design writing that governs borrowing this idiom

This matters because a tag aesthetic is very easy to do badly, and there is a canonical warning.

**Tibor Kalman and Karrie Jacobs, "We're Here to Be Bad," *Print*, Jan/Feb 1990** — the source of the line, corroborated by two independent secondary fetches:

> **"Vernacular design is visual slang."** — and, more fully, "it's design that's so familiar that we don't really see it."

*(Note the correction: the vernacular essay is "We're Here to Be Bad," **not** "Good History/Bad History.")*

**Kalman, J. Abbott Miller and Karrie Jacobs, "Good History/Bad History," *Print*, Mar/Apr 1991** — full text fetched. The load-bearing quotes:

> "Graphic design isn't so rarefied or so special. It isn't a profession, it's a medium."

> "Design history creates boundaries: On this side is high design; on that side is low design… **The vernacular, the eccentric, the marginal, and the minority have been filtered out of our collective memory.**"

> "The key word in bad design history is **de-contextualization**."

> "**There's an important difference between making an allusion and doing a knockoff.**"

> "What we're arguing against is design that cashes in on history."

**That last set is the rule for any tag idiom: borrow the *logic* of the form — why a docket is laid out as it is — not its surface.**

**The counter-arguments a serious rulebook should answer:**

- **Ellen Lupton, "High and low (a strange case of us and them?)," *Eye* 7, Summer 1992** — designers wrongly position themselves *above* vernacular culture, treating it as exotic raw material. Calls for "an analysis from within culture, rather than a critique from above," and notes "what is high in one setting is low in another." On *Learning from Las Vegas*: it "views its subject like an **ethnographic specimen**."
- **Javier Syquia, "A Rejection of the Term 'Vernacular'," *Futuress*, 2021** — "*Verna*, the Latin root of *vernāculus*, is defined as 'slave born in the household.'"
- **Barbara Glauber (ed.), *Lift and separate: graphic design and the quote vernacular unquote*** (Herb Lubalin Study Center, 1993) — the sarcasm is in the catalogued title.

**The architectural parallel.** Venturi, Scott Brown and Izenour, *Learning from Las Vegas* (MIT Press, 1972; revised 1977), p. 3:

> "Learning from the existing landscape is a way of being revolutionary for an architect… **to question how we look at things**."

The best fact about that book for a rulebook about humble form: the authors revised it because the original was **"too monumental for a text that praised the ugly and ordinary over the heroic and monumental."**

*(**UNVERIFIED:** "Main Street is almost all right" was **not** found in *Learning from Las Vegas*; it is usually attributed to *Complexity and Contradiction in Architecture*, 1966. Do not cite it to LFLV.)*

**And the MoMA connection.** **Bernard Rudofsky, *Architecture Without Architects: A Short Introduction to Non-Pedigreed Architecture*, MoMA, 11 Nov 1964 – 18 Feb 1965.** From MoMA's own press release: "His interest in what he calls **non-pedigreed architecture**…" and "…recording and photographing of **anonymous architecture** was, and still is, looked upon with suspicion."

The same release notes Rudofsky had already curated a MoMA show called **"Vernacular Graphic Arts of Japan,"** describing it as "an art virtually ignored by art historians and artists alike." (Year not given — **UNVERIFIED**.)

**So MoMA itself has a documented institutional interest in the anonymous and the non-pedigreed** — which is the closest legitimate bridge between §5 and §§1–4. It is a curatorial interest, not a house style.

**David Jury, *Graphic Design Before Graphic Designers: The Printer as Designer and Craftsman 1700–1914*** (Thames & Hudson, 2012) is arguably the best single citation for the whole idiom:

> "While early pioneers focused on books, others began using their presses for more humble uses… This so-called **'jobbing' work grew rapidly in importance, yet has been overlooked** in histories of both print and graphic design."

### 5.8 What remains UNVERIFIED in §5

Ranked by how much a fabrication would hurt:

1. **Distance from the top edge to the hole centre** on a manila shipping tag — not published by any supplier or trade printer. **[DERIVED floor only]** with a 9/16″ patch and a 3/16″–¼″ hole, the patch centre must sit **≥ 5/16″ (0.3125″)** from the top edge for the patch to fit. That is geometry, not a spec.
2. **The clipped-corner cut depth.** The 45° angle is verified; the leg length is not.
3. **Pre-printed `TO:` / `FROM:` ruled fields as standard stock** — all stock manila tags from Uline, Avery, MACO and Universal Tag are **blank**. Printed field layouts exist only as custom work. **Do not claim TO/FROM was standard pre-printed matter.**
4. **MIL-STD-129 character heights and specified typeface** — all primary PDFs returned 403/404.
5. **IATA bag tag physical dimensions**; and its barcode symbology is **contradicted** between sources (Interleaved 2 of 5 vs Code 128). Assert neither.
6. **A single authoritative colour value for manila** — no industry standard exists.
7. **The "archival tag look" as a documented contemporary exhibition or web idiom.** Dezeen, It's Nice That, Design Week, Creative Review, Eye and Wallpaper were all searched; **no article documents it.** If the rulebook wants this claim, it currently has **no citation** — present it as a designer's observation, not a fact.
8. **Fluxus rubber-stamping**; **Comme des Garçons** and **Visvim** tag identities; **any Ed Ruscha tag work**.

**Overarching caution.** Everything in §5 is about a commodity product and a set of art-historical precedents. **None of it is sourced from MoMA, and I found no evidence that MoMA uses a luggage-tag motif in its own identity.** §5 and §§1–4 are separate research streams. The only honest bridge is Rudofsky (§5.7) — MoMA has curated the vernacular, not adopted it.

---

## 6. Swiss/International Typographic Style vs. what MoMA actually does

The short answer: **MoMA is not Swiss. It is American, and it is a frame rather than an authored composition.** MoMA *canonised* Swiss design as a curatorial subject while never adopting it as its own voice.

### The evidence, point by point

**1. The typeface lineage is the opposite lineage.**

Swiss practice runs on **Akzidenz-Grotesk, Helvetica and Univers** — European neo-grotesques, geometrically regularised, closed apertures, designed for neutrality.

MoMA runs on **Franklin Gothic** and its descendants. Per Wikipedia, Franklin Gothic descends from "nineteenth-century American foundry models consolidated into ATF in 1892," has a **double-storey `a` and `g`** and a centre-curling `Q` tail — features "uncommon in German-influenced sans-serif designs" — and was cut for "display and trade use such as headlines rather than for extended text."

Schwartz makes the relationship explicit and, in doing so, marks the distance: he described MoMA Sans as doing for Franklin what "the evolution from Akzidenz-Grotesk to Neue Haas Grotesk" did for the Swiss line. That is an analogy of *method*, and an admission of *different stock*. MoMA deliberately refused to become Helvetica.

Decisively, **MoMA's own graphic design department names the anti-Swiss letterform as its identifying mark.** From the 2010 archives post, telling readers how to recognise MoMA's type in the wild:

> "Look for the 'two story' lowercase 'g' with a unique 'ear' to be certain!"

Helvetica, Univers and Akzidenz-Grotesk all have a **single-storey** `g`. MoMA's stated tell is precisely the feature that a Swiss neo-grotesque does not have. This is not an inference — it is the museum's own identification criterion.

**So:** a system that reaches for Helvetica/Inter/Univers to feel "MoMA" has the lineage exactly backwards. The correct move is an American grotesque with a double-storey `g`.

**2. The grid is not a field grid.**

Müller-Brockmann's method — first presented in 1961, published as *Grid Systems in Graphic Design* — is a **modular field grid**: the page is divided into a matrix of fields (the book covers systems "from 8 to 32 fields"), and every element, including images, is sized and placed by snapping to whole numbers of fields. The grid is the generative instrument. It is dimensioned to the type's leading, so text, image and margin all resolve to one modular unit.

MoMA's website has **no field grid at all**. There is no `grid-template-columns` in 876 KB of CSS. What exists is a set of **flex row divisions into 1–6 equal columns** with a fixed 24/32px gutter (§1.4), and separately a 4px spacing scale (§1.5). Columns and vertical spacing are **not tied to each other**, and neither is tied to the leading. There is no module.

That is the sharpest single distinction: **Swiss is a two-dimensional modular field; MoMA is a one-dimensional column split plus an independent spacing scale.**

**3. The ideological posture is different — and the difference is functional, not stylistic.**

Müller-Brockmann sought "an absolute and universal form of graphic expression through objective and impersonal presentation." Swiss designers positioned themselves as "objective conduits for spreading important information." The neutrality is a **claim about design itself** — a universal correct form, discovered rather than chosen.

MoMA's neutrality is narrower and more pragmatic. Schwartz:

> "if the typeface is catching your attention at all…in a museum of fine arts, then something is not right."

That is not a claim that the design is universal. It is a claim that the design is **subordinate to the art on the wall**. MoMA recedes because something else in the room is the content. Müller-Brockmann's poster *is* the content and its restraint is an assertion.

Practical consequence: Swiss restraint is *expressive* — the asymmetric composition, the dramatic scale jump, the diagonal, the single vast photograph, are all authored gestures. MoMA's restraint is *custodial*. It does not compose; it frames.

**4. MoMA breaks the Swiss rules where Swiss would not.**

- Swiss layout is characteristically **asymmetric** and compositionally authored. MoMA's site has **five `text-align` declarations total** and relies on default flush-left. It is not composing asymmetry; it is declining to compose.
- Swiss uses **photography as an objective symbol**, usually whole, at a considered scale. MoMA **crops editorially** — `object-position: center 20%` / `center 80%`, and Pentagram's brief explicitly calls for "dramatic cropping and juxtapositions of artwork." Cropping an image for rhetorical effect is a magazine move, not a Müller-Brockmann move.
- MoMA aligns its print system to **the building's façade signage** ("consistent vertical placement similar to the signage on the museum's façade"). The organising datum is **architectural and institutional**, not mathematical. A Swiss grid derives from the page; MoMA's derives from 53 Street.
- MoMA's identity strategy is **explicitly anti-systematic in its evolution** — "subtle 3% changes rather than radical redesign," "evolution, not revolution," continuity with a 1964 logotype across sixty years. Swiss modernism was a **break** with what preceded it. MoMA's system is fundamentally **conservative and accretive**: it has been redrawing the same 1902 typeface for ninety years.

**5. The decisive evidence: MoMA *collects* Swiss design. It does not *speak* it.**

Searching MoMA's own CC0 collection dataset — and note this is only a 57,760-row slice of the 160,699-work file, so these are **floors, not totals**:

| Search term | Works found | Example |
|---|---|---|
| Josef Müller-Brockmann | **22** | *Der Film* |
| Jan Tschichold | **895** | (the Jan Tschichold Collection) |
| Max Bill | **34** | *Electric Wall Plugs* |
| Massimo Vignelli | **21** | *Table Lamp* |
| Bauhaus | **71** | Herbert Bayer, floor plan for the exhibition *Bauhaus 1919–1928* |

(One false positive to flag honestly: a search for "Univers" returned 207 hits, but they are matches on the word *University* in architecture titles, not the typeface. Discarded.)

This is the cleanest possible statement of the relationship. **MoMA owns Müller-Brockmann. It hangs him on the wall. It does not design like him.** Swiss modernism is, to MoMA, an *object of study* — accessioned, numbered, credit-lined, and labelled in Franklin Gothic. The museum's own voice is the label, not the poster.

That is the entire distinction in one image: a Müller-Brockmann poster in a MoMA gallery has a MoMA wall label next to it, and the two are set in different typographic traditions on purpose. The Swiss object is the content; the American grotesque is the frame.

**6. Where they genuinely do agree.**

Don't overstate the gap. Both share: sans-serif only; flush left, ragged right; no decoration; generous white space; strict spacing discipline; content over embellishment; a closed set of ratios rather than arbitrary sizing. MoMA's 4px spacing scale and eight-ratio image set are systematic in a way Müller-Brockmann would recognise and approve of.

### Summary table

| | Swiss / ITS | MoMA |
|---|---|---|
| Typeface stock | Akzidenz-Grotesk, Helvetica, Univers (European neo-grotesque) | Franklin Gothic → MoMA Gothic → MoMA Sans (American grotesque, ATF 1902) |
| `g` and `a` | single-storey tendencies, closed apertures | **double-storey**, American |
| Grid | modular **field** grid, 8–32 fields, 2-D, tied to leading | **1–6 equal flex columns**, 1-D, independent 4px spacing scale |
| Grid origin | mathematical, derived from the page | institutional — aligned to façade signage |
| Composition | authored, asymmetric, dramatic scale contrast | non-compositional; flush-left by default |
| Images | objective, whole, considered scale | editorially **cropped** (`cover` + off-centre `object-position`) for promo; whole for artwork |
| Neutrality is… | a universal claim about design | deference to the art in the room |
| Change model | rupture with the past | 90 years of redrawing one typeface; "3% changes" |
| Colour | often bold, primary, compositional | achromatic chrome (204 : 3 declarations); colour lives in the art |

### The one-line version

> Swiss design uses a mathematical module to **compose** a page. MoMA uses an American jobbing typeface and a plain column split to **get out of the way of the object**. Both are disciplined; only one is trying to be beautiful on its own terms.
>
> Or, most compactly: **MoMA owns 22 Müller-Brockmanns. It labels them in Franklin Gothic.**

---

## Sources

Grouped by research stream. **"[measured]"** means I downloaded the file and computed the numbers myself; **"[proxy]"** means read via `r.jina.ai` because Cloudflare blocked direct access; **"[browser]"** means read from a live rendered page.

### §1 — moma.org production code and live measurement

- https://www.moma.org/ — homepage HTML, HTTP 200 **[measured]**
- https://www.moma.org/dist/main.da694f524e0c6879f84a.css — 593,325 b **[measured]**
- https://www.moma.org/dist/sol.7be4943c7e0064bb3dfa.css — 270,481 b **[measured]**
- https://www.moma.org/dist/commons.385caa24f52511533641.css — 6,400 b **[measured]**
- https://www.moma.org/dist/home-refresh.ffa3d4a180e4a03fedc2.css — 6,223 b **[measured]**
- https://www.moma.org — computed styles, typography tokens, class DSL, weights, colours, header scroll state machine, element geometry at 1440×900 **[browser]**
- https://store.moma.org/collections/new — product card fields, type, `text-transform`, weights **[browser]**; also **[proxy]**. `store.moma.org/products.json` → HTTP 403.

### §2 — Identity and typography history

- https://linedandunlined.com/archive/designing-a-new-moma/
- https://type.today/en/journal/moma_sans
- https://www.pentagram.com/work/moma/story
- https://bpando.org/2020/01/02/moma-by-order/
- https://en.wikipedia.org/wiki/Franklin_Gothic
- https://www.moma.org/explore/inside_out/2010/02/26/from-the-archives-03-a-brief-homage-to-franklin-gothic/ — MoMA Dept. of Graphic Design **[proxy]**
- https://www.moma.org/explore/inside_out/2013/04/08/one-typeface-fits-all-at-moma/ — MoMA Design Studio, the two-tier governance rule **[proxy]**
- https://fontsinuse.com/typefaces/85549/moma-sans
- Search-result context only (page not fetched): Wallpaper* on Chermayeff — https://www.wallpaper.com/design-interiors/corporate-design-branding/moma-logo-design · Graphéine — https://grapheine.com/en/magazine/who-is-the-popa-of-moma-logo-thoughts-on-contemporary-branding/

### §3 — Publications and catalogues (primary PDF scans)

Full catalogues, read and rendered:
- https://www.moma.org/documents/moma_catalogue_1784_300061872.pdf — *Machine Art*, 1934 (133 pp.)
- https://www.moma.org/documents/moma_catalogue_2748_300086869.pdf — *Cubism and Abstract Art*, 1936, incl. dust jacket (259 pp.)
- https://www.moma.org/documents/moma_catalogue_1803_300190105.pdf — *Organic Design in Home Furnishings*, 1941
- https://www.moma.org/documents/moma_catalogue_1712_300085243.pdf — *Charles Eames: Furniture from the Design Collection*, 1973
- https://assets.moma.org/documents/moma_catalogue_1717_300185061.pdf — *Good Design*, 1953
- https://assets.moma.org/documents/moma_catalogue_1718_300062144.pdf — *Good Design, 5th Anniversary*, 1955
- https://www.moma.org/documents/moma_catalogue_1783_300062429.pdf — *Italy: The New Domestic Landscape*, 1972
- https://assets.moma.org/documents/moma_catalogue_471_300063148.pdf — *Annette Messager*, 1995
- *Good Design* 1950 — MoMA exhibition-catalogue PDF endpoint under `/d/c/exhibition_catalogues/`

Press releases (`moma.org/momaorg/shared/pdfs/docs/press_archives/…` and `moma.org/docs/press_archives/…`):
- 162/…/MOMA_1933-34_0029_1934-03-01.pdf · 164/…/MOMA_1933-34_0031_1934-03-03.pdf · 173/…/MOMA_1933-34_0040_1934-04-23.pdf — Machine Art
- 1441/…/MOMA_1950_0050.pdf · 1488/…/MOMA_1951_0006.pdf · 1664/…/MOMA_1952_0086.pdf — Good Design
- 4800/…/MOMA_1972_0029_26.pdf — Italy: The New Domestic Landscape
- 4240/…/MOMA_1969_Jan-June_0073_49.pdf — Kathleen Haven · 4259/…/MOMA_1969_Jan-June_0092.pdf — Monroe Wheeler
- 3336/…/MOMA_1964_0123_1964-11.pdf — Rudofsky, *Architecture Without Architects*
- https://assets.moma.org/documents/moma_press-release_387178.pdf — *What Was Good Design?*, 2009

MoMA institutional documents:
- https://www.moma.org/momaorg/shared/pdfs/moma_learning/docs/design_full.pdf — *Made for Living* educator guide (the caption stack)
- https://www.moma.org/momaorg/shared/pdfs/docs/archives/InventingAbstraction_GLowry_359_363.pdf — Lowry, "Abstraction in 1936: Barr's Diagrams"
- https://press.moma.org/wp-content/uploads/2018/12/VGD_Section-Texts.pdf · .../VGD_Checklist-FINAL-2-22-19.pdf
- *Items* catalogue preview PDF (colophon: Clanada, Circular Pro + Burgess, Munken Polar Rough)
- MoMA Library cataloguing instructions (MoMA exhibition number, MARC 024)
- https://www.moma.org/calendar/exhibitions/1784 — Machine Art exhibition page **[proxy]**

### §4 — Label standard

- https://github.com/MuseumofModernArt/collection — MoMA collection dataset, CC0 1.0, 160,699 works
- https://media.githubusercontent.com/media/MuseumofModernArt/collection/main/Artworks.csv — **57,760 rows parsed [measured]**
- https://www.moma.org/collection/works/79802 — van Gogh, *The Starry Night* **[proxy]**
- https://www.moma.org/collection/works/2 — Otto Wagner, Ferdinandsbrücke Project **[proxy]**
- https://www.moma.org/momaorg/shared/pdfs/docs/about/Collections-Management-Policy-2020-04-20.pdf — MoMA Collections Management Policy **[proxy]**

### §5 — Tag as object and idiom

Physical specs: kenmorelabel.com/manila-tags-13-or-10-point/ · kenmorelabel.com/12-26-gauge-galvanized-tag-wires-standard/ · uline.com S-1474PLAIN, S-930PW, S-1151PLAIN, S-931PS, S-1152PS, S-2965PLAIN, S-932PW, S-15868PW, S-7222PS · uline.com/CustomProduct/CustomStaticTagManila.htm · maco.com (#1) · globalindustrial.com (#7) · avery.com/products/tags/12601, /12608 · amsprinting.com/products/custom-printed-manila-tags/manila-tag · stlouistag.com/reinforcements.html · handytags.co.uk/pages/cornering · dutchlabelshop.com/en_us/faq/hang-tag-design-best-practices/ · uprinting.com/print-templates/hang-tags/2x3.5/1212/ · formaxprinting.com/blog/printing-lingo-what-does-caliper-mean-in-reference-to-paper

Material/colour: en.wikipedia.org/wiki/Manila_paper · limehouseboardmills.com/manila-paper-vs-kraft-paper-whats-the-difference/ · color-name.com/buff.color

Typography/history: en.wikipedia.org/wiki/DIN_1451, /Franklin_Gothic, /News_Gothic, /Copperplate_Gothic, /Bag_tag, /MIL-STD-129 · britishletterpress.co.uk/letterpress-guides/printing/numbering/ · camcode.com/blog/what-is-mil-std-129/ · productiontype.com/article/jan-tschichold-what-is-new-typography-and-what-does-it-want

Art/museum: tate.org.uk/art/art-terms/r/readymade · tate.org.uk/art/artists/edward-ruscha-1882/ed-ruscha-and-art-everyday · tate.org.uk/art/artworks/dion-tate-thames-dig-t07669/digging-thames-mark-dion · moma.org/collection/works/80890 (*Box in a Valise*), /127929 (*Burglary Flux Kit*) · moma.org/interactives/exhibitions/2011/fluxus_editions/ · moma.org/interactives/exhibitions/2013/charting_fluxus/ · sfmoma.org/artwork/81.40.A-QQQ/ · walkerart.org/collections/artwork/fluxus-1/ · collections.lacma.org/object/22626 (*Actual Size*) · getty.edu/art/exhibitions/focus_ruscha/index.html · momu.be/en/collection-stories/martin-margiela · visvim.tv/dissertation/philosophy/design.html

Registrar/conservation: collectionstrust.org.uk/wp-content/uploads/2016/11/labelling-and-marking-booklet-2020.pdf · collectionstrust.org.uk/resource/numbering/ · nps.gov/subjects/museums/upload/MHII_AppJ_Marking.pdf, /MHII_Ch3_Cataloging.pdf · canada.ca CCI Note 13/8

Design writing: jarrettfuller.com/…/kalman_good-history-bad-history.pdf · designobserver.com/exposure-andyaes-food-mart-by-tibor-kalman-and-mco/ · lab-zine.com/blog/2007/jan/25/tibor-vernacular-design/ · eyemagazine.com/feature/article/high-and-low-a-strange-case-of-us-and-them · futuress.org/stories/a-rejection-of-the-term-vernacular/ · searchworks.stanford.edu/view/3024157 · archive.org/details/encyclopediaofep0000rick, /trent_0116404139556, /newtypographyhan0000tsch, /americanwoodtype0000kell · rbm.acrl.org/index.php/rbm/article/view/294 · open-access.bcu.ac.uk/16268/1/01_Osbaldestin.pdf · thamesandhudson.com.au/products/graphic-design-before-graphic-designers · en.wikipedia.org/wiki/Learning_from_Las_Vegas · letterformarchive.org/collections/ · bodleian.ox.ac.uk/…/johnson/about · collections.reading.ac.uk/…/centre-for-ephemera-studies/ · sbf.org.uk/library/ · woodtype.org · cooperhewitt.org/collections/library/

### §6 — Swiss comparison

- https://en.wikipedia.org/wiki/International_Typographic_Style
- https://en.wikipedia.org/wiki/Franklin_Gothic
- https://www.typotheque.com/books/grid-systems-in-graphic-design — Müller-Brockmann, *Grid Systems*, 8–32 fields
- MoMA CC0 dataset **[measured]** — Müller-Brockmann ×22, Tschichold ×895, Max Bill ×34, Vignelli ×21, Bauhaus ×71 in a 57,760-row slice

### Blocked (403/410, claims not verified)

`moma.org/calendar/exhibitions/{id}` and `moma.org/collection/works/{id}` HTML (both curl and WebFetch) · store.moma.org direct and `/products.json` · caareviews.org/reviews/1933 (would have settled Machine Art catalogue details) · scribd "Captions — MoMA Style Guide" (HTTP 410 Gone) · dla.mil / nib.org / gsa.gov MIL-STD-129 primaries · encycolorpedia.com · vintagefashionguild.org · sova.si.edu (Warshaw Collection) · xpresstags.com · cwcglobal.com
