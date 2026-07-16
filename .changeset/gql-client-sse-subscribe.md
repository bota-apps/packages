---
"@bota-apps/gql-client": minor
---

Add GraphQL subscription support over Server-Sent Events. `subscribeGraphQLSse(endpoint, { query, variables, signal })` POSTs the operation with `Accept: text/event-stream` and cookie credentials, parses the `next`/`complete` events of the GraphQL-over-SSE protocol with a dependency-free frame parser, and yields `ExecutionResult`s as an async iterator with `AbortSignal` cancellation. `createGraphQLClient` now returns a `SubscribableGraphQLClient` — the same graphql-request client plus a `subscribe` method bound to the construction endpoint.
