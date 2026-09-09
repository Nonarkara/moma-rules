# Why MoMA — the lineage behind the name

**Purpose.** This repo borrows MoMA's name for its rules, and [moma-study.md](moma-study.md)
measures what moma.org's own production CSS actually does. This page is the
missing layer between those two: why "aligned, no loose edges" became a
design religion in the first place, who built it, and how it ended up
underwriting a museum's website. General art-history claims below are stated
as history, not measurement — where a number is load-bearing, it is sourced;
where it is scene-setting, it is not dressed up as data.

The short version: one geometric idea (De Stijl) got turned into a teachable
method (the Bauhaus), got exported to American practice by its own founders,
got reduced to ten industrial principles by Rams, and got endowed with
institutional authority by the one museum that collected, taught, and later
built its own website out of all of the above. Four names, one throughline,
sixty years apart at the ends.

---

## 1. Piet Mondrian — the grid before there was a grid (c. 1917–1944)

Mondrian's mature paintings — black lines, primary-colour rectangles, white
ground — are not decoration with a geometric flavour. They are an argument:
that a picture built from a strict horizontal/vertical structure and a closed
palette can carry as much feeling as a picture of a thing. He called the style
*Neo-Plasticism*, and co-founded the journal *De Stijl* (Dutch for "The
Style") in 1917 with Theo van Doesburg to make the argument in print as well
as on canvas.

The part of Mondrian that survives into this repo is not the red-yellow-blue
palette — it is the **closed set**. A Mondrian canvas uses a small, fixed
vocabulary of line weights and interval widths, repeated and recombined,
never invented fresh per-canvas. That is Law II in embryo: *alignment
requires a closed scale, not a larger one.* Mondrian never wrote a spec for
it — he just refused, canvas after canvas, to add a sixteenth value.

## 2. De Stijl → the Bauhaus — turning a painting style into a taught method (1919–1933)

De Stijl was a handful of Dutch artists and one architect (Gerrit Rietveld,
whose 1917 Red and Blue Chair is Mondrian's grid built as furniture). It
never became an institution. The **Bauhaus**, founded by **Walter Gropius**
in Weimar in 1919, is where the same instinct became a curriculum.

Gropius's founding manifesto called for unifying art, craft, and industry —
no more precious "fine art" divorced from the object a person actually uses.
The school's preliminary course (taught early on by Johannes Itten, later by
Josef Albers and László Moholy-Nagy) drilled students in exactly the
vocabulary Mondrian had painted with: primary geometry, primary colour,
material honesty, and — critically — **reproducibility**. A Bauhaus design
was meant to be manufacturable at scale, which meant it had to be
*specifiable*: dimensions, materials, and proportions a factory could follow
without the original designer in the room.

That requirement — a design has to survive being executed by someone who
didn't make the first one — is the direct ancestor of this repo's whole
premise. A rule that only the original author can apply by eye is not a
system; a rule a lint script can enforce is. The Bauhaus's move from
"an aesthetic" to "a specification" is Law X's "**a law without a check is a
wish**" playing out a century early, in wood and steel instead of CSS.

The Nazi government closed the Bauhaus in 1933. Its faculty scattered — many
of them to the United States, several of them into MoMA's own orbit within
the decade.

## 3. Le Corbusier — the module, the grid, and the number that has to reconcile (1920s–1950s)

Le Corbusier (Charles-Édouard Jeanneret) wasn't Bauhaus faculty, but he ran on
the same conviction from the other direction: architecture, and the objects
inside it, should be governed by a **modular, mathematically derived system**,
not picked by eye. His *Modulor* (published 1948, developed through the
1940s) is a proportioning system built from human body measurements and the
golden ratio, meant to give every dimension in a building — door height,
window width, room proportion — a reason to be the number it is, and to make
those numbers relate to each other by construction.

*Vers une architecture* (1923) states the underlying belief plainly: a house
is "a machine for living in," which is not a slogan about coldness, it's a
claim that a house should be **designed with the same rigor an engineer
applies to a machine** — every dimension answerable, nothing arbitrary.

This is Law IV and docs/grid.md, unmodified in spirit: **the page width is a
consequence, not an input.** `12 × 88 + 11 × 16 + 2 × 24 = 1280` is a Modulor
in miniature — four starting values, and everything else falls out of them
because they were chosen to reconcile, not because 1280 looked right on a
monitor.

## 4. Ludwig Mies van der Rohe — "less is more," and where the corners went (1920s–1960s)

Mies ran the Bauhaus as its third and final director (1930–1933), then
emigrated to Chicago and built the architecture most people picture when they
hear "modernist skyscraper" — the Seagram Building (1958, with Philip
Johnson), steel-and-glass towers with no ornament, no applied decoration, and
famously **no soft corners**. His two mottos, "less is more" and "God is in
the details," describe the same discipline from opposite ends: remove
everything that isn't structural, and then get obsessive about what's left.

Mies's buildings are square. Not "subtle" rounding at the corner — square,
because a rounded corner on a steel-and-glass tower is a corner apologizing
for being a corner, and Mies's buildings do not apologize. That is Law IX,
verbatim, sixty years before CSS had a `border-radius` property to leave at
zero: **corners are square. Not "subtle." Zero.**

## 5. Dieter Rams — the ten principles, and the reason there are ten of anything here (1955–1995)

Rams joined **Braun** in 1955 and became its chief design officer, shaping
three decades of radios, calculators, and shavers with a look so consistent
it reads as one designer's signature across a whole company's catalog. His
**Ten Principles of Good Design**, articulated across the 1970s–80s, are the
direct template this repo's structure is copying:

> Good design is innovative. Good design makes a product useful. Good design
> is aesthetic. Good design makes a product understandable. Good design is
> unobtrusive. Good design is honest. Good design is long-lasting. Good
> design is thorough down to the last detail. Good design is
> environmentally friendly. Good design is as little design as possible.

Two things about Rams matter specifically for this repo. First, he worked in
mass-produced consumer objects, not galleries — every principle had to survive
contact with a factory line and a retail shelf, the same "reproducibility"
constraint that mattered to Gropius. Second, and the reason LAWS.md exists in
this shape: **Rams counted.** Ten principles, not "a design philosophy." A
countable, named list is falsifiable in a way "good taste" is not — you can
check a product against ten items and say which ones it fails. LAWS.md is
Braun's ten principles, aimed at a screen instead of a shaver, with the one
addition Rams's era didn't have available: a script that checks them on every
commit (Law X's closing note — "the other nine are automated").

The Braun ET66 calculator and RT20 radio are Rams's most literal statements
of "one accent color, everything else achromatic" — the direct ancestor of
Law VIII's "the colour is supposed to be in the art, not the chrome."

## 6. The Museum of Modern Art — where the movement got collected, taught, and outlived its founders (1929–present)

MoMA opened in New York in 1929, a decade after the Bauhaus, founded by
Alfred H. Barr Jr. and a trio of patrons explicitly to give a home to work
the establishment art world wasn't yet showing — European modernism,
industrial design, architecture, photography, and film, treated as
co-equal collecting categories from the start rather than added later. Barr's
own diagram of modern art's lineage (drawn for the catalog of the 1936
exhibition *Cubism and Abstract Art*) is the historical spine this document
is retracing: it draws a direct line from Cubism and Neo-Plasticism through
the Bauhaus and De Stijl into "geometric abstract art" — Mondrian and Gropius
placed on the same chart, twenty years before either idea reached a
calculator or a museum website.

MoMA's **Department of Architecture and Design** (founded 1932, the first of
its kind at any museum) is the institutional proof that this lineage was
never treated as "fine art" separate from "design" — Mies, Le Corbusier, and
Rams-era Braun products all entered MoMA's permanent collection as objects
worth the same curatorial rigor as a painting. Mies's Barcelona Chair and a
Braun SK4 radio sit in the same collecting logic as a Mondrian canvas,
because MoMA's founding premise was that they are the same argument in
different materials.

