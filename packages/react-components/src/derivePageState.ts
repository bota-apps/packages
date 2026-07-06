import type { ReactNode } from "react";
import type { PageState } from "./pageContainer";

// The React Query slice list pages actually read — structural, so any
// query-shaped object (useQueryPipeline result included) fits.
type QueryState<T> = {
  isLoading: boolean;
  isError: boolean;
  data: readonly T[] | undefined;
};

type EmptyConfig = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

/**
 * Derives a `PageState` from React Query state for list pages.
 *
 * Priority:
 * 1. Loading with no cached data → `loading`
 * 2. Error with no cached data → `error`
 * 3. Empty data → `empty` with the provided config
 * 4. Error with cached data → `ready` + warning (show stale data)
 * 5. Otherwise → `ready`
 */
export function derivePageState<T>(
  query: QueryState<T>,
  empty: EmptyConfig,
  staleWarning?: string,
): PageState {
  const { isLoading, isError, data } = query;

  if (isLoading && !data) {
    return { kind: "loading" };
  }

  if (isError && !data) {
    return { kind: "error" };
  }

  if (!data || data.length === 0) {
    return { kind: "empty", ...empty };
  }

  if (isError) {
    return {
      kind: "ready",
      warning: staleWarning ?? "Unable to refresh data. Showing previously loaded results.",
    };
  }

  return { kind: "ready" };
}
