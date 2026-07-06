import { useMemo } from "react";
import type { FeatureGateContext } from "@bota-apps/types/fm";

/**
 * A node of the API-pruned resource tree: the server returns only the branches
 * the current user is granted, so every node id IS a granted permission.
 */
export type PrunedResourceNode = {
  id: string;
  children?: readonly PrunedResourceNode[];
};

/** `useFeatureSetup` input: the pruned grant tree plus the pass-through gating inputs. */
export type FeatureSetupInput = Omit<FeatureGateContext, "permissions"> & {
  prunedResourceTree?: readonly PrunedResourceNode[];
};

function collectNodeIds(nodes: readonly PrunedResourceNode[], into: Set<string>): void {
  for (const node of nodes) {
    into.add(node.id);
    if (node.children) {
      collectNodeIds(node.children, into);
    }
  }
}

/**
 * Builds the stable {@link FeatureGateContext} a `FeatureProvider` consumes:
 * flattens the API-pruned resource tree into granted permission ids and passes
 * the remaining gating inputs through. Memoized — `FeatureProvider` re-resolves
 * every consumer on context identity change, so this only produces a new object
 * when an input actually changes.
 */
export function useFeatureSetup({
  prunedResourceTree,
  flags,
  planFeatures,
  reachedLimits,
  approachingLimits,
  completedSetup,
}: FeatureSetupInput): FeatureGateContext {
  return useMemo(() => {
    const granted = new Set<string>();
    if (prunedResourceTree) {
      collectNodeIds(prunedResourceTree, granted);
    }
    return {
      permissions: [...granted],
      flags,
      planFeatures,
      reachedLimits,
      approachingLimits,
      completedSetup,
    };
  }, [prunedResourceTree, flags, planFeatures, reachedLimits, approachingLimits, completedSetup]);
}
