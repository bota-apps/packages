---
"@bota-apps/react-components": minor
---

Typed page-error taxonomy wired into the page-state machinery.

- New `classifyPageError` maps any thrown value (via the fm error taxonomy)
  to a UI-facing `PageErrorCode` (`unauthenticated` / `forbidden` /
  `not-found` / `network` / `server` / `unknown`) plus a technical `detail`
  string that is never rendered.
- `PageState`'s error variant gains `code` and `detail`; `PageContainer`
  resolves per-code default copy, and offers retry only for retryable codes
  (network/server/unknown) — authorization and missing-content failures no
  longer show a decorative "Try Again".
- New `PageErrorProvider` sets app-level error presentation policy once:
  localized per-code copy and per-code call-to-actions (e.g. report-an-issue
  with the technical detail attached, sign-out for authorization failures).
- `SuspensePageContainer`, `RouteError`, and `derivePageState` now classify
  failures instead of echoing `error.message` — raw transport payloads
  (serialized GraphQL responses) never reach the page again. Validation and
  business-rule messages, written for users, still render.
- `IssueReporter` gains `defaultDescription` / `defaultReproSteps` prefills
  so error surfaces can open it with captured context.
