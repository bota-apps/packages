# @bota-apps/mocks

## 0.3.0

### Minor Changes

- 9d18b35: `createMockGraphQLClient` now returns a `SubscribableGraphQLClient` — the exact type `createGraphQLClient` returns. The new `subscribe` capability executes GraphQL subscriptions in-process against the provided schema's real subscription resolvers, mirroring the SSE transport's observable behavior: subscribe-time failures arrive as a single error result followed by completion, aborting the signal rejects the pending read with an `AbortError`, and every payload crosses a JSON boundary like a wire result. `overrides` widens to `Partial<SubscribableGraphQLClient>`, so a scripted `subscribe` stream can be injected per test.

## 0.2.0

### Minor Changes

- e0c87b3: Add a GraphQL double and a generic override escape hatch.

  - `createMockGraphQLClient({ schema, rootValue, contextValue, endpoint, overrides })` — a real `graphql-request` `GraphQLClient` (the exact type the hooks call `rawRequest` on) whose `fetch` executes each operation in-process against a consumer-supplied executable schema. No network, no cast; tests run real documents against the real resolvers.
  - `createMockAuthClient` gains an `overrides?: Partial<AuthClient<TUser>>` option, merged last — replace any subset of the client surface (spy on `loginUrl`, make `refresh` reject) while keeping the faithful default for the rest, or pass every member for a full replacement. `createMockGraphQLClient` takes the same `overrides` against the real `GraphQLClient` shape.

## 0.1.5

### Patch Changes

- Updated dependencies [233fc86]
  - @bota-apps/types@0.10.0

## 0.1.4

### Patch Changes

- Updated dependencies [a7c25fd]
  - @bota-apps/types@0.8.0

## 0.1.3

### Patch Changes

- Updated dependencies [f5de1e2]
  - @bota-apps/types@0.7.0

## 0.1.2

### Patch Changes

- Updated dependencies [2e4156b]
  - @bota-apps/types@0.6.0

## 0.1.1

### Patch Changes

- Updated dependencies [1e354d6]
  - @bota-apps/types@0.5.0

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

### Patch Changes

- Updated dependencies [fd42c7e]
  - @bota-apps/types@0.4.0
