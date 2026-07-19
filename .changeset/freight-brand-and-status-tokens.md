---
"@bota-apps/tailwind-preset": minor
"@bota-apps/react-ui": minor
"@bota-apps/react-components": patch
---

Freight brand, product surfaces, and semantic status tokens:

- **New brand `freight`** — a logistics-operations look: corridor-blue
  primary over cool-neutral surfaces, dark navy rail, signal-orange accent
  reserved for manual-intervention emphasis, Inter voice, crisp 0.25rem
  corners, and deep blue-black dark mode. The brand file also carries
  geo/map product tokens (`--map-panel-*`, `--map-marker-*`, `--map-route-*`,
  `--map-location-*`, `--map-cluster-*`, `--map-overlay-scrim`) for
  map-centric screens — planned vs observed routes, live/reported/estimated/
  stale positions — kept out of `theme.css` on purpose.
- **`brandCss` learns `surfaces`** — per-product-surface override blocks
  scoped to `:root[data-brand][data-product-surface="<surface>"]` (+ `.dark`),
  so one brand can serve a dense operations console and a comfortable
  customer portal without forking. The shipped `freight` brand includes
  `operations` and `customer` surfaces.
- **Semantic status token families** in `theme.css` + preset colors:
  `status-{info,success,warning,danger,neutral}` each with solid
  (`DEFAULT`/`foreground`) and subtle (`subtle`/`subtle-foreground`) pairs,
  re-tuned for dark mode. Status meaning now has canonical tokens instead of
  raw palette classes.
- **Badge families resolve status colors through the new tokens** —
  `BadgeEl` success/warning/muted, `IconBadgeEl` info/success/warning, and
  `StepBubbleEl` info/success/warning now render from `status-*` tokens
  (dropping their hardcoded green/yellow/gray classes and `dark:` variants),
  so badge status colors follow the theme in both modes under every brand.
