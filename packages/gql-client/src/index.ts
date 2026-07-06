import { GraphQLClient } from "graphql-request";

export { gql } from "graphql-request";
export type { GraphQLClient } from "graphql-request";

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
export function createGraphQLClient(endpoint: string): GraphQLClient {
  return new GraphQLClient(endpoint, {
    credentials: "include",
  });
}
