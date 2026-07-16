import type { ExecutionResult } from "graphql";
import { GraphQLClient } from "graphql-request";
import {
  subscribeGraphQLSse,
  type GraphQLSubscribeOptions,
  type GraphQLSubscribeVariables,
} from "./subscribe";

export { gql } from "graphql-request";
export type { GraphQLClient } from "graphql-request";
export * from "./subscribe";

/**
 * The client `createGraphQLClient` returns: the full `graphql-request` client
 * plus a `subscribe` capability that streams GraphQL subscription results over
 * SSE from the same endpoint (see {@link subscribeGraphQLSse}).
 */
export type SubscribableGraphQLClient = GraphQLClient & {
  subscribe: <
    TData = unknown,
    TVariables extends GraphQLSubscribeVariables = GraphQLSubscribeVariables,
  >(
    options: GraphQLSubscribeOptions<TVariables>,
  ) => AsyncGenerator<ExecutionResult<TData>, void, undefined>;
};

/**
 * Creates the shared GraphQL client.
 *
 * `credentials: "include"` is the whole point of cookie-based auth: every
 * request carries the `HttpOnly` session cookie the server set at login. The
 * SPA never reads or holds a token.
 *
 * `endpoint` must be an **absolute** URL — graphql-request builds a
 * `new URL(endpoint)` internally, which throws on a bare relative path. The URL
 * comes straight from app config (e.g. `graphqlAppEnv.apiUrl` resolved by
 * @bota-apps/app-config); this package stays platform-agnostic and makes no
 * assumptions about the host environment.
 */
export function createGraphQLClient(endpoint: string): SubscribableGraphQLClient {
  const client = new GraphQLClient(endpoint, {
    credentials: "include",
  });
  return Object.assign(client, {
    subscribe: <
      TData = unknown,
      TVariables extends GraphQLSubscribeVariables = GraphQLSubscribeVariables,
    >(
      options: GraphQLSubscribeOptions<TVariables>,
    ) => subscribeGraphQLSse<TData, TVariables>(endpoint, options),
  });
}
