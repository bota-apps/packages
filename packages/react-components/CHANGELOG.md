# @bota-apps/react-components

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
