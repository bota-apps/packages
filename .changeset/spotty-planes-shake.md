---
"@bota-apps/react-ui": minor
---

One icon-placement and content-composition grammar for every card surface.

Icons on cards previously varied in size, tint, shape, and position from one
component to the next (bare 40px glyphs above titles, 48–64px circles, 40px
rounded squares, per-component svg sizing). This release makes the icon badge
the single tile primitive, defines a fixed size ramp, and sanctions exactly
three placements:

- **stacked** — marketing feature cards (`FeatureTile`, new): tinted tile above
  the title; collapses to an inline icon + title row below 16rem of container
  width.
- **leading** — content, navigation, and stat cards (`Card` `icon` prop,
  `QuickLink`, `StatCard`): tile aligned to the title block.
- **inline** — bare glyphs at text size (16px) inside checklist/meta rows.

Trailing/corner icon placement is no longer sanctioned; `Card.headerRight` is
for actions and badges only.

**`IconBadge` / `iconBadgeVariants` (breaking):**

- New size ramp with a constant 2:1 tile-to-glyph ratio: `sm` (32px), `md`
  (40px), `lg` (48px), `xl` (64px). The previous `md` (48px) is now `lg`; the
  previous `lg` (64px) is now `xl`. The default changed from `lg` to `md`.
- New `shape` variant: `square` (default) | `circle`. The badge was previously
  always circular — pass `shape="circle"` to keep a circle (people, status,
  progress); squares are for object/feature/navigation icons.
- New tones: `info`, `warning`, `destructive` (joining `primary`, `success`,
  `muted`).
- New exported types: `IconBadgeSize`, `IconBadgeShape`, `IconBadgeTone`.

**`Card` (breaking):**

- `variant="feature"` removed from `Card`/`cardVariants` — use the new
  `FeatureTile` component instead.
- New `variant="flush"` — a card surface with no internal padding for callers
  that compose their own internal layout (previously reachable by abusing
  `variant="feature"` without header props).
- `icon` now takes a `LucideIcon` component (was `ReactNode`) and renders as a
  leading tinted tile in the header, aligned to the title block, on every
  variant (previously the prop only rendered on the removed `feature`
  variant). New `iconTone` prop tints the tile.

**Removed exports** (each with its replacement):

- `CardIconEl` (html layer, bare 40px glyph container) → `IconBadgeEl` /
  `IconBadge`.
- `TileIconEl` and `TileIconElProps` (html layer, tile-internal icon
  container) → `IconBadgeEl` (`size="md"`).
- `statCardIconVariants` → `iconBadgeVariants`; `StatCard` now renders its
  icon inside `IconBadgeEl` (square, ramp sizes `sm`/`md`/`lg` tracking card
  density).

**New exports:** `FeatureTile`, `FeatureTileProps`, `featureTileVariants`,
`featureTileHeaderVariants`, `IconBadgeSize`, `IconBadgeShape`,
`IconBadgeTone`, and a `hero` size on `stepBubbleVariants`.

**Visual-only changes (no API impact):** `QuickLink` and `StatCard` icon tiles
now render through the shared badge primitive (stat-card tiles are now rounded
squares on the ramp instead of bespoke circles); `StepIndicator`'s number
bubble renders through the step-bubble primitive; `CardHeaderEl` gained a
`gap-4` between the title block and `headerRight`.
