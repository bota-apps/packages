---
"@bota-apps/react-ui": patch
---

StatCard and DetailField robustness fixes:

- `StatCard` is now a size container and hides its `chart` slot below ~19rem of card width, so a fixed-width sparkline can no longer starve the label/value column in dense grids.
- `DetailField` hosts its `value` in a block-safe wrapper instead of a `<p>`, fixing invalid `<p><p>` nesting (and the React hydration warning) when the value is itself block-level content such as a `Text` paragraph.
