import { QueryCache, QueryClient } from "@tanstack/react-query";
import { reportQueryError } from "@bota-apps/fm";

/** Query metadata — set `meta: { featureId }` to attribute a read's failures. */
export type QueryMeta = { featureId?: string };

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryMeta;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  // Reads never toast — a failed query shows the route's page-state error view.
  // This net only forwards the failure to the feature tracker (no UI), with the
  // featureId from query.meta when present. Mutation errors are owned by the
  // feature boundary (DynamicForm's scope.run), not a global handler.
  queryCache: new QueryCache({
    onError: (error, query) => reportQueryError(error, query.meta?.featureId),
  }),
});
