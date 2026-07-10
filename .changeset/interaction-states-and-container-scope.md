---
"@bota-apps/react-ui": minor
---

Interaction-state overhaul and container-scoped responsiveness. No exports were removed or renamed — this is a visual/behavioral refinement release.

**Interaction states no longer use `accent`.** The `accent` token is a brand-emphasis color that apps rebrand to saturated hues, so hover/selected surfaces built on it rendered as loud brand fills. Every interaction surface now follows one rule:

- transient hover/press surfaces → `muted` (buttons `outline`/`ghost`, menu/select/combobox rows, calendar day hover, nav links, pagination, tiles, dialog close)
- persistent on/active states → new `selected` / `selected-foreground` tokens (Toggle/ToggleGroup on-state, combobox selected option, calendar range, active nav item)

Apps that deliberately want accent-colored surfaces can still apply `bg-accent` utilities explicitly.

**One shared focus/hover recipe.** New `focusRingClasses` and `formControlInteractionClasses` fragments (exported from the package root) now style Input, Textarea, Select/Combobox triggers, Button, and Toggle: a soft 2px ring at reduced opacity plus a ring-colored border on field controls, and a border tint on hover — consistent across every control and both themes.

**Controls adapt to their container, not the viewport.** `FormGrid`, `QuickLinkGrid`, the DataTable card-grid layout, and `Stepper` now use container queries (the components render their own `@container` scope): a two-column form grid collapses to one column inside a narrow panel even on a wide screen, and the Stepper swaps per-step labels for a compact "Step x of n" summary below the `@2xl` container width. Requires `@bota-apps/tailwind-preset` from this release (it now ships the container-queries plugin).
