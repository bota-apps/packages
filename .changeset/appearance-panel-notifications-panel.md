---
"@bota-apps/react-components": minor
---

Appearance panel, notifications panel, and a custom appearance color.

- `AppearanceProvider` gains a `customColor` axis: a picked six-digit hex re-derives the primary ramp and shell chrome tokens in both modes on top of the active brand (inline token overrides), persists alongside the other axes, and clears when a preset is applied. `useAppearance()` adds `customColor`, `setCustomColor`, and `hydrateAppearance` (merge externally stored axes, each individually validated). `AppearancePreset` gains optional `preview` color swatches.
- New `AppearancePanel`: the appearance controls as a docked SidePanel — light/dark mode switch, preset cards with descriptions and preview swatches, the free color picker, and a `footer` slot for an app-provided persistence action.
- New `NotificationsPanel` + `NotificationsTrigger`: the notification list as a docked SidePanel with mark-all-read and selection callbacks; the bell trigger badges the unread count and reflects the panel's open state via `aria-pressed`.
- `AppShell` gains `appearanceControls: "builtin" | "none"` to omit the built-in PresetSelect/ThemeToggle when the app mounts its own appearance UI.
- `IssueReporter` gains `clearDraftLabel` — an explicit discard-draft action in the actions row for the panel variant's durable draft.
