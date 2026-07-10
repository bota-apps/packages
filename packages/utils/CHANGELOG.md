# @bota-apps/utils

## 0.3.2

### Patch Changes

- 38fd879: Documentation and sample-data wording cleanup (JSDoc, changelog entries, test fixtures). No runtime or API changes.

## 0.3.1

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.

## 0.2.0

### Minor Changes

- 1966215: New `./url` subpath — subdomain-per-tenant URL utilities migrated from the legacy app monorepo's web-utils package:

  - `getSubdomain(prodDomain, localDomain, hostname?)` — extracts the tenant subdomain from a hostname (defaults to `window.location.hostname`); throws when none is present.
  - `buildSubdomainUrl(subdomain, prodDomain, localDomain, pathname?, location?)` — builds the URL for a subdomain, preserving the current protocol and non-default port. The location source is injectable (`UrlLocation`), defaulting to `window.location`.

  Both domains are always parameters — nothing app-specific is baked in.

## 0.1.0

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
