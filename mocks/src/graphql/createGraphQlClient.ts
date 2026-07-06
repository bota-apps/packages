import { execute, parse, type GraphQLSchema } from "graphql";
import { GraphQLClient } from "graphql-request";

export type MockGraphQLClientOptions = {
  /**
   * The executable schema every operation runs against — pass the app's
   * in-memory schema (e.g. the one the mock backend is built from). The double
   * executes real documents against it, so tests exercise the real resolvers,
   * not per-test response stubs.
   */
  schema: GraphQLSchema;
  /** Resolver root value, forwarded to `graphql.execute`. */
  rootValue?: unknown;
  /**
   * Per-request context forwarded to `graphql.execute`. Pass a factory to derive
   * it from the incoming operation (e.g. an authenticated viewer per test).
   */
  contextValue?: unknown | (() => unknown);
  /**
   * The endpoint the underlying client reports. Cosmetic — no network happens —
   * but it must be an absolute URL because `graphql-request` builds one.
   * Default `"http://mock.test/graphql"`.
   */
  endpoint?: string;
  /**
   * Escape hatch to replace any subset of the client surface. Applied **last**
   * over the real client instance — override `rawRequest` to force a network
   * error, or `setHeader` to spy — while keeping the real implementation for the
   * rest. `Partial<GraphQLClient>`, so an override must match the real shape.
   */
  overrides?: Partial<GraphQLClient>;
};

type GraphQLBody = { query: string; variables?: Record<string, unknown>; operationName?: string };

/**
 * An in-memory {@link GraphQLClient} for tests and stories. It IS a real
 * `graphql-request` client — the exact type the hooks call `rawRequest` on — with
 * its `fetch` swapped for an in-process executor that runs each operation against
 * `schema`. No network, no cast, full shape-fidelity.
 */
export function createMockGraphQLClient(options: MockGraphQLClientOptions): GraphQLClient {
  const { schema, rootValue, contextValue, endpoint = "http://mock.test/graphql" } = options;

  const fetchImpl: typeof fetch = async (_input, init) => {
    const body: GraphQLBody = JSON.parse(String(init?.body ?? "{}"));
    const result = await execute({
      schema,
      document: parse(body.query),
      rootValue,
      contextValue: typeof contextValue === "function" ? contextValue() : contextValue,
      variableValues: body.variables,
      operationName: body.operationName,
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const client = new GraphQLClient(endpoint, { fetch: fetchImpl });
  return options.overrides ? Object.assign(client, options.overrides) : client;
}
