# @bota-apps/types

## 0.10.2

### Patch Changes

- 627fd1d: Make the marketplace taxonomy app-extensible. `AppMarketplaceCategory` is no longer a closed union: it resolves to `DefaultAppMarketplaceCategory` (the unchanged platform five: `tasks | projects | compliance | reporting | integrations`) plus whatever an app registers via declaration merging on the new `FmRegister` slot — the same mechanism as `AuthRegister`:

  ```ts
  declare module "@bota-apps/types/fm" {
    interface FmRegister {
      marketplaceCategory: "crm" | "billing";
    }
  }
  ```

  Unregistered apps see exactly the previous five members — nothing narrows or breaks. New exports from `@bota-apps/types/fm`: `DefaultAppMarketplaceCategory`, `FmRegister`, `RegisteredMarketplaceCategory<TRegister = FmRegister>`. `@bota-apps/fm` re-exports the new type names (except `FmRegister` — augmentation must target the declaring module, `"@bota-apps/types/fm"`).

## 0.10.1

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.

## 0.10.0

### Minor Changes

- 233fc86: Remove the now-unused `AppConfig` / `SiteConfig` config contracts. They are superseded by `graphqlAppEnv` in `@bota-apps/app-config`, whose inferred `GraphqlAppEnv` type is self-contained.

## 0.8.0

### Minor Changes

