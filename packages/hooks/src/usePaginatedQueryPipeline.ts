import {
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

/**
 * Query wrapper for paginated lists (put the page params in the query key):
 * while the next page loads, the previous page's data stays on screen as
 * placeholder data (`isPlaceholderData` is true) instead of flashing a
 * loading state.
 */
export function usePaginatedQueryPipeline<
  TData,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TData, TError, TData, TQueryKey>): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    placeholderData: keepPreviousData,
    ...options,
  });
}
