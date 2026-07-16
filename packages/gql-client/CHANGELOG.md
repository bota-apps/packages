# @bota-apps/gql-client

## 0.3.0

### Minor Changes

- 3dc31c8: Add GraphQL subscription support over Server-Sent Events. `subscribeGraphQLSse(endpoint, { query, variables, signal })` POSTs the operation with `Accept: text/event-stream` and cookie credentials, parses the `next`/`complete` events of the GraphQL-over-SSE protocol with a dependency-free frame parser, and yields `ExecutionResult`s as an async iterator with `AbortSignal` cancellation. `createGraphQLClient` now returns a `SubscribableGraphQLClient` — the same graphql-request client plus a `subscribe` method bound to the construction endpoint.

## 0.2.2

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.

## 0.2.1

### Patch Changes

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.
