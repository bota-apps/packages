import type { FeatureNodeDef, ResolvedFeatureNode } from "@bota-apps/types/fm";
import { isLucideIcon } from "./helpers";
import type { NavigationItem, NavTranslator } from "./types";

// The nav-relevant face shared by raw defs and resolved nodes.
type NavSource = {
  id: string;
  label?: string;
  route?: string;
  meta?: Record<string, unknown>;
};

function toNavItem(node: NavSource): NavigationItem | undefined {
  if (!node.route) {
    return undefined;
  }

  const iconCandidate = node.meta?.icon;
  if (!isLucideIcon(iconCandidate)) {
    return undefined;
  }

  const mobilePrimary = node.meta?.mobilePrimary;
  const section = node.meta?.section;

  return {
    id: node.id,
    label: node.label ?? node.id,
    to: node.route,
    icon: iconCandidate,
    mobilePrimary: typeof mobilePrimary === "boolean" ? mobilePrimary : undefined,
    section: typeof section === "string" ? section : undefined,
  };
}

function withChildren(
  item: NavigationItem | undefined,
  children: NavigationItem[],
): NavigationItem | undefined {
  if (!item) {
    return undefined;
  }
  return children.length > 0 ? { ...item, children } : item;
}

/**
 * One resolved node → one nav entry, or nothing when the node is hidden, has
 * no route, or carries no icon in `meta.icon`. Hidden descendants are pruned
 * at every level; blocked nodes stay (advertised but gated — the page itself
 * guards).
 */
export function featureToNavItem(node: ResolvedFeatureNode): NavigationItem | undefined {
  if (node.status === "hidden") {
    return undefined;
  }
  const children = node.children
    .map((child) => featureToNavItem(child))
    .filter((child): child is NavigationItem => child !== undefined);
  return withChildren(toNavItem(node), children);
}

/** The gated nav — the resolved root's children, hidden nodes pruned. */
export function buildNavFromTree(root: ResolvedFeatureNode): NavigationItem[] {
  return root.children
    .map((child) => featureToNavItem(child))
    .filter((item): item is NavigationItem => item !== undefined);
}

function defToNavItem(node: FeatureNodeDef): NavigationItem | undefined {
  const children = (node.children ?? [])
    .map((child) => defToNavItem(child))
    .filter((child): child is NavigationItem => child !== undefined);
  return withChildren(toNavItem(node), children);
}

/**
 * The static, ungated nav from the raw defs — every routed node regardless of
 * gating. Use for route⇄id lookups (e.g. active-entry matching), never for
 * what the user actually sees.
 */
export function buildNavFromDefs(root: FeatureNodeDef): NavigationItem[] {
  return (root.children ?? [])
    .map((child) => defToNavItem(child))
    .filter((item): item is NavigationItem => item !== undefined);
}

export function findFeatureById(
  root: ResolvedFeatureNode,
  id: string,
): ResolvedFeatureNode | undefined {
  if (root.id === id) {
    return root;
  }
  for (const child of root.children) {
    const found = findFeatureById(child, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

/** Applies the translator to every label, keyed by feature id. */
export function translateNavItems(items: NavigationItem[], t: NavTranslator): NavigationItem[] {
  return items.map((item) => ({
    ...item,
    label: t(item.id, item.label),
    children: item.children ? translateNavItems(item.children, t) : undefined,
  }));
}
