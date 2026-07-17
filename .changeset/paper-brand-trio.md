---
"@bota-apps/tailwind-preset": minor
"@bota-apps/react-ui": minor
"@bota-apps/react-components": minor
---

Paper-look brand family and a stronger brand voice end to end:

- **New brands `kraft` and `blueprint`**, and a bolder `ledger`: ledger now
  pairs its manila page with a dark ink-navy rail; kraft is brown wrapping
  paper with stamp-green primary and slab display headings; blueprint is pale
  drafting paper with a deep blue rail, square corners, and a monospace
  display voice.
- **Headings now render in the theme's display face** (`font-display`). The
  token defaults to `var(--font-sans)`, so nothing changes until a brand sets
  its own display stack — then every heading carries the brand (manuscript's
  serif headings finally show).
- **Sidebar layout: the content well is anchored to the rail** instead of
  centered in the remaining space, which read as a giant left gutter on wide
  screens. The well keeps a `max-w-7xl` cap and its gutters; spare width now
  stays on the right.
