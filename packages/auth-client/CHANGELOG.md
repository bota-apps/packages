# @bota-apps/auth-client

## 0.6.1

### Patch Changes

- Updated dependencies [233fc86]
  - @bota-apps/types@0.10.0

## 0.5.0

### Minor Changes

- a7c25fd: Organization conveniences and the org-scoped route guard:

  - `useCurrentOrganization()` — the authenticated user's active organization; throws without an authenticated, org-carrying session.
  - `useSwitchOrganization()` — stable callback over the client's `switchOrganization`.
  - `requireAppContext(context)` — `beforeLoad` guard: `requireSession()`, then requires `currentOrg` on the session user, resolving `{ currentUser, currentOrg }`; an org-less session is handed to the login flow with the never-resolving redirect contract.
  - Types: `RootContext<TQueryClient = unknown>` (the `queryClient` slot is a pass-through — supply your own type, e.g. `RootContext<QueryClient>`), `AppContext`, and `RegisteredCurrentOrganization` — the org type inferred from the registered user's `currentOrg` field (`AuthRegister` in `@bota-apps/types/auth`); `never` until an app registers a user type that declares it.

### Patch Changes

- Updated dependencies [a7c25fd]
  - @bota-apps/types@0.8.0

## 0.4.3

### Patch Changes

- Updated dependencies [f5de1e2]
  - @bota-apps/types@0.7.0

## 0.4.2

### Patch Changes

- Updated dependencies [2e4156b]
  - @bota-apps/types@0.6.0

## 0.4.1

### Patch Changes

- Updated dependencies [1e354d6]
  - @bota-apps/types@0.5.0

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

### Patch Changes

- Updated dependencies [fd42c7e]
  - @bota-apps/types@0.4.0

## 0.3.0

### Minor Changes

- 4a77030: Distinguish transport failures from "logged out", and make the session re-resolvable.

  - A failed session request (network down, 5xx) now yields `status: "error"` with the error in `AuthState.error`, instead of silently reporting `unauthenticated`. Only a real 401 maps to `unauthenticated`. **Breaking for exhaustive `AuthStatus` switches** — handle the new `"error"` member.
  - `requireSession()` throws the session error instead of redirecting to login when resolution failed, so app error boundaries can show a retry state rather than bouncing users through login on a flaky network.
  - Failed resolutions are no longer cached: the next `ensureReady()` retries. `logout()` also clears the cached resolution so `ensureReady()` re-resolves after a later re-login.
  - New `refresh()` on the store/client to force re-resolution (e.g. after profile changes).

- 945096b: Discriminated-union state contracts (breaking on 0.x — released as minor per repo policy).

  **auth-client**

  `AuthState` is now a discriminated union on `status` instead of a single type with optional fields. Narrowing the status narrows the payload: `user` is a `User` (never `undefined`) exactly when `status === "authenticated"`, and `error` is a required `Error` that exists exactly when `status === "error"`. The members are exported by name — `AuthPendingState`, `AuthenticatedState`, `UnauthenticatedState`, `AuthErrorState` — and `AuthStatus` is now derived (`AuthState["status"]`, same union as before).

  Migration: code that read `state.error` without checking `status` must narrow first (`if (state.status === "error") { state.error }`); code constructing an `AuthState` literal must match one member exactly (e.g. an authenticated state can no longer omit `user`).

  **react-ui**

  `useCopyToClipboard` reports `error` as `Error | undefined` instead of `Error | null` (repo-wide prefer-`undefined` rule). Replace `error === null` checks with `error === undefined` (or just truthiness).

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

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.

- 2d71b67: Fix publish-surface issues surfaced by `arethetypeswrong` (now enforced in CI alongside `publint`).

  - **auth-client**: the emitted `d.ts` for `useAuth` contained a synthesized `import("..")` directory specifier that Node16 ESM consumers cannot resolve; `useAuth` now has an explicit `UseAuthResult` return type (also a nicer public type to reference).
  - **tailwind-preset / react-ui**: the `./preset` and `./postcss` subpath exports now ship type declarations — TypeScript `tailwind.config.ts` files get typed imports instead of `any`.

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

- Updated dependencies [c4f1875]
- Updated dependencies [8547b92]
- Updated dependencies [76d5c75]
  - @bota-apps/types@0.3.0
