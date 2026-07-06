# @bota-apps/gql-client

A tiny cookie-credentialed GraphQL client factory built on
[`graphql-request`](https://github.com/jasonkuhrt/graphql-request).
`createGraphQLClient(endpoint)` returns a client whose every request carries the
`HttpOnly` session cookie — the SPA never reads or holds a token.

## Install

```bash
pnpm add @bota-apps/gql-client
# depends on graphql + graphql-request (installed transitively)
```

## Usage

```ts
import { createGraphQLClient, gql } from "@bota-apps/gql-client";

const client = createGraphQLClient("https://api.example.com/graphql");

const data = await client.request(gql`
  query Me {
    me {
      id
      name
    }
  }
`);
```

`createGraphQLClient(endpoint)` returns a `GraphQLClient` configured with
`credentials: "include"`. That single option is the whole point of cookie-based
auth: every request carries the `HttpOnly` session cookie the server set at
login, so the SPA never reads, stores, or forwards a bearer token.

### Endpoint must be absolute

`endpoint` must be an **absolute** URL. `graphql-request` builds a
`new URL(endpoint)` internally, which throws on a bare relative path such as
`/graphql`. The URL comes straight from app config — this package stays
platform-agnostic and makes no assumptions about the host environment:

```ts
const client = createGraphQLClient(appConfig.apiUrl); // e.g. graphqlAppEnv.apiUrl
```

### Typed documents

The returned value is a standard `graphql-request` `GraphQLClient`, so it works
with `TypedDocumentNode` documents (for example those emitted by
[`@bota-apps/gql-codegen`](../gql-codegen)) for end-to-end type inference, and
composes directly with the React Query pipelines in
[`@bota-apps/hooks`](../hooks):

```ts
const result = await client.request(EmployeesDocument); // fully typed
```

## API

| Export                | What                                                                       |
| --------------------- | -------------------------------------------------------------------------- |
| `createGraphQLClient` | `(endpoint: string) => GraphQLClient` — cookie-credentialed client factory |
| `gql`                 | Re-export of the `gql` template tag from `graphql-request`                 |
| `GraphQLClient`       | Re-exported **type** from `graphql-request` for annotating client values   |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
