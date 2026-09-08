# The luggage tag

*A style that fits the laws — one of several. Included because Dr Non named it,
and because it is a good test: a tag is a strong graphic idiom, and if the laws
survive it, they will survive most things.*

## Why a tag obeys the laws naturally

A shipping tag is not decoration. It is a **label attached to an object** — the
same job a museum wall label does, and the same job a data cell does. It is
already:

- **fixed in proportion** — a tag is a known rectangle, not a fluid box
- **hierarchical by convention** — one big identifier, then small structured
  fields, always in the same order
- **framed by a hairline** — the tag's edge is its own rule
- **punctuated by exactly one non-typographic element** — the hole

That last one is the discipline the aesthetic buys you: one hole, one string.
The moment there are two ornaments, it stops being a tag and becomes a sticker.

## The geometry, on our grid

Everything below is a span width or a scale value. Nothing is drawn by eye.

```
width      296px   = span(3), a quarter of the content width
height     160px   = the top of the spacing scale
ratio      1.85 : 1

hole       16px diameter, centre at x = 24, y = 80
chamfer    24px, on the two corners of the punch end only
punch zone 0 → 48    no type may enter
type block 48 → 272  = 224px wide
```

The chamfer is 24 because the hole centre is 24; the corner cut and the hole
share one datum, so the punched end reads as one decision instead of two.

Larger tags keep the punch zone constant and grow the type block, so a row of
mixed-width tags keeps its type on one line:

| tag | width | type block |
|---|---|---|
| span 2 | 192 | 120 |
| span 3 | 296 | 224 |
| span 4 | 400 | 328 |
| span 6 | 608 | 536 |

## The type on a tag

Borrowed directly from museum label practice: the fields are always the same,
always in the same order, and the reader learns the order once.

```
┌────────────────────────────────────┐
│ ○   BTC PERPETUAL          ← 32 display, the identifier
│     funding, annualised    ← 11 micro, what the number is
│     +5.04%                 ← 32 display mono, the datum
│     Binance · 8h · 2026-09-05
│                            ← 11 micro, source · method · as-of
└────────────────────────────────────┘
```

Rules specific to the tag:

1. **One datum per tag.** A tag with two numbers is a table with delusions.
2. **The identifier and the datum share a size.** They are the two things the
   reader came for. Everything else is 11px.
3. **The provenance line is mandatory** and is always last. A tag without a
   source is a sticker.
4. **Never centre anything.** Tags are ranged left from the type block origin
   (x=48). Centred type on a tag reads as a certificate, not a label.

## Stock, colour and texture

The manila association is doing real work — it says *ephemeral, functional,
attached to something else* — but it must survive the palette, which is
near-black. Two legal treatments:

| | surface | rule | type |
|---|---|---|---|
| **dark tag** (default) | `--bg-raised` | 1px `--line` | `--ink`, micro in `--muted` |
| **kraft tag** (accent, sparing) | `#c8b89a` at 6% over `--bg-raised` | 1px `--line` | unchanged |

No paper texture image, no drop shadow, no rotation. A tag rotated 3° to look
"pinned" is the exact amateur mark Law VII names: it creates edges that are
neither aligned nor clearly different.

The string is drawn or it is not drawn. If drawn: 1px, `--line`, one bezier from
the hole to the tag's top-left, no more than 24px of travel. It is never
animated.

## What the tag must not become

- a **badge** — badges are pills, and pills need radius, which is Law IX
- a **card with a hole** — if the content needs more than one datum plus
  provenance, it is a card, and it should be a card
- a **texture** — one or two tags on a screen. A wall of tags is a table that
  lost its nerve.

## Where it earns its place in this product

The tag is the right form for anything that is **a value attached to a source**:
a measured finding with its provenance, an archived item with its date, a
verdict with its evidence. It is the wrong form for anything comparative —
comparisons want a table, because a table aligns and tags do not compare.
