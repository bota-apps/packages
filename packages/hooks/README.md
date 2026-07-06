# @bota-apps/hooks

The generic data layer for `@bota-apps` apps: a configured React Query client
wired to the feature error tracker, the GraphQL client context/provider, and
typed query/mutation pipeline wrappers. **Domain hooks stay in each app** (built
on these) — this package ships only the generic plumbing.

## Install

```bash
pnpm add @bota-apps/hooks
# peers: @tanstack/react-query, react, graphql
```

## Usage

### Provide the clients near the app root

`QueryProvider` mounts the shared `queryClient`; `GraphQLProvider` puts a
[`@bota-apps/gql-client`](../gql-client) `GraphQLClient` on context so the
`useGql*` hooks and `useGraphQLClient()` can reach it.

```tsx
import { QueryProvider, GraphQLProvider } from "@bota-apps/hooks";
import { createGraphQLClient } from "@bota-apps/gql-client";

const client = createGraphQLClient("https://api.example.com/graphql");

<QueryProvider>
  <GraphQLProvider client={client}>{children}</GraphQLProvider>
</QueryProvider>;
```

### Typed operations with the `useGql*` hooks

Pass a `TypedDocumentNode` (e.g. from [`@bota-apps/gql-codegen`](../gql-codegen))
and the field result type is inferred. `useGqlQuery` unwraps the single root
field for you, and `gqlQueryKey` derives a stable query key from the document +
variables:

```ts
import { useGqlQuery, useGqlMutation } from "@bota-apps/hooks";

export function useProjects() {
  return useGqlQuery(ProjectsDocument); // UseQueryResult<Project[], Error>
}

export function useProject(id: string) {
  return useGqlQuery(ProjectDocument, { id }); // variables passed positionally
}

export function usePromoteProject() {
  return useGqlMutation(PromoteProjectDocument, {
    invalidates: [["projects"]], // shorthand for meta.invalidates
  });
}
```

### Build a domain hook on the raw pipelines

When you need a bespoke `queryFn`, use the pipelines directly. They forward
failures to the feature tracker and honour `meta.featureId` / `meta.invalidates`:

```ts
import { useQueryPipeline, useGraphQLClient } from "@bota-apps/hooks";

export function useProjects() {
  const client = useGraphQLClient();
  return useQueryPipeline({
    queryKey: ["projects"],
    queryFn: () => client.request(ProjectsDocument).then((r) => r.projects),
    meta: { featureId: "projects" },
  });
}
```

## API

| Export                                                               | What                                                                              |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `queryClient`                                                        | The shared, pre-configured `QueryClient` instance                                 |
| `QueryProvider`                                                      | Mounts `queryClient` via `QueryClientProvider`                                    |
| `GraphQLContext` / `useGraphQLClient`                                | React context holding the `GraphQLClient`; hook throws if used outside a provider |
| `GraphQLProvider`                                                    | Puts a `GraphQLClient` on `GraphQLContext`                                        |
| `useQueryPipeline` / `useSuspenseQueryPipeline`                      | `useQuery` / `useSuspenseQuery` wrappers with feature-tracker error forwarding    |
| `useMutationPipeline`                                                | `useMutation` wrapper honouring `meta.invalidates` (auto query invalidation)      |
| `usePaginatedQueryPipeline`                                          | Query pipeline for paginated list operations                                      |
| `useGqlQuery` / `useGqlSuspenseQuery`                                | Typed query hooks that take a `TypedDocumentNode` and unwrap the root field       |
| `useGqlMutation`                                                     | Typed mutation hook; `invalidates` shorthand for `meta.invalidates`               |
| `gqlQueryKey`                                                        | Stable query key from a document + variables                                      |
| `QueryMeta` / `MutationMeta` / `GqlVariables`                        | Supporting types (`featureId`, `invalidates`, variable record)                    |
| `GqlQueryOptions` / `GqlSuspenseQueryOptions` / `GqlMutationOptions` | Option types for the `useGql*` hooks (query key / fn omitted)                     |

Query failures are forwarded to the feature tracker via
[`@bota-apps/fm`](../fm); the `GraphQLClient` type comes from
[`@bota-apps/gql-client`](../gql-client). React and `@tanstack/react-query` are
peer dependencies supplied by the app.

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
