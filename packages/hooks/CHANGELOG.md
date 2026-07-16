# @bota-apps/hooks

## 0.6.0

### Minor Changes

- 3dc31c8: Add `useGqlSubscription(document, { variables, enabled, onData, onError })` — consumes GraphQL subscriptions over SSE through the context client. Opens on mount and on document/variable change, aborts the stream on unmount, reconnects after transport failures with exponential backoff (capped at 15s), and treats a server-sent `complete` (or `enabled: false`) as terminal. Returns `{ status: "idle" | "connecting" | "open" | "closed" }`.

### Patch Changes

- Updated dependencies [3dc31c8]
  - @bota-apps/gql-client@0.3.0

## 0.5.4

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
  - @bota-apps/fm@0.8.2
  - @bota-apps/gql-client@0.2.2

## 0.5.3

### Patch Changes

- Updated dependencies [11a8bb6]
  - @bota-apps/fm@0.8.0

## 0.5.1

### Patch Changes

- Updated dependencies [a7c25fd]
  - @bota-apps/fm@0.6.0

## 0.5.0

### Minor Changes

- d610db4: `useGqlQuery`/`useGqlSuspenseQuery`/`useGqlMutation` now unwrap the document's single root field: `data` is the field's value directly (`Department[]`, `Department | null`) instead of the response envelope, and the cache stores the unwrapped value. Documents must select exactly one root field (asserted at first use). Breaking for 0.4 callers that read `data.<field>`.

## 0.4.0

### Minor Changes

- a1055ec: Add document-generic GraphQL hooks: `useGqlQuery`, `useGqlSuspenseQuery`, `useGqlMutation`, and the `gqlQueryKey` helper. The document is the operation — hooks derive the query key from the operation name (`[name]` / `[name, variables]`), return the response envelope exactly as the API returns it (no root-field unwrapping, no synthetic not-found errors), and mutations take explicit `invalidates` keys. Adds a `graphql` peer dependency (for `print`) and `@graphql-typed-document-node/core` (types).

## 0.3.2

### Patch Changes

- Updated dependencies [2e4156b]
  - @bota-apps/fm@0.5.0

## 0.3.1

### Patch Changes

- Updated dependencies [1e354d6]
  - @bota-apps/fm@0.4.0

## 0.3.0

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
  - @bota-apps/fm@0.3.0

## 0.2.1

### Patch Changes

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.

- Updated dependencies [76d5c75]
  - @bota-apps/gql-client@0.2.1
  - @bota-apps/fm@0.2.1
