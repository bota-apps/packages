# @bota-apps/react-components

## 0.18.0

### Minor Changes

- 4536d37: Shell chrome controls and new app-shell slots.

  - `Button` gains a `chrome` variant styled from the `sidebar-*` token set, for
    controls mounted on the shell chrome (header bar / sidebar rail) where the
    page-surface variants can go illegible on brands with saturated chrome.
  - `PresetSelect`, `ThemeToggle`, and `LanguageToggle` accept a `variant` prop
    (default `outline`); `AppShell` now mounts its built-in controls with
    `variant="chrome"`.
  - `AppShellLayout` slots grow `sidebarFooter` (bottom-anchored rail content,
    also rendered in the mobile nav sheet) and `footer` (app-wide footer below
    the content row).
  - `AppShell` renders a signed-in identity card (avatar initials, name, and a
    new `userDescription` line) at the rail foot; on the sidebar layout the
    sign-out action moves into the card's menu, while the topnav layout keeps
    the header sign-out button. New `footer` prop passes through to the layout.
  - New `NotificationsMenu`: a presentational header bell with unread-count
    badge, item list, empty state, and optional mark-all-read action.
  - New `AppFooter`: a quiet app-wide footer strip (ownership line + legal
    links, with a `renderLink` hook for router integration).

### Patch Changes

- Updated dependencies [4536d37]
  - @bota-apps/react-ui@0.24.0

## 0.17.1

### Patch Changes

- Updated dependencies [06d6c1f]
  - @bota-apps/react-ui@0.23.0

## 0.17.0

### Minor Changes

- 9b29b02: `IssueDetails` previews screenshots in-app instead of opening a new tab.

  Screenshot thumbnails are now preview triggers: a lone screenshot opens an
  `ImagePreview` dialog, several share one dialog staging a `Carousel` opened
  at the clicked screenshot (previous/next, "n of m" readout, arrow-key
  paging). Screenshots without a URL keep the file-name chip fallback.

  New optional `IssueDetailsTranslations` keys (English defaults):
  `previewScreenshotLabel(fileName)`, `closePreviewLabel`,
  `previousScreenshotLabel`, `nextScreenshotLabel`, and
  `screenshotPositionLabel(position, total)`. Translation overrides now merge
  per-key, so explicitly-undefined keys fall back to the defaults.

### Patch Changes

- Updated dependencies [9b29b02]
  - @bota-apps/react-ui@0.22.0

## 0.16.1

### Patch Changes

- 9ca3ab2: Panel and form-control polish.

  - `SidePanel`: renders on the card surface with a soft overlay shadow so it
    reads as its own raised layer beside the content, and gains a `footer` slot
    — a pinned action row below the scrollable body.
  - `ScrollArea`: the viewport now inherits a `max-h-*` set on the root.
    Previously a max-height-constrained ScrollArea (e.g. the Combobox option
    list) clipped its content without ever scrolling, because a percentage
    height cannot resolve against a parent sized by max-height alone.
  - Form controls (`Input`, `Textarea`, select/combobox triggers): filled with
    `bg-background` instead of transparent — on elevated surfaces they read as
    gently recessed wells rather than bare outlines; on background-colored
    pages the change is invisible.
  - `IssueReporter` (panel variant): Cancel/Submit move into the SidePanel's
    pinned footer, form-associated via the form id, so they stay visible while
    the form scrolls.

- Updated dependencies [9ca3ab2]
  - @bota-apps/react-ui@0.21.0

## 0.16.0

### Minor Changes

- ed5439e: Non-modal SidePanel and a docked, richer issue reporter.

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

### Patch Changes

- Updated dependencies [ed5439e]
  - @bota-apps/react-ui@0.20.0
  - @bota-apps/types@0.11.0
  - @bota-apps/auth-client@0.6.3
  - @bota-apps/fm@0.8.4
  - @bota-apps/schema-utils@0.9.4

## 0.15.0

### Minor Changes

- 867399f: Typed page-error taxonomy wired into the page-state machinery.

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

## 0.14.1

### Patch Changes

