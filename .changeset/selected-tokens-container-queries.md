---
"@bota-apps/tailwind-preset": minor
---

Add interaction-state design tokens and container-query support.

- New `selected` / `selected-foreground` semantic colors (CSS variables `--selected`, `--selected-foreground` in `theme.css`, light + dark) — the soft emphasis surface for persistent on/active states (toggle groups, selected menu items, calendar ranges, active nav). They resolve through the primary ramp, so existing brand CSS picks them up with no regeneration.
- The preset now ships `@tailwindcss/container-queries`, enabling `@container` and `@sm:`…`@7xl:` variants so components can respond to their own container width instead of the viewport.
