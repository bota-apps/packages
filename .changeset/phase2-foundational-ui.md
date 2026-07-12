---
"@bota-apps/react-ui": minor
---

Add five foundational, domain-neutral surfaces for detail pages and dashboards,
plus `Dl`/`Dt`/`Dd` html primitives:

- **`StatusLegend`** — a compact key mapping colored (and optionally icon-shaped)
  swatches to labels; horizontal or vertical; semantic list; color is never the
  only signal.
- **`EntitySummary`** — a label/value fact surface using semantic `<dl>` markup;
  container-query column reflow (1→2→3), comfortable/compact density, full-width
  items for long values.
- **`ActivityFeed`** — a human-readable, chronological event feed (distinct from a
  compliance audit log); tone-tinted markers, optional connectors, density, and a
  zero-state.
- **`ReadinessSummary`** — an optional progress bar with a worded count plus
  grouped, optionally-actionable issues (router-neutral `onSelect`); positive
  zero-state; readiness never communicated by color alone.
- **`ActionCenter`** — a router-neutral "next actions" panel; each action renders
  as a keyboard-operable button (via `onSelect`) or a static row, with an urgency
  icon tone and a trailing slot. Exposes `actionCenterItemVariants` as the shared
  styling recipe for a future router-aware wrapper.

Each ships its cva variants (`<name>Variants` + tone/status/density unions),
stories, and tests. Interaction states use `muted`/`selected` (never `accent`),
and all motion respects `prefers-reduced-motion`.
