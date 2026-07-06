import type { FeatureNodeDef } from "@bota-apps/types/fm";

/**
 * Appends contributed subtrees (a plugin/app module's features) as children of
 * the root. Purely structural — id uniqueness across the composed tree is
 * enforced by `createFeatureRegistry`.
 */
export function composeFeatureTree(
  root: FeatureNodeDef,
  ...contributions: readonly FeatureNodeDef[]
): FeatureNodeDef {
  return { ...root, children: [...(root.children ?? []), ...contributions] };
}
