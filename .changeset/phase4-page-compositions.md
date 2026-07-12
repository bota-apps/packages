---
"@bota-apps/react-components": minor
---

Add four reusable, domain-neutral page/entity compositions:

- **`EntityWorkspace`** — an entity-detail composition: a page header (title,
  subtitle, status, primary actions) above a tabbed body. Tabs are generic named
  slots supplied by the app; pass `activeTab` + `onTabChange` to bind the selected
  tab to the router (route-controlled), or omit for uncontrolled local state. The
  trigger row scrolls in narrow containers. Loading/error stays the caller's concern.
- **`LifecyclePageSection`** — composes a section header + a process timeline + an
  optional status legend + an optional supporting action + an optional detail panel;
  the detail panel sits beside the timeline in wide containers and stacks in narrow.
- **`OperationalDashboard`** — a pure dashboard layout: one column in narrow
  containers, two columns in wide ones, with an adjustable primary/secondary
  proportion (`ratio`). Stable layout, no baked-in data/loading behavior.
- **`RouteActionCenter`** — the router-aware sibling of react-ui's `ActionCenter`:
  each action is a typed `<Link>` styled with the shared `actionCenterItemVariants`
  recipe, preserving keyboard operability and active-state, with no app-specific
  route strings baked in.

Each ships stories and tests. These compose the react-ui primitives (ProcessTimeline,
StatusLegend, ActionCenter, PageHeader, Tabs, EntitySummary, ActivityFeed).
