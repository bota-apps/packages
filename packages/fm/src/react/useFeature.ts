import { useMemo } from "react";
import type {
  FeatureAnnotation,
  FeatureStatus,
  ResolvedFeature,
  ResolvedFeatureNode,
} from "@bota-apps/types/fm";
import { deriveFeatureAnnotations } from "../tree/annotations";
import { resolveFeaturePath, resolveFeatureTree } from "../tree/resolver";
import { useFeatureContextValue } from "./featureProvider";
import { useCurrentScopeId } from "./featureScopeProvider";

function useResolvedPath(featureId?: string) {
  const { registry, gateContext, collectors } = useFeatureContextValue();
  const ambientId = useCurrentScopeId();
  const id = featureId ?? ambientId;
  return useMemo(() => {
    if (!id) {
      throw new Error("useFeature: no featureId given and no ambient <FeatureScopeProvider>.");
    }
    const path = registry.getPath(id);
    if (!path) {
      throw new Error(`useFeature: unknown feature id "${id}".`);
    }
    return { path, gateContext, collectors };
  }, [registry, gateContext, collectors, id]);
}

/**
 * The gating face of one feature — ancestor verdicts cascade in, so a page
 * inside a hidden module reads hidden. Id omitted → nearest ambient scope.
 */
export function useFeature(featureId?: string): ResolvedFeature {
  const { path, gateContext, collectors } = useResolvedPath(featureId);
  return useMemo(
    () => resolveFeaturePath(path, gateContext, collectors),
    [path, gateContext, collectors],
  );
}

export function useFeatureStatus(featureId?: string): FeatureStatus {
  return useFeature(featureId).status;
}

/** The feature's renderable gating facts — blocking reasons first, then warnings. */
export function useFeatureAnnotations(featureId?: string): readonly FeatureAnnotation[] {
  const feature = useFeature(featureId);
  return useMemo(() => deriveFeatureAnnotations(feature), [feature]);
}

/** The feature's direct children, each resolved with the full ancestor cascade. */
export function useFeatureChildren(featureId?: string): readonly ResolvedFeature[] {
  const { path, gateContext, collectors } = useResolvedPath(featureId);
  return useMemo(() => {
    const node = path[path.length - 1];
    return (node.children ?? []).map((child) =>
      resolveFeaturePath([...path, child], gateContext, collectors),
    );
  }, [path, gateContext, collectors]);
}

/** The whole tree resolved with cascading verdicts — what nav builders walk. */
export function useFeatureTree(): ResolvedFeatureNode {
  const { registry, gateContext, collectors } = useFeatureContextValue();
  return useMemo(
    () => resolveFeatureTree(registry.tree, gateContext, collectors),
    [registry, gateContext, collectors],
  );
}
