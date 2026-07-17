---
"@bota-apps/mocks": minor
---

`createMockGraphQLClient` now returns a `SubscribableGraphQLClient` — the exact type `createGraphQLClient` returns. The new `subscribe` capability executes GraphQL subscriptions in-process against the provided schema's real subscription resolvers, mirroring the SSE transport's observable behavior: subscribe-time failures arrive as a single error result followed by completion, aborting the signal rejects the pending read with an `AbortError`, and every payload crosses a JSON boundary like a wire result. `overrides` widens to `Partial<SubscribableGraphQLClient>`, so a scripted `subscribe` stream can be injected per test.
