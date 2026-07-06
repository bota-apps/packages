import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

export type MutationMeta = {
  /** Query keys to invalidate on success — replaces hand-written onSuccess wiring. */
  invalidates?: QueryKey[];
};

// Make `meta` strongly typed everywhere.
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: MutationMeta;
  }
}

/**
 * Standard mutation wrapper. Honours `meta.invalidates` so domain hooks declare
 * what to refetch instead of hand-writing onSuccess. Errors are owned by the
 * caller's feature boundary (DynamicForm's scope.run), not a global handler — so
 * the success/error toast carries feature context, with the policy on the tree node.
 */
export function useMutationPipeline<TData, TError = Error, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    // Forward every arg react-query passes (its onSuccess arity varies by minor).
    onSuccess: (...args) => {
      options.meta?.invalidates?.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
      return options.onSuccess?.(...args);
    },
  });
}
