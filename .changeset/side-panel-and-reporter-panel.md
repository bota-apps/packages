---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": minor
"@bota-apps/types": minor
---

Non-modal SidePanel and a docked, richer issue reporter.

- `SidePanel` (react-ui): a non-modal companion panel that docks at the right
  edge of a layout — no focus trap, no backdrop, the app stays interactive
  beside it. Width presets (md/lg/xl) with built-in widen/narrow controls
  (hidden below `md`, where the panel becomes a viewport-wide overlay that
  never exceeds the device width). Children stay mounted while closed, so
  in-progress form state survives close/reopen.
- App shell (react-components): new optional `panel` slot on `AppShell`,
  `AppShellLayout`, and both layouts — the panel shares the content row below
  the header and pushes the content well narrower instead of overlaying it.
- `IssueReporter` (react-components):
  - `variant="panel"` renders the form in a SidePanel for the shell's `panel`
    slot; the sheet presentation remains the default. Panel drafts persist
    across close/reopen; `prefillKey` forces the draft to be replaced with
    fresh defaults.
  - `defaultTechnicalContext` + `technicalContext` on `CreateIssuePayload`:
    machine-captured diagnostics ride along with the report for triage — the
    reporter shows a short "details attached" notice instead of dumping raw
    payloads into user-facing fields. `IssueDetails` renders the attached
    context in a mono "Technical details" section.
  - Built-in one-click screen capture via the native Screen Capture API
    (`getDisplayMedia`) where supported: the browser picker lets the user
    share the current tab, a window, or a screen, one frame is grabbed as a
    PNG into the screenshot list, and the stream stops immediately. File
    upload stays available; the control hides on unsupported browsers.
    Chosen over DOM-rasterization libraries, which fail on modern CSS colors
    (oklch) and canvas/WebGL content.
  - The feature picker shows each node's new optional `description`
    (`FeatureNodeDef.description`, @bota-apps/types) under its label.
