/**
 * THE SCALE — the single source of numeric truth.
 *
 * Every rule in this repo is derived from these numbers. Nothing in a
 * conforming page may use a spacing, type, or grid value that is not
 * listed here. This is the whole point: alignment is not a matter of
 * care, it is a matter of arithmetic. Values drawn from one closed set
 * align by construction; values invented per component cannot.
 */

/** Base unit. Every spacing value is a multiple of this. */
export const BASE = 4;

/**
 * Spacing scale — padding, margin, gap, and any offset.
 * Derived, not chosen: BASE × {0,1,2,3,4,5,6,8,10,12,16,20,24,30,40}.
 * 15 values. A page that needs a 16th does not need a 16th; it needs
 * to pick one of these.
 */
export const SPACE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160];

/**
 * Type scale — three sizes, as the canon has always said.
 * These are NOT on the 4-grid; type is a different axis and is set by
 * line-height, which IS on the grid (see LEADING).
 */
export const TYPE = { micro: 11, body: 14, display: 32 };

/**
 * Leading — line-heights, in px, all multiples of BASE so that stacked
 * text blocks land on the same baseline rhythm regardless of size.
 * micro 11/16, body 14/20, display 32/36.
 */
export const LEADING = { micro: 16, body: 20, display: 36 };

/**
 * THE GRID — 12 columns, derived so that every legal division is an integer.
 *
 *   12 columns x 88px      = 1056
 *   11 gutters x 16px      =  176
 *   content                = 1232
 *   + 2 margins x 24px     = 1280
 *
 * Every divisor of 12 (1,2,3,4,6,12) yields an integer span width, so a
 * half-page, third-page or quarter-page block lands exactly on a column line.
 */
export const GRID = { columns: 12, column: 88, gutter: 16, margin: 24, content: 1232, page: 1280 };

/** Span width for s of 12 columns: s*88 + (s-1)*16. All integers. */
export const span = (s) => s * GRID.column + (s - 1) * GRID.gutter;

/**
 * Grid densities — the ONLY permitted `minmax()` minimums.
 *
 * These are not chosen, they are DERIVED: each is the width of a span of the
 * master grid. Because they are span widths, `repeat(auto-fit, minmax(X, 1fr))`
 * resolves to a column count that divides 12 at every viewport from 390 to
 * 1440 — verified, see docs/grid.md. A minimum that is not a span width (160,
 * 220, 240...) resolves to 5, 7, 9, 11 columns, which no 12-column page can
 * align to, and which cannot hold a full row without an orphan.
 *
 *   half    608px -> 2 columns
 *   third   400px -> 3
 *   quarter 296px -> 4
 *   sixth   192px -> 6
 */
export const DENSITY = { half: span(6), third: span(4), quarter: span(3), sixth: span(2) };

export const HAIRLINE = 1;

/** Corner radius. Zero. Not "small". Zero. */
export const RADIUS = 0;

/** Touch target minimum — an accessibility floor, and on the grid. */
export const TOUCH = 44;

/**
 * Alignment tolerance for the runtime auditor. Two edges are either the
 * SAME (delta 0) or DIFFERENT (delta > NEAR_MISS). A delta inside this
 * band is the amateur mark: close enough to read as an attempted
 * alignment, far enough to read as a failed one.
 */
export const NEAR_MISS = 6;

export const isOnScale = (n) => SPACE.includes(Math.abs(n));
export const nearestOnScale = (n) =>
  SPACE.reduce((best, v) => (Math.abs(v - n) < Math.abs(best - n) ? v : best), SPACE[0]);
