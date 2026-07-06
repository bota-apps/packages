// The RBAC resource catalog is API-owned and comes over the wire flat +
// depth-first ordered (an arbitrary-depth tree can't be a fixed GraphQL
// selection set). These pure helpers rehydrate and walk that tree — generic over
// the node payload, so each app passes its own generated resource type (with
// labels etc.) and gets it back intact. No catalog data lives here, only the
// structural transform the wire format can't carry.

/** The minimum a flat resource node must carry to be rebuilt into a tree. */
export type FlatResourceNode = { id: string; parentId?: string | null };

/** A resource node with its children nested — preserves the source payload `T`. */
export type ResourceTreeNode<T extends FlatResourceNode> = T & {
  children: ResourceTreeNode<T>[];
};

/** Rebuild the nested tree from the flat, depth-first-ordered catalog. */
export function buildResourceTree<T extends FlatResourceNode>(
  nodes: readonly T[],
): ResourceTreeNode<T>[] {
  const byId = new Map<string, ResourceTreeNode<T>>();
  for (const node of nodes) {
    byId.set(node.id, { ...node, children: [] });
  }
  const roots: ResourceTreeNode<T>[] = [];
  for (const node of nodes) {
    const treeNode = byId.get(node.id);
    if (!treeNode) {
      continue;
    }
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) {
      parent.children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }
  return roots;
}

/** All resource ids under the given tree nodes, self first (depth-first). */
export function collectResourceIds<T extends FlatResourceNode>(
  nodes: readonly ResourceTreeNode<T>[],
): string[] {
  return nodes.flatMap((node) => [node.id, ...collectResourceIds(node.children)]);
}

/** Keep only nodes whose id is granted, preserving structure. */
export function pruneToGranted<T extends FlatResourceNode>(
  nodes: readonly ResourceTreeNode<T>[],
  granted: ReadonlySet<string>,
): ResourceTreeNode<T>[] {
  const result: ResourceTreeNode<T>[] = [];
  for (const node of nodes) {
    if (!granted.has(node.id)) {
      continue;
    }
    result.push({ ...node, children: pruneToGranted(node.children, granted) });
  }
  return result;
}
