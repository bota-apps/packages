# @bota-apps/mocks

In-memory doubles for tests and stories, one directory per module they stand in
for. Every mock returns the **real** client type — `createMockAuthClient`
returns `AuthClient`, `createMockGraphQLClient` returns a real `graphql-request`
`GraphQLClient` — so it can be handed to anything that accepts the production
client, with no cast.

Two override models, on every mock:

- **Behavioral options** seed the common cases (a starting user, a schema to
  execute against).
- **`overrides`** is the escape hatch: a `Partial<T>` of the real client shape,
  applied **last**. Override one member (make `refresh` reject, spy on a call) and
  keep the faithful default for the rest — or pass every member for a full
  replacement. Because it's typed against the real client, an override that
  doesn't match the shape is a compile error.

## `createMockAuthClient({ user, state, loginUrl, resolveSwitch, overrides })`

An in-memory `AuthClient` (no fetch, no navigation). Pass `resolveSwitch` to
simulate how the API-owned user changes when `switchOrganization` re-resolves the
session. `requireSession` resolves even when unauthenticated (it cannot
navigate) — assert on state instead.

```ts
const auth = createMockAuthClient({ user });
const flaky = createMockAuthClient({
  user,
  overrides: { refresh: () => Promise.reject(new Error("offline")) },
});
```

## `createMockGraphQLClient({ schema, rootValue, contextValue, endpoint, overrides })`

A real `GraphQLClient` whose `fetch` is swapped for an in-process executor that
runs each operation against `schema` (pass the app's in-memory schema — e.g. the
one the mock backend is built from). Tests exercise the real generated documents
against the real resolvers, not per-test response stubs. `contextValue` may be a
factory to derive per-request context (e.g. an authenticated viewer).

```ts
const client = createMockGraphQLClient({ schema: mockSchema, rootValue });
const data = await client.request(DepartmentsDocument);
```
