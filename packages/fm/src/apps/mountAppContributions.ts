import type { AppFeatureContribution, FeatureNodeDef } from "@bota-apps/types/fm";

function collectIds(node: FeatureNodeDef, into: Set<string>): Set<string> {
  into.add(node.id);
  node.children?.forEach((child) => collectIds(child, into));
  return into;
}

function tagSubtree(node: FeatureNodeDef, appId: string): FeatureNodeDef {
  return {
    ...node,
    meta: { ...(node.meta ?? {}), appId },
    children: node.children?.map((child) => tagSubtree(child, appId)),
  };
}

function attach(
  node: FeatureNodeDef,
  byMount: ReadonlyMap<string, readonly FeatureNodeDef[]>,
): FeatureNodeDef {
  const children = node.children?.map((child) => attach(child, byMount)) ?? [];
  const added = byMount.get(node.id) ?? [];
  if (!node.children && added.length === 0) {
    return node;
  }
  return { ...node, children: [...children, ...added] };
}

/**
 * Grafts app contributions into the host tree at each contribution's
 * `mountUnder` node, tagging every contributed node's meta with its `appId`.
 * Unlike `composeFeatureTree` (which appends at the root), contributions name
 * their mount point. Throws on an unknown mount id — a manifest naming a
 * non-existent host node is a contract violation, not a soft miss. Duplicate
 * feature ids are caught downstream by `createFeatureRegistry`.
 */
export function mountAppContributions(
  root: FeatureNodeDef,
  contributions: readonly AppFeatureContribution[],
): FeatureNodeDef {
  if (contributions.length === 0) {
    return root;
  }

  const knownIds = collectIds(root, new Set());
  const byMount = new Map<string, FeatureNodeDef[]>();
  for (const contribution of contributions) {
    if (!knownIds.has(contribution.mountUnder)) {
      throw new Error(
        `mountAppContributions: contribution "${contribution.meta.id}" mounts under ` +
          `unknown feature id "${contribution.mountUnder}".`,
      );
    }
    const mounted = byMount.get(contribution.mountUnder) ?? [];
    mounted.push(tagSubtree(contribution.feature, contribution.meta.id));
    byMount.set(contribution.mountUnder, mounted);
  }

  return attach(root, byMount);
}
