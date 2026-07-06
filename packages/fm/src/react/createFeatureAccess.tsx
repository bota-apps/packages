import type { ReactNode } from "react";
import type { ExtractFeatureIds, FeatureNodeDef, ResolvedFeature } from "@bota-apps/types/fm";
import { useFeature, useFeatureStatus } from "./useFeature";
import { FeatureGate } from "./featureGate";

/**
 * A per-app typed façade over the string-keyed fm React surface. Given the
 * app's feature-tree literal, every returned helper is constrained to that
 * tree's id union — so a typo (`"employes:create"`) is a compile error at the
 * call site instead of a runtime "unknown feature id" throw.
 *
 * The runtime engine stays string-keyed (ids resolve against the ambient
 * registry); this adds only the compile-time constraint. Derive the id type
 * from the same tree with `ExtractFeatureIds<typeof tree>`.
 *
 * ```ts
 * export const { featureId, useFeature, FeatureGate } = createFeatureAccess(tasksFeatureTree);
 * featureId("projects:create"); // ✅   featureId("projcts:create"); // ✗ compile error
 * ```
 */
export function createFeatureAccess<const T extends FeatureNodeDef>(_tree: T) {
  type Id = ExtractFeatureIds<T>;

  type TypedGateProps = {
    featureId?: Id;
    whenBlocked?: ReactNode;
    whenHidden?: ReactNode;
    children: ReactNode;
  };

  return {
    /** Narrows a string literal to a known feature id at compile time. */
    featureId: (id: Id): Id => id,
    /** {@link useFeature}, constrained to this tree's ids. */
    useFeature: (id?: Id): ResolvedFeature => useFeature(id),
    /** {@link useFeatureStatus}, constrained to this tree's ids. */
    useFeatureStatus: (id?: Id) => useFeatureStatus(id),
    /** {@link FeatureGate}, constrained to this tree's ids. */
    FeatureGate: (props: TypedGateProps) => FeatureGate(props),
  };
}
