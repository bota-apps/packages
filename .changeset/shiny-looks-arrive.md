---
"@bota-apps/tailwind-preset": minor
---

Brands can now define complete looks, and the shipped brands do.

`brandCss` accepts two new options, `tokens` and `darkTokens` — per-block
overrides for any theme.css token (surfaces, borders, chrome, chart slots),
keyed by camelCase token name (`sidebarBackground` → `--sidebar-background`).
They emit last in their block, so they also win over the generated chromatic
tokens (e.g. `darkTokens.primary` lifting the primary for dark surfaces). A
brand can now range from a simple accent swap to a look that reads as a
different product.

The shipped example brands are replaced by four complete looks:

- **Removed:** `brands/emerald.css`, `brands/violet.css`. If you imported one,
  either switch to a shipped look below or regenerate the old file yourself —
  they were plain accent swaps: `brandCss({ name: "emerald", primary:
"#059669", accent: "#F59E0B" })` and `brandCss({ name: "violet", primary:
"#7C3AED", accent: "#EC4899" })`.
- **Added:** `brands/manuscript.css` (warm paper surfaces, serif voice,
  hairline borders, near-square corners), `brands/terminal.css` (monospace,
  square corners, console-dark chrome), `brands/sorbet.css` (soft 1.25rem
  corners, rounded type, berry brights), `brands/graphite.css` (charcoal
  chrome over a light page, crisp radius).

No JS exports were removed; `brandCss` calls without the new options emit
byte-identical CSS as before.
