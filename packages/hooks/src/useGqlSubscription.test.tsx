import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { renderHook, waitFor } from "@testing-library/react";
import { GraphQLError, parse, type ExecutionResult } from "graphql";
import { GraphQLClient } from "graphql-request";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { GraphQLContext } from "./graphqlContext";
import { useGqlSubscription } from "./useGqlSubscription";

type CounterPayload = { counter: number };

const CounterDocument: TypedDocumentNode<CounterPayload, { from: number }> = parse(/* GraphQL */ `
  subscription Counter($from: Int!) {
    counter(from: $from)
  }
`);

type SubscribeCall = {
  query: string;
  variables?: Record<string, unknown>;
  signal?: AbortSignal;
};

type StreamFactory = (
  call: SubscribeCall,
  callIndex: number,
) => AsyncGenerator<ExecutionResult<CounterPayload>, void, undefined>;

/**
 * A context client double: a real GraphQLClient carrying a scripted
 * `subscribe` implementation, so the hook's capability guard and option
 * plumbing are exercised without any network.
 */
function createSubscriptionClient(streamFor: StreamFactory) {
  const calls: SubscribeCall[] = [];
  const client = Object.assign(new GraphQLClient("http://test.invalid/graphql"), {
    subscribe: (options: SubscribeCall) => {
      calls.push(options);
      return streamFor(options, calls.length - 1);
    },
  });
  return { client, calls };
}

function createWrapper(client: GraphQLClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <GraphQLContext.Provider value={client}>{children}</GraphQLContext.Provider>;
  };
}

/** A stream that yields `payloads` then stays open until the signal aborts. */
function openStream(payloads: ExecutionResult<CounterPayload>[]): StreamFactory {
  return async function* stream(call) {
    for (const payload of payloads) {
      yield payload;
    }
    await new Promise<never>((_, reject) => {
      call.signal?.addEventListener("abort", () =>
        reject(new DOMException("The operation was aborted.", "AbortError")),
      );
    });
  };
}

describe("useGqlSubscription", () => {
  it("delivers pushed payloads to onData in order and closes when the server completes", async () => {
    const { client, calls } = createSubscriptionClient(async function* stream() {
      yield { data: { counter: 1 } };
      yield { data: { counter: 2 } };
    });
    const onData = vi.fn();

    const { result } = renderHook(
      () => useGqlSubscription(CounterDocument, { variables: { from: 1 }, onData }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.status).toBe("closed"));
    expect(onData.mock.calls.map(([data]) => data)).toEqual([{ counter: 1 }, { counter: 2 }]);
    expect(calls).toHaveLength(1);
    expect(calls[0].query).toContain("subscription Counter");
    expect(calls[0].variables).toEqual({ from: 1 });
  });

  it("reports open while the stream is live and aborts it on unmount", async () => {
    const { client, calls } = createSubscriptionClient(openStream([{ data: { counter: 1 } }]));
    const onData = vi.fn();
    const onError = vi.fn();

    const { result, unmount } = renderHook(
      () => useGqlSubscription(CounterDocument, { variables: { from: 1 }, onData, onError }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.status).toBe("open"));
    expect(calls[0].signal?.aborted).toBe(false);

    unmount();
    expect(calls[0].signal?.aborted).toBe(true);
    await waitFor(() => expect(onError).not.toHaveBeenCalled());
    expect(onData).toHaveBeenCalledTimes(1);
  });

  it("stays idle and opens nothing when enabled is false", () => {
    const { client, calls } = createSubscriptionClient(openStream([]));
    const { result } = renderHook(
      () =>
        useGqlSubscription(CounterDocument, {
          variables: { from: 1 },
          enabled: false,
          onData: vi.fn(),
        }),
      { wrapper: createWrapper(client) },
    );

    expect(result.current.status).toBe("idle");
    expect(calls).toHaveLength(0);
  });

  it("routes payload-level GraphQL errors to onError without closing the stream", async () => {
    const { client } = createSubscriptionClient(
      openStream([{ errors: [new GraphQLError("denied")] }, { data: { counter: 4 } }]),
    );
    const onData = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useGqlSubscription(CounterDocument, { variables: { from: 1 }, onData, onError }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(onData).toHaveBeenCalledWith({ counter: 4 }));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe("denied");
    expect(result.current.status).toBe("open");
  });

  it("reconnects with backoff after a transport failure", async () => {
    const { client, calls } = createSubscriptionClient((call, callIndex) => {
      if (callIndex === 0) {
        return (async function* failing() {
          yield { data: { counter: 1 } };
          throw new Error("stream lost");
        })();
      }
      return openStream([{ data: { counter: 2 } }])(call, callIndex);
    });
    const onData = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useGqlSubscription(CounterDocument, { variables: { from: 1 }, onData, onError }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0][0].message).toBe("stream lost");

    // First backoff step is 500ms; the second connection then streams again.
    await waitFor(() => expect(calls).toHaveLength(2), { timeout: 3000 });
    await waitFor(() => expect(onData).toHaveBeenCalledWith({ counter: 2 }));
    expect(result.current.status).toBe("open");
  });

  it("re-subscribes when variables change and aborts the previous stream", async () => {
    const { client, calls } = createSubscriptionClient(openStream([{ data: { counter: 1 } }]));
    const onData = vi.fn();

    const { rerender } = renderHook(
      ({ from }: { from: number }) =>
        useGqlSubscription(CounterDocument, { variables: { from }, onData }),
      { wrapper: createWrapper(client), initialProps: { from: 1 } },
    );

    await waitFor(() => expect(calls).toHaveLength(1));
    rerender({ from: 2 });

    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[0].signal?.aborted).toBe(true);
    expect(calls[1].variables).toEqual({ from: 2 });
    expect(calls[1].signal?.aborted).toBe(false);
  });

  it("fails fast when the context client has no subscribe capability", () => {
    const bare = new GraphQLClient("http://test.invalid/graphql");
    expect(() =>
      renderHook(
        () => useGqlSubscription(CounterDocument, { variables: { from: 1 }, onData: vi.fn() }),
        { wrapper: createWrapper(bare) },
      ),
    ).toThrow(/subscription-capable GraphQL client/);
  });
});
