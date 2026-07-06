import { useMemo } from "react";
import type { FeatureScope } from "@bota-apps/types/fm";
import { makeScope } from "../scope/featureScope";
import { resolveFeaturePath } from "../tree/resolver";
import { useFeatureContextValue } from "./featureProvider";
import { useCurrentScopeId } from "./featureScopeProvider";

/**
 * Always returns a scope, never undefined:
 *   • id given   → location-independent lookup in the registry
 *   • id omitted → nearest ambient scope (page → … → app)
 *   • misconfig (no provider / unknown id) → throws (a bug, not a runtime "maybe")
 *
 * The scope's gating face (`available`/`status`) runs the collectors with the
 * ancestor cascade, so it agrees with `useFeature` for the same id.
 */
export function useFeatureScope(featureId?: string): FeatureScope {
  const { registry, gateContext, collectors } = useFeatureContextValue();
  const ambientId = useCurrentScopeId();
  const id = featureId ?? ambientId;

  return useMemo(() => {
    if (!id) {
      throw new Error("useFeatureScope: no featureId given and no ambient <FeatureScopeProvider>.");
    }
    const path = registry.getPath(id);
    if (!path) {
      throw new Error(`useFeatureScope: unknown feature id "${id}".`);
    }
    const node = path[path.length - 1];
    return makeScope(id, node, resolveFeaturePath(path, gateContext, collectors));
  }, [registry, gateContext, collectors, id]);
}

/** The ambient current scope (throws if there is no provider). */
export function useCurrentFeatureScope(): FeatureScope {
  return useFeatureScope();
}
