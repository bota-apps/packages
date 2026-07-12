---
"@bota-apps/react-ui": minor
---

Depth/motion polish across the kit, plus new engagement components.

Visual changes (no API removals):

- Components now render on the semantic elevation tiers (`shadow-raised/overlay/floating`) instead of raw `shadow-sm/md/lg`; dialog and sheet panels moved from `bg-background` to the popover surface tier, so dark mode separates them from the page (identical in light mode).
- `Skeleton` upgraded from a pulse to a shimmer sweep (`motion-reduce` aware).
- Buttons gained subtle press feedback via the shared `pressableClasses` recipe in the interaction module.
- Hardcoded transition durations normalized onto the motion tokens; right-aligned table cells now use tabular figures.

New components:

- `Timeline`/`TimelineItem` — vertical event timeline with tone variants.
- `CommandPalette` + `Command*` subcomponents and `useCommandPaletteShortcut` — ⌘K action launcher (wraps cmdk inside the design-system Dialog).
- `Kbd` — keyboard-key chip.
- `Sparkline` (on the `./charts` subpath) — minimal inline trend line; `StatCard` gained a `chart` slot to host it.
- `Hero` moved from the section module into its own module: same `title`/`description`/`actions` props (imports from the package barrel are unaffected), plus new `treatment` (`glow` | `grid` | `tint`) and `align` props for tokenized, brand/dark-aware background surfaces.
- `EmptyState` gained a `variant="tinted"` icon presentation.