- b8a7e97: Restore rail-anchored content in the sidebar layout. The centered well
  introduced in the previous release read as a floating left gutter next to the
  fixed rail — the content well and capped `PageContent` widths are anchored to
  the start edge again, with spare width staying on the right. The `wide` width
  variant and the well's generous cap are unchanged; only `narrow` content
  centers itself.
- Updated dependencies [b8a7e97]
  - @bota-apps/react-ui@0.19.2

## 0.14.0

### Minor Changes

- 7ef9f0f: Semantic status tones everywhere, an `info` badge variant, and a `wide` page width.

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

### Patch Changes

- Updated dependencies [7ef9f0f]
  - @bota-apps/react-ui@0.19.0

## 0.13.0

### Minor Changes

- 4ed2014: Add three dumb, host-agnostic issue-reporting components plus their shared
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

## 0.12.3

### Patch Changes

- Updated dependencies [e339187]
  - @bota-apps/react-ui@0.18.0

## 0.12.2

### Patch Changes

- Updated dependencies [4e58a4f]
- Updated dependencies [dd17920]
  - @bota-apps/react-ui@0.17.0

## 0.12.1

### Patch Changes

- 08bcf92: Freight brand, product surfaces, and semantic status tokens:

  - **New brand `freight`** — a logistics-operations look: corridor-blue
    primary over cool-neutral surfaces, dark navy rail, signal-orange accent
    reserved for manual-intervention emphasis, Inter voice, crisp 0.25rem
    corners, and deep blue-black dark mode. The brand file also carries
    geo/map product tokens (`--map-panel-*`, `--map-marker-*`, `--map-route-*`,
    `--map-location-*`, `--map-cluster-*`, `--map-overlay-scrim`) for
    map-centric screens — planned vs observed routes, live/reported/estimated/
    stale positions — kept out of `theme.css` on purpose.
  - **`brandCss` learns `surfaces`** — per-product-surface override blocks
    scoped to `:root[data-brand][data-product-surface="<surface>"]` (+ `.dark`),
    so one brand can serve a dense operations console and a comfortable
    customer portal without forking. The shipped `freight` brand includes
    `operations` and `customer` surfaces.
  - **Semantic status token families** in `theme.css` + preset colors:
    `status-{info,success,warning,danger,neutral}` each with solid
    (`DEFAULT`/`foreground`) and subtle (`subtle`/`subtle-foreground`) pairs,
    re-tuned for dark mode. Status meaning now has canonical tokens instead of
    raw palette classes.
  - **Badge families resolve status colors through the new tokens** —
    `BadgeEl` success/warning/muted, `IconBadgeEl` info/success/warning, and
    `StepBubbleEl` info/success/warning now render from `status-*` tokens
    (dropping their hardcoded green/yellow/gray classes and `dark:` variants),
    so badge status colors follow the theme in both modes under every brand.

- Updated dependencies [08bcf92]
  - @bota-apps/react-ui@0.16.0

## 0.12.0

### Minor Changes

- 8eb9615: Paper-look brand family and a stronger brand voice end to end:

  - **New brands `kraft` and `blueprint`**, and a bolder `ledger`: ledger now
    pairs its manila page with a dark ink-navy rail; kraft is brown wrapping
    paper with stamp-green primary and slab display headings; blueprint is pale
    drafting paper with a deep blue rail, square corners, and a monospace
    display voice.
  - **Headings now render in the theme's display face** (`font-display`). The
    token defaults to `var(--font-sans)`, so nothing changes until a brand sets
    its own display stack — then every heading carries the brand (manuscript's
    serif headings finally show).
  - **Sidebar layout: the content well is anchored to the rail** instead of
    centered in the remaining space, which read as a giant left gutter on wide
    screens. The well keeps a `max-w-7xl` cap and its gutters; spare width now
    stays on the right.

### Patch Changes

- Updated dependencies [8eb9615]
  - @bota-apps/react-ui@0.15.0

## 0.11.3

### Patch Changes

- 0e2d5b4: New shipped brand: `ledger` — a paper-form look with manila surfaces, stamp
  ink-blue primary, stamp-red accent, ruled borders, square corners, and a
  typewriter display voice. Import
  `@bota-apps/tailwind-preset/brands/ledger.css` after `theme.css` and switch
  with `data-brand="ledger"`. The PresetSelect story now demos it alongside the
  other shipped looks.
  - @bota-apps/react-ui@0.14.1

