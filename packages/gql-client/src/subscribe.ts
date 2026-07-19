import type { ExecutionResult } from "graphql";

/**
 * GraphQL subscriptions over Server-Sent Events ("distinct connections" mode
 * of the GraphQL-over-SSE protocol): the operation is POSTed to the regular
 * GraphQL endpoint with `Accept: text/event-stream`, and the server answers
 * with an event stream of `next` events (each carrying an execution result)
 * terminated by a `complete` event.
 *
 * Dependency-free: plain `fetch` + a minimal SSE frame parser.
 */

export type GraphQLSubscribeVariables = Record<string, unknown>;

export type GraphQLSubscribeOptions<
  TVariables extends GraphQLSubscribeVariables = GraphQLSubscribeVariables,
> = {
  /** The subscription operation, as GraphQL source text. */
  query: string;
  variables?: TVariables;
  /** Aborting the signal cancels the request and ends the iterator. */
  signal?: AbortSignal;
  /** Fetch implementation override (tests, custom transports). Defaults to global `fetch`. */
  fetch?: typeof fetch;
};

type SseMessage = {
  event: string;
  data: string;
};

/**
 * Parses one SSE frame (the text between two blank lines). Comment lines
 * (leading `:`) are skipped; multiple `data:` lines join with `\n`; a missing
 * `event:` field defaults to `message` per the SSE specification.
 */
function parseSseMessage(frame: string): SseMessage {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of frame.split(/\r?\n/)) {
    if (line.startsWith(":") || line.length === 0) {
      continue;
    }
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) {
      value = value.slice(1);
    }
    if (field === "event") {
      event = value;
    } else if (field === "data") {
      dataLines.push(value);
    }
  }
  return { event, data: dataLines.join("\n") };
}

const frameBoundary = /\r?\n\r?\n/;

/**
 * Opens a GraphQL subscription over SSE against `endpoint` and yields each
 * execution result as the server pushes it. The iterator ends when the server
 * sends `complete` (or closes the stream); aborting `options.signal` rejects
 * the pending read with an `AbortError`. Cookies ride along
 * (`credentials: "include"`), matching the query/mutation client.
 */
export async function* subscribeGraphQLSse<
  TData = unknown,
  TVariables extends GraphQLSubscribeVariables = GraphQLSubscribeVariables,
>(
  endpoint: string,
  options: GraphQLSubscribeOptions<TVariables>,
): AsyncGenerator<ExecutionResult<TData>, void, undefined> {
  const { query, variables, signal, fetch: fetchImpl = fetch } = options;
  const response = await fetchImpl(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      accept: "text/event-stream",
    },
    body: JSON.stringify(variables === undefined ? { query } : { query, variables }),
    signal,
  });
  if (!response.ok) {
    throw new Error(`GraphQL subscription request failed with status ${response.status}`);
  }
  if (!response.body) {
    throw new Error("GraphQL subscription response has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      for (;;) {
        const boundary = frameBoundary.exec(buffer);
        if (!boundary) {
          break;
        }
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const message = parseSseMessage(frame);
        if (message.event === "complete") {
          return;
        }
        if (message.event === "next" && message.data.length > 0) {
          // The protocol's `next` payload IS an ExecutionResult — same trust
          // boundary as the JSON body of a query response.
          const result: ExecutionResult<TData> = JSON.parse(message.data);
          yield result;
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}
