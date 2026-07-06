import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { usePaginatedQueryPipeline } from "./usePaginatedQueryPipeline";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

type Page = { page: number; items: string[] };

describe("usePaginatedQueryPipeline", () => {
  it("keeps the previous page's data as placeholder while the next page loads", async () => {
    // Hand-resolved promises per page, so the in-flight window is observable.
    const resolvers = new Map<number, (value: Page) => void>();
    const { result } = renderHook(
      () => {
        const [page, setPage] = useState(1);
        const query = usePaginatedQueryPipeline<Page>({
          queryKey: ["items", page],
          queryFn: () =>
            new Promise<Page>((resolve) => {
              resolvers.set(page, resolve);
            }),
        });
        return { query, setPage };
      },
      { wrapper: createWrapper() },
    );

    await vi.waitFor(() => {
      expect(resolvers.has(1)).toBe(true);
    });
    resolvers.get(1)?.({ page: 1, items: ["item-1"] });
    await waitFor(() => {
      expect(result.current.query.data).toEqual({ page: 1, items: ["item-1"] });
    });

    act(() => {
      result.current.setPage(2);
    });

    // While page 2 is in flight, page 1's data stays on screen as placeholder.
    expect(result.current.query.isPlaceholderData).toBe(true);
    expect(result.current.query.data).toEqual({ page: 1, items: ["item-1"] });

    await vi.waitFor(() => {
      expect(resolvers.has(2)).toBe(true);
    });
    resolvers.get(2)?.({ page: 2, items: ["item-2"] });
    await waitFor(() => {
      expect(result.current.query.data).toEqual({ page: 2, items: ["item-2"] });
    });
    expect(result.current.query.isPlaceholderData).toBe(false);
  });
});