## 0.11.2

### Patch Changes

- Updated dependencies [3dc31c8]
- Updated dependencies [3dc31c8]
- Updated dependencies [3dc31c8]
  - @bota-apps/react-ui@0.14.0
  - @bota-apps/gql-client@0.3.0
  - @bota-apps/hooks@0.6.0

## 0.11.1

### Patch Changes

- Updated dependencies [d2ae36c]
- Updated dependencies [4ca7727]
  - @bota-apps/react-ui@0.13.0

## 0.11.0

### Minor Changes

- b32b034: Add four reusable, domain-neutral page/entity compositions:

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

### Patch Changes

- Updated dependencies [ab5fed8]
- Updated dependencies [b32b034]
- Updated dependencies [17efd87]
  - @bota-apps/react-ui@0.12.0

## 0.10.1

### Patch Changes

- 1df93c4: `Span` gains two responsive `display` variants for header-chrome composition, so apps can collapse control labels on phones without raw class overrides:

  - `display="srOnlyMobile"` — visible from the `sm` viewport up, screen-reader-only below (button labels that cost too much header width on phones).
  - `display="hiddenMobile"` — hidden below the `sm` viewport, `inline-flex` from it (decorative chrome such as keyboard-shortcut hints).

  `AppShell`'s sign-out label now uses `srOnlyMobile`.

- Updated dependencies [1df93c4]
- Updated dependencies [1df93c4]
  - @bota-apps/react-ui@0.11.0

## 0.10.0

### Minor Changes

- d64ff10: Container-scoped responsiveness sweep: components adapt to the container they are given — from 320px phone panels to very wide monitors — instead of assuming they own the viewport, and the app shell gets a proper narrow-screen layout.

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

### Patch Changes

- Updated dependencies [d64ff10]
  - @bota-apps/react-ui@0.10.0

## 0.9.4

### Patch Changes

- Updated dependencies [888d537]
- Updated dependencies [fd74d2e]
  - @bota-apps/react-ui@0.9.0

## 0.9.3

### Patch Changes

- Updated dependencies [5ff7de0]
  - @bota-apps/react-ui@0.8.0

## 0.9.2

### Patch Changes

- 1afd263: Horizontal nav entries that don't fit fold into a trailing "More" menu instead
  of being clipped.

  The topnav bar previously relied on horizontal scrolling with no affordance,
  so on narrower containers most nav entries were simply invisible. The
  horizontal `NavList` is now a priority+ nav: it measures its entries against
  its own container (IntersectionObserver), turns the ones that no longer fit
  fully invisible in place, and mirrors them into a trailing overflow menu —
  groups keep their panel shape as submenus, and the overflow trigger carries
  the active tone whenever the active route's entry is hidden. `NavList` gains
  an optional `moreLabel` prop (default `"More"`) for the trigger's label, and
  the topnav layout's nav region no longer scrolls horizontally.

## 0.9.1

### Patch Changes

- 2ee492c: Topnav nav groups open as overlay menus instead of stretching the bar.

  `NavList` gains an `orientation` prop (`"vertical"` default — unchanged rail
  behavior; `"horizontal"` renders entries with children as portaled dropdown
  menus, with deeper levels as submenus and the group's own route as the panel's
  first row). `AppShell` passes the orientation matching the active shell
  layout, so expanding a nav group in the topnav arrangement no longer grows the
  bar and pushes the page content down. Also adds `navMenuItemVariants`, the
  page-scoped active tint for rows inside those panels.

## 0.9.0

### Minor Changes