- a7c25fd: Port the app-manifest layer and tree type extractors from the legacy features package.

  `@bota-apps/types/fm` (re-exported by `@bota-apps/fm`):

  - Tree type extractors next to `ExtractFeatureIds`: `ExtractResourceIds`, `ExtractFlagKeys`, `ExtractLimitKeys`, `ExtractSetupKeys`, plus `FeatureTypeMap<Tree>` bundling all five unions. The extractors read fm's flat node keys (`flag`/`limit`/`setup`), not the legacy `constraints.*` shape, and `FeatureTypeMap` is now generic over the tree literal instead of a wide standalone map.
  - App-manifest shapes: `AppManifest`, `AppFeatureContribution`, `AppPermissionDescriptor`, `AppMarketplaceCategory`, `AppMarketplacePrice`, `AppPage`, `AppNavEntry`.

  `@bota-apps/fm` runtime:

  - `resolveLucideIcon(name)` — icon-name → Lucide component (new `lucide-react` dependency).
  - `appManifestToFeature(manifest)` / `appManifestToContribution(manifest)` — manifest → flag-gated feature subtree; the subtree gates on `flag` (legacy `constraints.flagKey`).
  - `mountAppContributions(root, contributions)` — grafts contributions at each `mountUnder` node (the legacy apps-layer `composeFeatureTree`; fm's root-appending `composeFeatureTree` is unchanged). It returns the composed tree directly and THROWS on an unknown mount id instead of warn-and-skip; duplicate ids surface via `createFeatureRegistry`.
  - `useFeatureSetup(input)` — builds the memoized `FeatureGateContext` for `FeatureProvider`: flattens the API-pruned resource tree into `permissions` and passes `flags`/`planFeatures`/`reachedLimits`/`approachingLimits`/`completedSetup` through (replacing the legacy `capabilities` object).

## 0.7.0

### Minor Changes

- f5de1e2: Add `"Money"` to the `DomainScalar` union so generated domain definitions can
  describe Money-typed entity fields (rendered with the `currency` widget).
  Exhaustive `switch`es over `DomainScalar` gain one case.

## 0.6.0

### Minor Changes

- 2e4156b: Feature annotations: a warning channel, lifecycle labels, and derived renderable gating facts — the generic surface feature-decoration UI (badges, banners, status dots, upgrade CTAs) builds on.

  **types (fm shapes)**

  - `CollectorVerdict.status` now also accepts `"warning"`: a warning verdict never changes the feature's `FeatureStatus` — its reasons surface separately for advisory UI (approaching limits, expiring trials, …).
  - `FeatureGateContext` gains `approachingLimits?: readonly string[]` — usage-limit keys nearing exhaustion.
  - `FeatureNodeDef` gains `labels?: readonly FeatureLabelKind[]` (new type: `"beta" | "new" | "comingSoon" | "deprecated" | "preview" | "addon"`) — lifecycle badges passed through to the resolved feature.
  - `ResolvedFeature` gains two required fields: `warnedBy: readonly string[]` (namespaced warning reasons) and `labels: readonly FeatureLabelKind[]`. **Migration:** code constructing `ResolvedFeature` literals (test doubles, custom resolvers) must add both — `warnedBy: []`, `labels: []` preserves the old behavior.
  - New `FeatureAnnotation` type: `{ severity: "blocking" | "warning"; collector; reason; detail }` — one renderable gating fact.

  **fm (runtime)**

  - The resolver accumulates warning verdicts into `warnedBy` (never escalating status) and passes node `labels` through.
  - `limitCollector` now warns (without gating) when a node's limit key is in `approachingLimits`, and still blocks when it is in `reachedLimits` (reached wins).
  - New `deriveFeatureAnnotations(feature)` — splits `blockedBy`/`warnedBy` namespaced reasons into `FeatureAnnotation`s, blocking first; apps map `collector` to copy and use `detail` to key app-side data lookups (e.g. usage numbers).
  - New `featureLabelKinds` — the full label vocabulary, for typed kind→variant maps.
  - New `useFeatureAnnotations(featureId?)` react hook — `deriveFeatureAnnotations` over the ambient or given feature.

## 0.5.0

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

## 0.4.0

### Minor Changes

- fd42c7e: Platform foundations: API-owned user schema (generic auth), feature-gating collectors, a utils package, and a mocks package (breaking on 0.x — released as minor per repo policy).

  **Design rule codified: domain schemas are owned by the API.** Packages never define types the API provides (users, organizations, audit entries, pagination envelopes); they are generic over them and declare only the minimal structural constraints they rely on.

  **New: `@bota-apps/utils`** — framework-free utility modules, one subpath per concern:

  - `./type` — the `Equal`/`Expect` type-assertion helpers (moved from the removed `@bota-apps/types/testing` subpath).
  - `./time` — the date formatting presets (moved from the removed `@bota-apps/schema-utils/dates` subpath; same function names).
  - `./number` — `formatNumber` (moved from the schema-utils main entry).

  **New: `@bota-apps/mocks`** — in-memory doubles for tests/stories, organized by module (`src/auth/…`), depending only on `@bota-apps/types` (shapes, no runtime packages). `createMockAuthClient` returns the REAL `AuthClient` type (no extra test-only surface), starts from a `user` or full `state`, and simulates organization switching through an app-provided `resolveSwitch(organizationId, user)` mapping — the mock doesn't presume any user schema.

  **types**

  - **BREAKING:** `User`/`UserRole` removed — the user type is API-owned.
  - New `./auth` subpath — the auth contract SHAPES, mirroring the fm shape/runtime split: `SessionUser` (the minimal constraint the runtime expects on the session user: `id`, `name`, `email`), `AuthRegister`/`RegisteredAuthUser`, `AuthState` and its members, `AuthStore`, `AuthClient`, `SessionEndpoint`, `SessionPaths`. Shape-only consumers (e.g. mocks) depend on `types` alone.
  - **BREAKING:** the `./testing` subpath is removed — import `Equal`/`Expect` from `@bota-apps/utils/type`.

  **auth-client**

  - The whole surface is now generic over the app's API-owned user type: `AuthState<TUser>`, `AuthStore<TUser>`, `SessionEndpoint<TUser>`, `AuthClient<TUser>`, `createAuthClient<TUser>` (all constrained to `SessionUser`). The shapes live in `@bota-apps/types/auth` (re-exported here for convenience); the package keeps only the runtime. Register the app's user type once via declaration merging — `declare module "@bota-apps/types/auth" { interface AuthRegister { user: ApiUser } }` — and every surface (including `useAuth`) is typed with it app-wide, no generics at call sites.
  - **BREAKING:** `SessionPaths` gains a required `switchOrganization` path (default `/bff/switch-organization`). `AuthStore`/`AuthClient`/`useAuth` gain `switchOrganization(organizationId)` — re-targets the session on the host/BFF, then re-resolves the user (superseding any in-flight resolution; a failed switch leaves the current state untouched). Organization data itself lives on the app's registered user type.

  **schema-utils**

  - **BREAKING:** the `./dates` subpath moved to `@bota-apps/utils/time`, and `formatNumber` moved to `@bota-apps/utils/number` (same names).

  **fm**

  - Gating collectors land (the resolver's "phase 5"): `flagCollector`, `permissionCollector` (hide — don't advertise), `planCollector`, `limitCollector`, `setupCollector` (block — advertise but gate). Generic collectors only — app-specific policies (billing, compliance, region, …) are app-defined `FeatureCollector`s passed via `FeatureProvider`'s new `collectors` prop. Gated nodes fail closed against the app-provided `FeatureGateContext` (`context` prop).
  - `FeatureNodeDef` gains declarative gating keys (`flag`, `planFeature`, `limit`, `setup` — alongside the existing `permissions`); new shapes `FeatureGateContext`, `FeatureCollector`, `CollectorVerdict`, `ResolvedFeatureNode`.
  - New hooks `useFeature`, `useFeatureStatus`, `useFeatureChildren`, `useFeatureTree`, and the unstyled `FeatureGate` component (`whenBlocked`/`whenHidden` render slots). `useFeatureScope` is gating-aware, with ancestor verdicts cascaded in (a page inside a hidden module is hidden).
  - New tree utilities: `resolveFeaturePath`, `resolveFeatureTree`, `composeFeatureTree`; `FeatureRegistry` gains `getPath` and now **throws on duplicate feature ids** instead of silently overwriting.

  **hooks**

  - New `usePaginatedQueryPipeline` — a query pipeline for paginated lists that keeps the previous page's data as placeholder while the next page loads.

  **react-ui**

  - Internal: date formatting now comes from `@bota-apps/utils/time` (no API change).

## 0.3.0

### Minor Changes

- 8547b92: Remove all deprecated/back-compat API (breaking on 0.x — released as minor per repo policy).

  **react-ui**

  - `DashShell` removed — compose `SidebarProvider + Sidebar + SidebarInset` instead. Its context surface (`DashShellContext`, `useDashShellContext`, `FIXED_LAYOUT`) is removed with it and has no replacement: the sidebar layout no longer needs a fixed-layout marker, so drop those calls.
  - `useIsMobile` removed — use `useBreakpoint().below("md")`.
  - `Text`'s deprecated `format` prop removed — use `<DateTime variant="…" value={…} />`. The `TextFormat` type is removed with it (use `DateTimeVariant`), and the `fmtDate`/`fmtTime`/`fmtDateRange` helpers are now private to the `dateTime` module — for standalone date formatting use `@bota-apps/schema-utils`' `formatDate`/`formatDateShort`.
  - Legacy `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` compat primitives removed — use the props-driven `Card` API (`title`, `description`, `footer`, `children`).
  - The raw `CardContentEl`/`CardSectionEl`/`CardFooterEl` html-layer primitives are removed with them — compose `CardEl` with your own layout, or use the `Card` API.

  **types / schema-utils**

  - `labelAm` removed from `CurrencyInfo`/`CurrencyDefinition` and the currency registry — resolve localized labels via `getCurrencyLabel(code, t)` / `formatter.getLabel(code, t)`.

  **auth-client**

  - `DEFAULT_SESSION_PATHS` renamed to `defaultSessionPaths` (repo-wide camelCase-constants rule).

### Patch Changes

- c4f1875: Currency formatting is now injectable while keeping the Ethiopian-market defaults.

  - New `createCurrencyFormatter(config?)` factory: bring your own currency registry (any ISO 4217 codes, not just the default union) and locale policy. Factory-built formatters honour each currency's own `locale` metadata (previously dead — everything formatted as "en"); pass `locale` to force one output locale. Unknown codes format via Intl instead of crashing.
  - The module-level `formatCurrency`/`formatMoney`/… exports are unchanged in behavior: the default instance stays pinned to the "en" output locale so existing rendering is stable.
  - New `getCurrencyLabel(code, t?)` resolves display labels through an injected translator (`currency.${code}` key) with registry-label fallback, following the schema-utils/i18n pattern. `CurrencyInfo.labelAm` is deprecated in favor of this.
  - Fixed the `formatCurrency` JSDoc example (actual default output is `"ETB 1,145,000.00"`, not `"Br 1,145,000.00"`); behavior is now locked by tests.

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.
