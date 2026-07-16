import { describe, expect, it, vi } from "vitest";
import { createGraphQLClient } from "./index";
import { subscribeGraphQLSse } from "./subscribe";

const encoder = new TextEncoder();

/**
 * A `fetch` double that answers with an SSE stream emitting `chunks` in order
 * (each chunk is enqueued as its own read, so frame reassembly across reads is
 * exercised by splitting frames between chunks). Honors the request signal:
 * aborting errors the stream like a real cancelled fetch.
 */
function createSseFetch(chunks: string[], init?: { status?: number; hang?: boolean }) {
  const requests: { url: string; init: RequestInit | undefined }[] = [];
  const fetchImpl: typeof fetch = async (input, requestInit) => {
    requests.push({ url: String(input), init: requestInit });
    const signal = requestInit?.signal;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        signal?.addEventListener("abort", () => {
          controller.error(new DOMException("The operation was aborted.", "AbortError"));
        });
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        if (!init?.hang) {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      status: init?.status ?? 200,
      headers: { "content-type": "text/event-stream" },
    });
  };
  return { fetchImpl, requests };
}

async function collect<T>(iterator: AsyncGenerator<T, void, undefined>): Promise<T[]> {
  const results: T[] = [];
  for await (const value of iterator) {
    results.push(value);
  }
  return results;
}

describe("subscribeGraphQLSse", () => {
  it("POSTs the operation with an event-stream accept header and cookie credentials", async () => {
    const { fetchImpl, requests } = createSseFetch(["event: complete\ndata:\n\n"]);
    await collect(
      subscribeGraphQLSse("http://api.test/graphql", {
        query: "subscription Counter { counter }",
        variables: { from: 1 },
        fetch: fetchImpl,
      }),
    );

    expect(requests).toHaveLength(1);
    const { url, init } = requests[0];
    expect(url).toBe("http://api.test/graphql");
    expect(init?.method).toBe("POST");
    expect(init?.credentials).toBe("include");
    expect(init?.headers).toMatchObject({
      accept: "text/event-stream",
      "content-type": "application/json",
    });
    expect(JSON.parse(String(init?.body))).toEqual({
      query: "subscription Counter { counter }",
      variables: { from: 1 },
    });
  });

  it("yields each next event's execution result and ends on complete", async () => {
    const { fetchImpl } = createSseFetch([
      'event: next\ndata: {"data":{"counter":1}}\n\n',
      'event: next\ndata: {"data":{"counter":2}}\n\n',
      "event: complete\ndata:\n\n",
      // Anything after complete must be ignored.
      'event: next\ndata: {"data":{"counter":99}}\n\n',
    ]);

    const results = await collect(
      subscribeGraphQLSse<{ counter: number }>("http://api.test/graphql", {
        query: "subscription Counter { counter }",
        fetch: fetchImpl,
      }),
    );

    expect(results).toEqual([{ data: { counter: 1 } }, { data: { counter: 2 } }]);
  });

  it("reassembles frames split across reads and skips comment lines", async () => {
    const { fetchImpl } = createSseFetch([
      ': keep-alive\n\nevent: next\ndata: {"data":{"co',
      'unter":7}}\n\nevent: comp',
      "lete\ndata:\n\n",
    ]);

    const results = await collect(
      subscribeGraphQLSse<{ counter: number }>("http://api.test/graphql", {
        query: "subscription Counter { counter }",
        fetch: fetchImpl,
      }),
    );

    expect(results).toEqual([{ data: { counter: 7 } }]);
  });

  it("ends when the server closes the stream without a complete event", async () => {
    const { fetchImpl } = createSseFetch(['event: next\ndata: {"data":{"counter":3}}\n\n']);
    const results = await collect(
      subscribeGraphQLSse<{ counter: number }>("http://api.test/graphql", {
        query: "subscription Counter { counter }",
        fetch: fetchImpl,
      }),
    );
    expect(results).toEqual([{ data: { counter: 3 } }]);
  });

  it("throws on a non-ok response", async () => {
    const { fetchImpl } = createSseFetch([], { status: 500 });
    await expect(
      collect(
        subscribeGraphQLSse("http://api.test/graphql", {
          query: "subscription Counter { counter }",
          fetch: fetchImpl,
        }),
      ),
    ).rejects.toThrow("GraphQL subscription request failed with status 500");
  });

  it("rejects the pending read when the signal aborts", async () => {
    const { fetchImpl } = createSseFetch(['event: next\ndata: {"data":{"counter":1}}\n\n'], {
      hang: true,
    });
    const controller = new AbortController();
    const iterator = subscribeGraphQLSse<{ counter: number }>("http://api.test/graphql", {
      query: "subscription Counter { counter }",
      signal: controller.signal,
      fetch: fetchImpl,
    });

    const first = await iterator.next();
    expect(first.done).toBe(false);

    const pending = iterator.next();
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("createGraphQLClient", () => {
  it("returns a client whose subscribe streams from the construction endpoint", async () => {
    const { fetchImpl, requests } = createSseFetch([
      'event: next\ndata: {"data":{"counter":5}}\n\nevent: complete\ndata:\n\n',
    ]);
    vi.stubGlobal("fetch", fetchImpl);
    try {
      const client = createGraphQLClient("http://api.test/graphql");
      const results = await collect(
        client.subscribe<{ counter: number }>({
          query: "subscription Counter { counter }",
        }),
      );
      expect(results).toEqual([{ data: { counter: 5 } }]);
      expect(requests[0].url).toBe("http://api.test/graphql");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