- 3722dd4: Appearance presets present as real looks, and the shell chrome is brand-themable.

  - `AppearancePreset` gains optional `icon` (a lucide icon) and `description`;
    `PresetSelect` renders them as a glyph plus a one-line hint under each
    preset's label, so a preset menu reads like a set of distinct products.
  - The shell chrome — the sidebar rail, the sidebar layout's top bar, and the
    topnav bar — now renders against the chrome-scoped `sidebar-*` tokens
    (`bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`) instead of
    the page's `card`/`border` tokens, and `navItemVariants` styles nav links
    with `sidebar-primary`/`sidebar-foreground`/`sidebar-accent` instead of
    `primary`/`muted`. Brands can now give the chrome its own character (e.g. a
    dark rail over a light page) without touching content surfaces. With the
    default theme tokens the rendered look is nearly unchanged (the chrome
    surface moves from pure white to the neutral `--sidebar-background`).
  - `AppShell`'s "Signed in as" header text inherits the chrome foreground
    instead of forcing the page-scoped muted tone, which could be unreadable on
    dark-chrome brands.

### Patch Changes

- @bota-apps/react-ui@0.7.1

## 0.8.5

### Patch Changes

- Updated dependencies [38fd879]
- Updated dependencies [38fd879]
  - @bota-apps/types@0.10.3
  - @bota-apps/schema-utils@0.9.2
  - @bota-apps/react-ui@0.7.0

## 0.8.4

### Patch Changes

- Updated dependencies [8c59a99]
  - @bota-apps/react-ui@0.6.0

## 0.8.3

### Patch Changes

- 2249836: Shared host-router factory and an accessible name for the page-actions trigger:

  - **react-components**: `createHostRouter(routeTree, history?)` — owns the router options every host must agree on (`defaultPreload: "intent"`, the shared `NotFound`/`RouteError` surfaces, the runtime-injected context placeholder). Apps keep a thin `createAppRouter = (history?) => createHostRouter(routeTree, history)` wrapper so their `Register` declaration and page tests keep working unchanged. Also `PageContainer` gains `menuActionsLabel`, forwarded to the menu trigger. (The react-components size budget grew to 110 kB: the factory pulls `createRouter` into the bundle — code every host already ships for its own router, so real apps see no net growth.)
  - **react-ui**: `PageMenuActions` names its icon-only trigger for screen readers — new `triggerLabel` prop, default `"Page actions"`, overridable for translation. Tests and assistive tech can now address the trigger as `getByRole("button", { name: "Page actions" })`.

  Both additive; no existing API changes.

- Updated dependencies [2249836]
  - @bota-apps/react-ui@0.5.2

## 0.8.2

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
  - @bota-apps/auth-client@0.6.2
  - @bota-apps/fm@0.8.2
  - @bota-apps/gql-client@0.2.2
  - @bota-apps/hooks@0.5.4
  - @bota-apps/react-ui@0.5.0
  - @bota-apps/schema-utils@0.9.1
  - @bota-apps/types@0.10.1

## 0.8.1

### Patch Changes

- Updated dependencies [233fc86]
- Updated dependencies [233fc86]
  - @bota-apps/schema-utils@0.9.0
  - @bota-apps/types@0.10.0
  - @bota-apps/react-ui@0.4.3
  - @bota-apps/auth-client@0.6.1
  - @bota-apps/fm@0.8.1

## 0.8.0

### Minor Changes

- 3547f2e: AppShell gains a `headerActions` slot. App-provided header controls render before the built-in theme/sign-out controls — this is where an app mounts its own i18n-coupled controls, most notably a `<LanguageToggle>` wired to the app's translation runtime (the shell can't own it because the supported languages are app data).

### Patch Changes

- 11a8bb6: `EntityAuditLog`'s entry constraint (`AuditEntryConstraint`) now accepts `null` on `actor.role`, `note`, and `source` — not just `undefined`. GraphQL-sourced audit rows (nullable fields) pass straight into `EntityAuditLog` without an app-side `null → undefined` normalizer; the renderers already treat null/undefined as absent.
- ee95340: NavList renders nested navigation with a single active highlight. `NavItemDef` gains an optional `children` field, and `NavList` renders child entries as a collapsible, indented sub-group that auto-expands when the active route is inside it. Active styling is driven by the single entry the current route belongs to (exact match wins, else longest route prefix — mirroring `getActiveNavId`), so an ancestor like `/employees` no longer also highlights on `/employees/inactive`. Flat `NavItemDef[]` (no `children`) renders as before — backward compatible.
- Updated dependencies [11a8bb6]
- Updated dependencies [6cfe6e1]
- Updated dependencies [6cfe6e1]
- Updated dependencies [11a8bb6]
  - @bota-apps/fm@0.8.0
  - @bota-apps/react-ui@0.4.2
  - @bota-apps/schema-utils@0.8.0
  - @bota-apps/hooks@0.5.3

