import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { PrunedResourceNode } from "./useFeatureSetup";
import { useFeatureSetup } from "./useFeatureSetup";

const prunedResourceTree: readonly PrunedResourceNode[] = [
  {
    id: "projects",
    children: [{ id: "projects:read" }, { id: "projects:write" }],
  },
  { id: "reports" },
];

describe("useFeatureSetup", () => {
  it("flattens the pruned resource tree into granted permissions", () => {
    const { result } = renderHook(() => useFeatureSetup({ prunedResourceTree }));
    expect(result.current.permissions).toEqual([
      "projects",
      "projects:read",
      "projects:write",
      "reports",
    ]);
  });

  it("passes the remaining gating inputs through", () => {
    const { result } = renderHook(() =>
      useFeatureSetup({
        prunedResourceTree,
        flags: { beta: true },
        planFeatures: ["multi-currency"],
        reachedLimits: ["projects"],
        approachingLimits: ["tasks"],
        completedSetup: ["org-profile"],
      }),
    );
    expect(result.current).toEqual({
      permissions: ["projects", "projects:read", "projects:write", "reports"],
      flags: { beta: true },
      planFeatures: ["multi-currency"],
      reachedLimits: ["projects"],
      approachingLimits: ["tasks"],
      completedSetup: ["org-profile"],
    });
  });

  it("grants nothing without a tree and keeps a stable identity across re-renders", () => {
    const { result, rerender } = renderHook(
      (input: { prunedResourceTree?: readonly PrunedResourceNode[] }) => useFeatureSetup(input),
      { initialProps: { prunedResourceTree } },
    );
    const first = result.current;
    rerender({ prunedResourceTree });
    expect(result.current).toBe(first);

    rerender({});
    expect(result.current.permissions).toEqual([]);
  });
});
