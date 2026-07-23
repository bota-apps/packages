---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": minor
---

Semantic status tones everywhere, an `info` badge variant, and a `wide` page width.

- All remaining raw-palette status styling now renders through the semantic
  `status-*` tokens: statusDot, activityFeed, timeline, statusLegend, alert,
  toast/toastNotification, stepper connector lines, actionCenter, statCard,
  readinessSummary, documentChecklist, numericText, table row severities, and
  the react-components toast stack. Brands that tune the status token families
  now restyle these components with no per-component overrides.
- `Badge` gains an `info` variant (subtle info surface pair), completing the
  status set alongside `success`/`warning`/`muted`.
- `PageContent`/`PageContainer` gain a `wide` width variant (`max-w-[96rem]`)
  for dense work surfaces such as wide tables and boards.
- The sidebar app-shell content well is now centered under a `96rem` cap
  instead of left-anchored at `80rem`, so spare width on large screens splits
  symmetrically instead of pooling as a dead right gutter. Pages keep their
  own width policy via `PageContent` (`default` still caps at `80rem`).
