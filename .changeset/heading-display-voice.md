---
"@bota-apps/react-ui": patch
---

`Heading` (typography) now renders in the theme's display voice like the other
heading primitives — `font-display` falls back to the sans stack for brands
without a display face, so brands that don't set one are unaffected.
