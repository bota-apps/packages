---
"@bota-apps/react-components": minor
---

Add three dumb, host-agnostic issue-reporting components plus their shared
structural types (`Issue`, `CreateIssuePayload`, `IssueScreenshotRef`,
`IssueStatusAppearance`, `defaultIssueStatusAppearance`):

- **`IssueReporter`** — a side-sheet report form anchored to the host app's
  feature tree: a searchable grouped feature picker (module groups + a
  "General" app-wide group, node icons when present), description and
  reproduction-steps fields, screenshot selection with count/size limits, and
  optional contact fields. Submission runs through a single async
  `onCreateIssue(payload)` handler with idle → pending → success/error states;
  works controlled (`open`/`onOpenChange`) or uncontrolled via a built-in
  trigger. Uploading, transport, and persistence stay the host's concern.
- **`IssueList`** — a compact, selectable list of reported issues: status
  badge, feature label, truncated description, relative creation date, and
  screenshot count, with loading skeletons and an empty state. Generic over
  the host's issue type; unknown status codes fall back to a humanized
  neutral badge.
- **`IssueDetails`** — a read-only view of one issue: header with feature
  label, status badge, and timestamps; description; optional reproduction
  steps, screenshot thumbnails (linked when a URL is provided, name chips
  otherwise), and contact section; plus an optional status-editing control
  driven by `statusOptions` + `onUpdateStatus` with a pending state.

Each ships stories and tests. All environment-specific behavior arrives via
props — the components import nothing platform-specific.
