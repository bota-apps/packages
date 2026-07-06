---
"@bota-apps/react-ui": patch
---

Add layout/display variants so consumers can drop remaining raw-`className` escape hatches:

- **Avatar**: `size` (`sm`/`md`/`lg`/`xl`) on `Avatar` and `AvatarFallback` — root sizes the circle, fallback tracks the initials size. Defaults to `md` (unchanged from today).
- **Card**: `fill` — stretches the card to its parent's width and height (grid/flex cells, e.g. org-chart nodes).
- **Inline**: row chrome for list/selectable rows — `paddingX`, `paddingY`, `borderBottom`, `background` (`muted`), and `indent` (nested rows; combines with `paddingX`, deeper `pl-*` wins the left side).
- **Stack**: `width` (fixed-width leading column, `xs`–`xl`) and `shrink` (`"0"`) — pair them for a labeled row's fixed column; the flexible column already uses `grow`.
- **Text**: `mono` and `tabular` booleans — monospace face and tabular figures for aligned numeric ranges.

All additive and optional; no existing API changes.
