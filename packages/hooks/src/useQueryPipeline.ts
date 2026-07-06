import {
  useQuery,
  useSuspenseQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

/** Standard query wrapper — the one place app-wide query defaults live. */
export function useQueryPipeline<TData, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  options: UseQueryOptions<TData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>(options);
}

export function useSuspenseQueryPipeline<
  TData,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TData, TError, TData, TQueryKey>,
): UseSuspenseQueryResult<TData, TError> {
  return useSuspenseQuery<TData, TError, TData, TQueryKey>(options);
}