## 0.7.0

### Minor Changes

- a7c25fd: New `RouteMeta` type alongside the navigation types: per-route metadata (`permissionId`, `activeNavId`, `mode`, `layout`) apps attach to their route definitions.

### Patch Changes

- Updated dependencies [a7c25fd]
- Updated dependencies [a7c25fd]
- Updated dependencies [a7c25fd]
- Updated dependencies [a7c25fd]
  - @bota-apps/auth-client@0.5.0
  - @bota-apps/schema-utils@0.5.0
  - @bota-apps/react-ui@0.4.0
  - @bota-apps/types@0.8.0
  - @bota-apps/fm@0.6.0
  - @bota-apps/hooks@0.5.1

## 0.6.4

### Patch Changes

- Updated dependencies [d610db4]
  - @bota-apps/hooks@0.5.0

## 0.6.3

### Patch Changes

- Updated dependencies [a1055ec]
  - @bota-apps/hooks@0.4.0

## 0.6.2

### Patch Changes

- Updated dependencies [f5de1e2]
  - @bota-apps/types@0.7.0
  - @bota-apps/auth-client@0.4.3
  - @bota-apps/fm@0.5.1
  - @bota-apps/react-ui@0.3.7
  - @bota-apps/schema-utils@0.4.3

## 0.6.1

### Patch Changes

- Updated dependencies [2e4156b]
  - @bota-apps/fm@0.5.0
  - @bota-apps/types@0.6.0
  - @bota-apps/hooks@0.3.2
  - @bota-apps/auth-client@0.4.2
  - @bota-apps/react-ui@0.3.5
  - @bota-apps/schema-utils@0.4.2

## 0.6.0

### Minor Changes

- 2d7904b: Appearance presets: one selection changes the whole look (breaking).

  `AppearanceProvider` is now configured with **presets** — pre-assembled looks bundling every appearance axis — instead of a flat brands list. Each `AppearancePreset` names a `brand` (token set: color, radius, typefaces), and optionally a `layout` and `density`; omitted axes resolve to the provider defaults so applying a preset always lands on the same complete appearance. Light/dark `mode` deliberately stays out of presets — every look ships both modes and the choice remains personal. The persisted preference is unchanged (per-axis JSON), so stored choices survive; the active preset is _derived_ by matching the current axes, and granular toggles (`LayoutToggle`, `DensityToggle`, still exported) simply move the appearance to a custom mix.

  ```tsx
  appearance: {
    presets: [
      { value: "bota", label: "Bota" },
      { value: "emeraldCompact", label: "Emerald compact", brand: "emerald", density: "compact" },
      { value: "violetTopnav", label: "Violet topnav", brand: "violet", layout: "topnav" },
    ],
  }
  ```

  Migration — every removed or changed export and its replacement:

  - `BrandSelect` → `PresetSelect` (lists presets; applies one per click; still renders nothing when fewer than two options, so shells mount it unconditionally).
  - `BrandOption` type → `AppearancePreset` (`{ value, label, brand?, layout?, density? }`).
  - `AppearanceConfig.brands` → `AppearanceConfig.presets` (+ new `defaultPreset`; `defaultBrand` now means "the `data-brand` used when a preset omits `brand`", default `"bota"`).
  - `useAppearance().brands` → `useAppearance().presets`, plus new `preset` (active preset value or `undefined` for a custom mix) and `applyPreset(value)`.
  - `setBrand` now validates against the brands presets resolve to (was: the brands list).
  - `AppShell`'s header now mounts `PresetSelect` + `ThemeToggle` (was: `BrandSelect` + `LayoutToggle` + `DensityToggle` + `ThemeToggle`) — one pick restyles everything; apps wanting granular axis controls compose `AppShellLayout` with the exported toggles.