That is the reason "MoMA rules" is a real phrase and not just a Dr Non
coinage — an institution spent a century collecting, exhibiting, and
teaching the specific claim that **alignment, a closed vocabulary, and the
absence of arbitrary ornament are not a style choice, they are a form of
honesty.** [moma-study.md](moma-study.md) found that same claim, unclaimed
and undocumented, sitting in moma.org's own production CSS: 876KB of
stylesheet, three chromatic values, zero `text-transform`, a spacing scale
that is a strict multiple of 4px, hairlines exactly `.1rem`. Nobody at MoMA
wrote that down as a rulebook — it's there because the institution's century
of curatorial taste calcified into house style, the same way Braun's taste
calcified into Rams's ten principles.

This repo's bet is that the calcified taste can be extracted back out as an
actual rulebook — arithmetic and CI checks, not folklore — which is the
whole difference [README.md](../README.md) opens with: *"Three times these
rules were written down as prose. Three times the pages drifted back."*
Mondrian, Gropius, Le Corbusier, Mies, and Rams all had the same problem in
their own media — a good eye does not scale past one person, and a
one-person practice does not survive its founder. Bauhaus reproducibility,
Corbusier's Modulor, and Rams's ten counted principles were all attempts to
solve it before software existed. `lint/moma-lint.mjs` and
`audit/near-miss.browser.js` are the same attempt, aimed at a medium where
the fix is finally cheap: a failing build.

---

## The throughline, compressed

| Figure | Institution / era | What they proved | Law it became |
|---|---|---|---|
| Mondrian | De Stijl, 1917–44 | A closed vocabulary, repeated, reads as more coherent than an open one | II · The Scale |
| Gropius | Bauhaus, 1919–33 | A design has to survive being executed by someone else, from a spec | X · a law without a check is a wish |
| Le Corbusier | Modulor, 1920s–50s | Every dimension should be derivable from a few starting values, not chosen by eye | IV · The Grid Fills / docs/grid.md |
| Mies | Chicago, 1930s–60s | Ornament-free means corners stay square — not "subtle," zero | IX · Zero Radius |
| Rams | Braun, 1955–95 | A countable, falsifiable list beats "good taste" as a design philosophy | LAWS.md's whole structure |
| MoMA | 1929–present | A century of curatorial rigor, collecting all of the above as one continuous argument, calcifies into an institution's own uncodified house style | the repo's name, and moma-study.md's evidence that the style was real all along |

**Further reading inside this repo:** [moma-study.md](moma-study.md) (the
primary CSS/DOM research) and [moma-vs-us.md](moma-vs-us.md) (where our laws
confirm or deliberately diverge from what was measured).
