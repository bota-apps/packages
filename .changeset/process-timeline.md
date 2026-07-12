---
"@bota-apps/react-ui": minor
---

Add `ProcessTimeline` — a domain-neutral process-status component for ordered
lifecycle steps. Each item is `complete`, `current`, `upcoming`, `blocked`, or
`skipped`; the component renders a semantic `<ol>`, marks the active step with
`aria-current="step"`, and never conveys status by color alone (every marker
carries a default shape icon and each item a visually-hidden, overridable
status label).

- `orientation` (`vertical` | `horizontal`) and `density` (`comfortable` |
  `compact`) variants; horizontal collapses per-step labels to a compact
  "Step x of n" summary below the `@2xl` container width.
- Optional `showConnectors`, controlled selection via `selectedItemId` +
  `onItemSelect` (items become keyboard-operable buttons only when selectable).
- Exposes `processTimelineVariants` and the marker/connector/item cva recipes,
  plus the `ProcessTimelineItemStatus` / orientation / density unions.
- Color transitions collapse to instant under `prefers-reduced-motion`; no
  JS-driven animation.
