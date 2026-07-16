---
"@bota-apps/hooks": minor
---

Add `useGqlSubscription(document, { variables, enabled, onData, onError })` — consumes GraphQL subscriptions over SSE through the context client. Opens on mount and on document/variable change, aborts the stream on unmount, reconnects after transport failures with exponential backoff (capped at 15s), and treats a server-sent `complete` (or `enabled: false`) as terminal. Returns `{ status: "idle" | "connecting" | "open" | "closed" }`.