- 0f2e0a9: Brands go beyond color (shape + typography tokens), and a new UI density axis.

  **tailwind-preset**

  - New typeface tokens: the preset's `font-sans`/`font-display` utilities (and the preflight body font) now resolve through `--font-sans`/`--font-display`, with system-stack defaults in `theme.css`. A brand block can change the app's typeface, not just its palette — the token names the family; loading webfont files stays the app's job.
  - `brandCss()` accepts optional `radius`, `fontSans`, and `fontDisplay`: a brand can now set its corner radius (`--radius`, e.g. `"1rem"` soft / `"0"` sharp) and typefaces in one recipe. Emitted only when provided — existing brand files regenerate byte-identically.
  - New density rule: `:root[data-density="compact"]` scales the root font-size (87.5%), compacting every rem-based utility uniformly with no per-component styles.

  **react-components**

  - `AppearanceProvider` gains a fourth axis, `density` (`"comfortable" | "compact"`, default comfortable), applied as `data-density` on `<html>` and persisted with the rest of the preference. New: `defaultDensity` config, `setDensity`/`toggleDensity` in `useAppearance()`, `appearanceDensities`/`AppearanceDensity` exports. Stored preferences from earlier versions lack the field and fall back to the default — no migration needed.
  - New `DensityToggle` (one-click comfortable ⇄ compact flip) for apps composing granular axis controls; density is also part of appearance presets (see the appearance-presets change in this release).

### Patch Changes

- @bota-apps/react-ui@0.3.4

## 0.5.0

### Minor Changes

- 53f7f72: Multi-brand theming and switchable shell layouts.

  **tailwind-preset**

  - New `brands/*.css` token blocks: a brand is a complete chromatic token set (primary/accent ramps, ring, sidebar highlights, matching chart slots) scoped under `:root[data-brand="<name>"]` + `:root[data-brand="<name>"].dark`, so switching brands at runtime is one attribute flip on `<html>` — the same mechanism dark mode uses. Neutrals inherit from `theme.css`. Ships `brands/emerald.css` and `brands/violet.css`; import the ones your app offers after `theme.css`.
  - New `@bota-apps/tailwind-preset/brand` subpath: `brandCss({ name, primary, accent })` generates a full brand stylesheet from one or two hex colors (plus `colorRamp` and `hexToHslChannels`). The shipped brand files are this function's own output, verified by test.

  **react-components (breaking)**

  - `AppearanceProvider`/`useAppearance` replace `ThemeProvider`/`useTheme`. One provider now owns all three appearance axes as a single persisted preference (default localStorage key `"appearance"`): `mode` (light/dark, still the `.dark` class), `brand` (sets `data-brand` on `<html>`), and `layout` (which `AppShellLayout` arrangement renders). Config: `defaultMode`, `brands` (the `BrandOption[]` the app ships CSS for), `defaultBrand`, `defaultLayout`, `storageKey`.

    Migration — every removed export and its replacement:
    - `ThemeProvider` → `AppearanceProvider` (prop renames: `defaultTheme` → `defaultMode`; `storageKey` now stores a JSON object, so stored plain `"dark"`/`"light"` strings from the old provider are ignored once and users re-pick).
    - `useTheme()` → `useAppearance()` (`theme` → `mode`, `toggle` → `toggleMode`).

  - `AppShellLayout` gains `layout?: "sidebar" | "topnav"` (default `"sidebar"`, the previous arrangement): `topnav` renders the same slots as a single top bar (brand + horizontal nav + header slots) over a full-width content well. `appShellLayoutKinds`/`AppShellLayoutKind` are exported; `appShellLayoutVariants` now takes `{ layout }` (calling it with no arguments still returns the sidebar base).
  - New `BrandSelect` (brand picker fed by the ambient provider; renders nothing for single-brand apps) and `LayoutToggle` (one-click sidebar ⇄ topnav flip). `AppShell` mounts `BrandSelect`, `LayoutToggle`, and `ThemeToggle` in the header and follows the ambient `layout`.
  - `createAppRoot` accepts `appearance?: AppearanceConfig` and mounts `AppearanceProvider` in place of `ThemeProvider`.

### Patch Changes

