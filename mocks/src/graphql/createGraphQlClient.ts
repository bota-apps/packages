import {
  execute,
  parse,
  subscribe as executeSubscription,
  type ExecutionResult,
  type GraphQLSchema,
} from "graphql";
import { GraphQLClient } from "graphql-request";
import type {
  GraphQLSubscribeOptions,
  GraphQLSubscribeVariables,
  SubscribableGraphQLClient,
} from "@bota-apps/gql-client";

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
   * Subscriptions resolve it once per `subscribe` call.
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
   * error, or `subscribe` to script a stream — while keeping the real
   * implementation for the rest. `Partial<SubscribableGraphQLClient>`, so an
   * override must match the real shape.
   */
  overrides?: Partial<SubscribableGraphQLClient>;
};

type GraphQLBody = { query: string; variables?: Record<string, unknown>; operationName?: string };

function abortReason(signal: AbortSignal): Error {
  const reason: unknown = signal.reason;
  return reason instanceof Error
    ? reason
    : new DOMException("The operation was aborted.", "AbortError");
}

/**
 * Executes a subscription in-process and yields each pushed result, mirroring
 * the SSE transport's observable behavior: a subscribe-time failure arrives as
 * a single error result followed by completion, aborting `signal` rejects the
 * pending read, and every payload crosses a JSON boundary — exactly what a
 * result looks like after the wire (the query path gets the same fidelity from
 * its in-process `Response`).
 */
async function* subscribeInProcess<TData>(
  options: GraphQLSubscribeOptions,
  execution: { schema: GraphQLSchema; rootValue: unknown; contextValue: unknown },
): AsyncGenerator<ExecutionResult<TData>, void, undefined> {
  const { signal } = options;
  signal?.throwIfAborted();
  const subscribed = await executeSubscription({
    schema: execution.schema,
    document: parse(options.query),
    rootValue: execution.rootValue,
    contextValue:
      typeof execution.contextValue === "function"
        ? execution.contextValue()
        : execution.contextValue,
    variableValues: options.variables,
  });

  if (!(Symbol.asyncIterator in subscribed)) {
    const single: ExecutionResult<TData> = JSON.parse(JSON.stringify(subscribed));
    yield single;
    return;
  }

  const aborted = signal
    ? new Promise<never>((_, reject) => {
        signal.addEventListener("abort", () => reject(abortReason(signal)), { once: true });
      })
    : undefined;
  // Keep an unconsumed abort rejection from surfacing as unhandled.
  void aborted?.catch(() => undefined);

  try {
    for (;;) {
      const step = aborted
        ? await Promise.race([subscribed.next(), aborted])
        : await subscribed.next();
      if (step.done) {
        return;
      }
      const result: ExecutionResult<TData> = JSON.parse(JSON.stringify(step.value));
      yield result;
    }
  } finally {
    // Best-effort source cleanup (releases pubsub listeners); not awaited —
    // a native async generator queues `return()` behind a pending `next()`.
    void subscribed.return();
  }
}

/**
 * An in-memory {@link SubscribableGraphQLClient} for tests and stories. It IS a
 * real `graphql-request` client — the exact type the hooks call `rawRequest` on —
 * with its `fetch` swapped for an in-process executor that runs each operation
 * against `schema`, plus the `subscribe` capability `createGraphQLClient`
 * attaches, backed by the schema's subscription resolvers. No network, no cast,
 * full shape-fidelity.
 */
export function createMockGraphQLClient(
  options: MockGraphQLClientOptions,
): SubscribableGraphQLClient {
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

  const client = Object.assign(new GraphQLClient(endpoint, { fetch: fetchImpl }), {
    subscribe: <
      TData = unknown,
      TVariables extends GraphQLSubscribeVariables = GraphQLSubscribeVariables,
    >(
      subscribeOptions: GraphQLSubscribeOptions<TVariables>,
    ) => subscribeInProcess<TData>(subscribeOptions, { schema, rootValue, contextValue }),
  });
  return options.overrides ? Object.assign(client, options.overrides) : client;
}
