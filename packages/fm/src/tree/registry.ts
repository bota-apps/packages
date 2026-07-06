import type { FeatureNodeDef } from "@bota-apps/types/fm";

// A flat, by-id view of the tree so scope lookup is O(1) and location-independent.
export type FeatureRegistry = {
  tree: FeatureNodeDef;
  nodeMap: ReadonlyMap<string, FeatureNodeDef>;
  getNode: (id: string) => FeatureNodeDef | undefined;
  /** The root→node chain for an id — what ancestor-aware gating resolves over. */
  getPath: (id: string) => readonly FeatureNodeDef[] | undefined;
};

export function createFeatureRegistry(tree: FeatureNodeDef): FeatureRegistry {
  const nodeMap = new Map<string, FeatureNodeDef>();
  const pathMap = new Map<string, readonly FeatureNodeDef[]>();
  const walk = (node: FeatureNodeDef, ancestors: readonly FeatureNodeDef[]): void => {
    if (nodeMap.has(node.id)) {
      throw new Error(`createFeatureRegistry: duplicate feature id "${node.id}".`);
    }
    const path = [...ancestors, node];
    nodeMap.set(node.id, node);
    pathMap.set(node.id, path);
    node.children?.forEach((child) => walk(child, path));
  };
  walk(tree, []);
  return {
    tree,
    nodeMap,
    getNode: (id) => nodeMap.get(id),
    getPath: (id) => pathMap.get(id),
  };
}
