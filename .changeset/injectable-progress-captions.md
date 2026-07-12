---
"@bota-apps/react-ui": minor
---

Make the remaining hardcoded English micro-copy in `DocumentChecklist`, `ReadinessSummary`, and `ProcessTimeline` overridable, so the components can be adopted in fully-translated apps without an i18n regression (per the repo's "English defaults, injectable translations" rule).

- `DocumentChecklist` gains `statusLabels` (per-key override of Provided/Missing/Pending/Expired), `requiredLabel`, `optionalLabel`, and `progressLabel(provided, total)` for the "{provided} of {total} provided" caption.
- `ReadinessSummary` gains `progressLabel(complete, total)` for the "{complete} of {total} complete" caption.
- `ProcessTimeline` gains `summaryLabel(step, total, label)` for the compact "Step {n} of {m} — …" summary shown below a horizontal timeline in narrow containers.

All new props are optional and default to the previous English strings — no change for existing callers.