- @bota-apps/react-ui@0.3.3

## 0.4.0

### Minor Changes

- 1e354d6: react-components app-runtime layer: page-state machinery, routing surfaces, feature-tree navigation, shell menus, the feature bridge, and a generic audit log.

  **types / fm**

  - `ResolvedFeature` gains `meta` — the node's free-form metadata now passes through the resolver, so nav builders and feature cards read icons (`meta.icon`) straight off resolved nodes.

  **react-components**

  - Page machinery: `PageContainer` — one discriminated `PageState` (`ready`/`loading`/`error`/`empty`) drives the whole page body, plus document title, breadcrumb slot, header (heading/description/metadata/`menuActions`/`headerRight`), footer visibility rules, optional `featureId` (establishes the ambient feature scope) and `layout="fixed"`. `derivePageState` maps React Query list state to a `PageState` (stale-data warning included); `SuspensePageContainer` wraps suspending pages with loading/error PageContainer fallbacks.
  - Routing: `RouteLink` — the typed TanStack Router `Link` behind the react-ui link visuals (`side-bar-nav-link`, `text`, `quick-link`), `RoutePath` + `toRoutePath` (the single sanctioned boundary from untyped route strings), and `NotFound`/`RouteError` to wire as the router's `defaultNotFoundComponent`/`defaultErrorComponent` (copy overridable, English defaults).
  - Breadcrumbs: `BreadcrumbItemsProvider` + `useBreadcrumbItems` (built from active route matches via `staticData.breadcrumb`, translator injectable, `loaderData.breadcrumbLabel` overrides for dynamic labels) and `Breadcrumbs` (`pill`/`slash`/`highlighted`, middle crumbs collapse behind an overflow menu on narrow viewports).
  - Feature-tree navigation: `buildNavFromTree` (gated: hidden pruned at every level, blocked advertised), `buildNavFromDefs` (static route⇄id map), `getActiveNavId` (exact match, then longest prefix), `getNavigationSections`, `translateNavItems`, and `createAppNavigation` binding the registry into `useNavigationItems`/`useAppNavigation`/`useChildNavigationItems`. Icons/sections come from the node's `meta.icon`/`meta.section`.
  - Shell surfaces: `ThemeToggle` (ambient ThemeProvider), `LanguageToggle` (language list + value injected — no i18n-library dependency), `UserMenu` (identity and sign-out from the ambient auth client, `children` slot for menu content), `OrgSwitcherMenu` (organizations are data-injected and generic over the app's API-owned type; `onSelect` receives the typed organization back — pair with `useAuth().switchOrganization`).
  - Feature bridge: `FeaturePageGuard` (hidden → 404 — don't advertise; blocked → upgrade/setup screen with copy derived from the blocking collector (`plan:`/`limit:`/`setup:`), `copy`/`onCta` overridable) and `FeatureCard` (nav-hub card resolved from the feature node; blocked features get a badge).
  - Actions: `PageActions`, `RowActions`, `RowActionButton`, `EditAction`, `DeleteAction` (confirm-dialog-gated).
  - Audit log: `EntityAuditLog` + `AuditEntryDetail`, generic over the app's API-owned audit entry type (minimal structural constraint — the entry passed in is what `onEntryClick` returns), action presentation injectable via `formatAction` (humanized English defaults), and `valueType` render hints (`currency`/`number`/`phone`/`date`/`boolean`/`enum`) that fall back to plain text when the value doesn't match — never a fabricated default.

### Patch Changes

- Updated dependencies [1e354d6]
  - @bota-apps/types@0.5.0
  - @bota-apps/fm@0.4.0
  - @bota-apps/auth-client@0.4.1
  - @bota-apps/react-ui@0.3.2
  - @bota-apps/schema-utils@0.4.1
  - @bota-apps/hooks@0.3.1

## 0.3.1

### Patch Changes

- Updated dependencies [fd42c7e]
  - @bota-apps/auth-client@0.4.0
  - @bota-apps/fm@0.3.0
  - @bota-apps/hooks@0.3.0
  - @bota-apps/react-ui@0.3.1

## 0.3.0

### Minor Changes

- 8547b92: Per-component module structure and a complete variants surface.

  Every visual component now lives in its own directory (`index.tsx` + `variants.ts` + colocated story and test) and **exposes its cva variants publicly**: consumers can import `<name>Variants` (e.g. `dialogContentVariants`, `selectTriggerVariants`, `statCardVariants`, `navItemVariants`) from the package barrel, plus `VariantProps`-derived unions where useful. Existing exported names (`buttonVariants`, `badgeVariants`, `toggleVariants`, `sidebarMenuButtonVariants`, `navigationMenuTriggerStyle`, …) are unchanged.

  Also:

  - New `@bota-apps/react-ui/form` subpath export — the react-hook-form integration was documented as deep-importable but never declared in `exports`; published consumers can now actually resolve it.
  - `LoadingBusiness` is now exported under its own name (it previously shadowed `Loading` internally).
  - Import specifiers are unchanged — the package barrels re-export the same names from the same entry points; no consumer action needed beyond the removals listed in the fresh-library-cleanup changeset.

- 4a77030: `ThemeProvider` is now SSR-safe and configurable: it no longer touches `localStorage`/`matchMedia` during server render (hydrates with the default and applies the persisted choice client-side), tolerates blocked storage (privacy mode), and accepts `defaultTheme` and `storageKey` props. Defaults (`"light"`, `"theme"`) preserve existing behavior.

### Patch Changes

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.

- 1bf0fca: Review fixes across the packages.

  **tailwind-preset**

  - Opacity modifiers work on numeric ramp shades again: `bg-primary-500/20` and friends compiled to nothing because Tailwind v3 cannot parse `var()` colors with space-separated fallbacks. The ramp defaults now live as `--primary-50..900` / `--secondary-50..900` / `--accent-50..900` variables in `theme.css` (rebrand by redefining them) and the preset references them without inline fallbacks.

  **schema-utils** (breaking on 0.x — released as minor per repo policy)

  - `createCurrencyFormatter` fails fast instead of limping on fake values: a custom code set now requires its own `currencies` registry (enforced by overloads), and formatting or labelling a code missing from the registry throws instead of rendering placeholder metadata.
  - Non-ISO custom codes (`USDT`, anything not three letters) no longer crash `Intl.NumberFormat` — they render symbol-prefixed.
  - `Intl.NumberFormat` instances are cached per locale/options, so per-cell `CurrencyText` rendering stops re-resolving locale data on every call.
  - `CurrencyDefinition` is now derived from `CurrencyInfo` (same shape, open `code`).

  **auth-client**

  - Fixed three auth-state races: a superseded in-flight session resolution can no longer overwrite the state written by a newer `refresh()`, a slow `getUser()` response can no longer re-authenticate the store after `logout()`, and a stale failure no longer clears a newer refresh's cached resolution.
  - `UseAuthResult` (the return type of `useAuth`) is exported from the package barrel.

  **react-ui**

  - The chart cva variants (`barChartVariants`, `lineChartVariants`, `areaChartVariants`, `pieChartVariants`) are now actually reachable from `@bota-apps/react-ui/charts` and the root barrel.
  - `DynamicForm` no longer crashes when a validation message key is passed explicitly `undefined` (e.g. from an optional translator) — it falls back to the English default per key.
  - `formatRelativeTime` caches its `Intl.RelativeTimeFormat` instances.

  **react-components**

  - `ThemeProvider` memoizes its context value, so `useTheme` consumers stop re-rendering on unrelated parent re-renders.

- Updated dependencies [4a77030]
- Updated dependencies [8547b92]
- Updated dependencies [945096b]
- Updated dependencies [959f6a4]
- Updated dependencies [8547b92]
- Updated dependencies [55d906b]
- Updated dependencies [5237cf9]
- Updated dependencies [76d5c75]
- Updated dependencies [2d71b67]
- Updated dependencies [3659ce3]
- Updated dependencies [1bf0fca]
  - @bota-apps/auth-client@0.3.0
  - @bota-apps/react-ui@0.3.0
  - @bota-apps/gql-client@0.2.1
  - @bota-apps/fm@0.2.1
  - @bota-apps/hooks@0.2.1
