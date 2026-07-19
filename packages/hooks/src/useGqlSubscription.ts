import type { GraphQLClient, SubscribableGraphQLClient } from "@bota-apps/gql-client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGraphQLClient } from "./graphqlContext";
import type { GqlVariables } from "./useGqlOperations";

export type GqlSubscriptionStatus = "idle" | "connecting" | "open" | "closed";

export type GqlSubscriptionOptions<TData, TVariables extends GqlVariables> = {
  variables: TVariables;
  /** `false` keeps the subscription closed (`status: "idle"`). Default `true`. */
  enabled?: boolean;
  /** Receives each pushed payload, in server order. */
  onData: (data: TData) => void;
  /** Receives transport failures and payload-level GraphQL errors. */
  onError?: (error: Error) => void;
};

export type GqlSubscriptionResult = {
  status: GqlSubscriptionStatus;
};

const baseReconnectDelayMs = 500;
const maxReconnectDelayMs = 15_000;

/**
 * The provider contract only promises the query/mutation client; subscribing
 * additionally needs the SSE capability `createGraphQLClient` attaches. Guard
 * once and fail fast with a pointed message instead of a property error.
 */
function isSubscribableClient(client: GraphQLClient): client is SubscribableGraphQLClient {
  return "subscribe" in client && typeof client.subscribe === "function";
}

/**
 * Consumes a GraphQL subscription over SSE using the context client.
 *
 * Opens on mount and whenever the document/variables change, and aborts the
 * in-flight stream on unmount. A transport failure schedules a reconnect with
 * exponential backoff (capped at 15s); a server-sent `complete` is terminal
 * (`status: "closed"`), as is `enabled: false` (`status: "idle"`, nothing
 * opens). `onData`/`onError` are read through a ref, so handler identity never
 * restarts the stream.
 */
export function useGqlSubscription<TData, TVariables extends GqlVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  options: GqlSubscriptionOptions<TData, TVariables>,
): GqlSubscriptionResult {
  const client = useGraphQLClient();
  const enabled = options.enabled ?? true;
  const [status, setStatus] = useState<GqlSubscriptionStatus>("idle");

  const handlersRef = useRef({ onData: options.onData, onError: options.onError });
  useEffect(() => {
    handlersRef.current = { onData: options.onData, onError: options.onError };
  });

  // Re-subscribe on value change, not on per-render object identity.
  const serializedVariables = JSON.stringify(options.variables);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- serializedVariables stands in for `options.variables`
  const variables = useMemo(() => options.variables, [serializedVariables]);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }
    if (!isSubscribableClient(client)) {
      throw new Error(
        "useGqlSubscription requires a subscription-capable GraphQL client — create it with createGraphQLClient()",
      );
    }
    const query = print(document);
    const controller = new AbortController();
    let active = true;
    let attempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = async (): Promise<void> => {
      setStatus("connecting");
      try {
        const events = client.subscribe<TData, TVariables>({
          query,
          variables,
          signal: controller.signal,
        });
        for await (const result of events) {
          attempt = 0;
          setStatus("open");
          if (result.errors && result.errors.length > 0) {
            handlersRef.current.onError?.(
              new Error(result.errors.map((error) => error.message).join("; ")),
            );
          }
          if (result.data !== undefined && result.data !== null) {
            handlersRef.current.onData(result.data);
          }
        }
        // The server completed the stream — terminal, no reconnect.
        if (active) {
          setStatus("closed");
        }
      } catch (caught) {
        if (!active || controller.signal.aborted) {
          return;
        }
        handlersRef.current.onError?.(caught instanceof Error ? caught : new Error(String(caught)));
        setStatus("closed");
        const delay = Math.min(maxReconnectDelayMs, baseReconnectDelayMs * 2 ** attempt);
        attempt += 1;
        reconnectTimer = setTimeout(() => {
          void connect();
        }, delay);
      }
    };

    void connect();

    return () => {
      active = false;
      controller.abort();
      if (reconnectTimer !== undefined) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [client, document, enabled, variables]);

  return { status };
}
