import type { LucideIcon } from "lucide-react";
import type { NavigationItem, NavigationSection } from "./types";

/**
 * Narrow an unknown `meta` value to a renderable lucide icon: a plain function
 * component or a forwardRef/memo exotic component (object with `render`).
 */
export function isLucideIcon(value: unknown): value is LucideIcon {
  if (typeof value === "function") {
    return true;
  }
  return typeof value === "object" && value !== null && "render" in value;
}

export function isNavItemActive(item: NavigationItem, pathname: string): boolean {
  return pathname === item.to || pathname.startsWith(item.to + "/");
}

function findExactNavId(pathname: string, items: NavigationItem[]): string | undefined {
  for (const item of items) {
    if (item.children) {
      const childMatch = findExactNavId(pathname, item.children);
      if (childMatch) {
        return childMatch;
      }
    }
    if (pathname === item.to) {
      return item.id;
    }
  }
  return undefined;
}

function findPrefixNavId(pathname: string, items: NavigationItem[]): string | undefined {
  let bestId: string | undefined;
  let bestLength = -1;

  const search = (nodes: NavigationItem[]) => {
    for (const node of nodes) {
      if (pathname.startsWith(node.to + "/") && node.to.length > bestLength) {
        bestId = node.id;
        bestLength = node.to.length;
      }
      if (node.children) {
        search(node.children);
      }
    }
  };
  search(items);
  return bestId;
}

/**
 * The nav entry the current pathname belongs to: an exact route match wins,
 * otherwise the entry with the longest route prefix (so a detail page
 * highlights its list's entry).
 */
export function getActiveNavId(pathname: string, items: NavigationItem[]): string | undefined {
  return findExactNavId(pathname, items) ?? findPrefixNavId(pathname, items);
}

/**
 * Groups items by their `section` id in the configured order. Items without a
 * `section` (or in sections missing from `order`) are not returned — when you
 * group the nav, every entry needs a home.
 */
export function getNavigationSections(
  items: NavigationItem[],
  sectionLabels: Record<string, string>,
  sectionOrder: string[],
): NavigationSection[] {
  const sectionMap = new Map<string, NavigationItem[]>();
  for (const item of items) {
    if (item.section) {
      const list = sectionMap.get(item.section) ?? [];
      list.push(item);
      sectionMap.set(item.section, list);
    }
  }
  return sectionOrder
    .filter((id) => sectionMap.has(id))
    .map((id) => ({
      id,
      label: sectionLabels[id] ?? id,
      items: sectionMap.get(id) ?? [],
    }));
}
