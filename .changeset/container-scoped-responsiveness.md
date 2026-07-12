---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": minor
---

Container-scoped responsiveness sweep: components adapt to the container they are given — from 320px phone panels to very wide monitors — instead of assuming they own the viewport, and the app shell gets a proper narrow-screen layout.

**@bota-apps/react-ui**

- `Grid` (and `gridVariants`): multi-column grids are now container-scoped. Column classes changed from `md:grid-cols-*`/`lg:grid-cols-*` to `@xl:grid-cols-*`/`@4xl:grid-cols-*`, and a multi-column `Grid` renders its own `@container` wrapper element around the grid. Anything selecting the grid as a direct child of its previous parent, or asserting on the old classes, must account for the wrapper. Single-column grids are unchanged.
- `SectionHeader` / `SectionHeaderEl` / `sectionHeaderVariants` / `SectionHeaderActionsEl`: the title-to-actions column/row switch is now container-scoped (`@xl:` instead of `sm:`), and `SectionHeaderEl` renders its own `@container` wrapper.
- `PageHeader` / `pageHeaderVariants`: the header row now wraps (`flex-wrap` + gaps) so the action drops below the title in narrow columns instead of squeezing the title.
- `TabNav` / `navVariants` (`tabBar`) / `tabNavLinkVariants`: tab bars are now container-scoped — a scrollable full-width strip in narrow containers, the inline pill row from the `@2xl` container width (previously keyed off the `md` viewport breakpoint). `TabNavContainerEl` carries the `@container` scope.
- `DataTable`: the table-to-cards switch now reacts to the table's own container width (below ~640px it renders `mobileRenderItem` cards) instead of the viewport, so a table in a narrow panel becomes cards even on a wide screen. The toolbar layout picker hides in narrow containers, and toolbar padding is container-scoped. `TableDataWrapperEl` now carries the `@container` scope.
- `PageContent` / `pageContentVariants`: no longer applies its own gutters (`px-3 md:px-4` and the per-region `py`/`pt`/`pb` are removed) — the app-shell content well owns page padding; stacking both visibly wasted width on phones. Pages rendered outside an app shell must now provide their own padding.
- `useChartHeight` (charts): now returns `{ ref, height }` instead of a number — attach `ref` to the chart's measuring wrapper. The `"responsive"` size resolves against the chart's own container width, not the viewport. New exported type `ChartHeightResult`.
- `OnboardingSteps`: inactive step labels and separators collapse in narrow containers (only the active step keeps its label); renders its own `@container` wrapper.
- `DetailField`: long values now wrap inside the field instead of widening it (`min-w-0` value column + `break-words`).
- `ButtonGroup`: wraps in narrow containers instead of overflowing.
- Dialog/alert-dialog panels (`modalContentVariants`): capped to the small-viewport height and scrollable past it.
- New export: `useContainerWidth` — ResizeObserver-based hook for container-scoped layout switches that live in logic rather than classes.

**@bota-apps/react-components**

- `AppShellLayout` (sidebar): the rail now hides below the `md` viewport breakpoint (previously `sm`) and a menu button in the header opens the same brand + nav in a left sheet; the contextual header slot truncates instead of wrapping word-per-line; header/content padding tightens on phones; the content well widens on very wide screens (`min-[1800px]:max-w-7xl`).
- `AppShellLayout` (topnav): the contextual header slot hides below `lg` and truncates above it; the nav slot clips non-measuring content so it can't overlap the header actions; same phone padding and wide-screen cap as the sidebar layout.
- `AppShell`: the sign-out button collapses to icon-only on phones (label stays for screen readers) and the signed-in text truncates.
