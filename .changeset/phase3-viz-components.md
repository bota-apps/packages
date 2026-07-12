---
"@bota-apps/react-ui": minor
---

Add domain-neutral visualization and comparison surfaces to `@bota-apps/react-ui`
and its `./charts` subpath:

- **`ComparisonTable`** — a typed, generic (`<T>`) side-by-side comparison of a
  bounded set of options across labeled attributes. Column states
  (recommended/lowest/highest/selected/unavailable) are shown with badges + text
  (never color alone); accessible selection; container-query reflow from table to
  stacked cards in narrow containers.
- **`MoneyBreakdown`** — a financial summary using semantic `<dl>` markup:
  optional grouped sections + subtotals, positive/negative values (rendered with a
  real minus glyph), a distinguished total, and `default`/`document` (print) variants.
  Values are caller-formatted — the component never formats currency.
- **`RouteDiagram`** — a 2D SVG diagram of a staged, multi-leg journey. Node status
  (complete/current/upcoming) is conveyed by shape + text, not color alone; a
  semantic ordered-list summary backs the SVG for screen readers and print; optional
  CSS path-draw reveal that is static under `prefers-reduced-motion`; container-query
  switch to a vertical layout in narrow containers.
- **`DocumentChecklist`** — a document-completeness surface: per-item status
  (provided/missing/pending/expired) with icon + text, required/optional in words, a
  worded completeness count and progress bar, router-neutral `onSelect`, trailing
  action slot, and a zero-state. Presentational only — no upload/routing.
- **`WaterfallChart`** (`./charts`) — a Recharts waterfall explaining how a starting
  value becomes an ending value via signed steps; injectable value formatter; tooltip;
  a required accessible table alternative; standard/compact variants; animation gated
  on `prefers-reduced-motion`.
- **`VarianceHeatmap`** (`./charts`) — an accessible `<table>` heatmap (no Recharts)
  with a diverging token color scale; every cell shows its numeric value as text plus
  a per-cell `aria-label`; a scale legend; horizontal scroll in narrow containers.

Each ships cva variants (`<name>Variants` + state/variant unions), stories, and tests.
Interaction states use `muted`/`selected` (never `accent`).
