---
"@bota-apps/react-components": patch
"@bota-apps/react-ui": patch
---

Shared host-router factory and an accessible name for the page-actions trigger:

- **react-components**: `createHostRouter(routeTree, history?)` — owns the router options every host must agree on (`defaultPreload: "intent"`, the shared `NotFound`/`RouteError` surfaces, the runtime-injected context placeholder). Apps keep a thin `createAppRouter = (history?) => createHostRouter(routeTree, history)` wrapper so their `Register` declaration and page tests keep working unchanged. Also `PageContainer` gains `menuActionsLabel`, forwarded to the menu trigger. (The react-components size budget grew to 110 kB: the factory pulls `createRouter` into the bundle — code every host already ships for its own router, so real apps see no net growth.)
- **react-ui**: `PageMenuActions` names its icon-only trigger for screen readers — new `triggerLabel` prop, default `"Page actions"`, overridable for translation. Tests and assistive tech can now address the trigger as `getByRole("button", { name: "Page actions" })`.

Both additive; no existing API changes.
