import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useFeatureTree, type FeatureRegistry } from "@bota-apps/fm";
import type { AppNavigation, NavigationItem, NavigationSection, NavTranslator } from "./types";
import { getActiveNavId, getNavigationSections } from "./helpers";
import {
  buildNavFromDefs,
  buildNavFromTree,
  featureToNavItem,
  findFeatureById,
  translateNavItems,
} from "./featureNavigation";

export type AppNavigationSectionsConfig = {
  /** Section ids in display order. */
  order: string[];
  /** English display labels per section id (default: the id itself). */
  labels?: Record<string, string>;
};

export type CreateAppNavigationOptions = {
  registry: FeatureRegistry;
  /**
   * Hook returning the translator applied to item labels (keyed by feature id)
   * and section labels (keyed by section id). Defaults to the English labels.
   * Must itself be a valid hook (it is called inside the returned hooks).
   */
  useTranslator?: () => NavTranslator;
  sections?: AppNavigationSectionsConfig;
};

export type AppNavigationApi = {
  /** The static, ungated nav (route⇄id map) — built once from the raw defs. */
  navigationConfig: NavigationItem[];
  /** The gated nav: hidden features pruned, labels translated. */
  useNavigationItems: () => NavigationItem[];
  /** What the sidebar renders: grouped sections + the active entry id. */
  useAppNavigation: () => AppNavigation;
  /** A feature's child entries — for hub pages listing their sub-features. */
  useChildNavigationItems: (
    parentId: string,
    options?: { excludeSelf?: boolean },
  ) => NavigationItem[];
};

const useEnglishLabels: () => NavTranslator = () => (_key, defaultValue) => defaultValue;

/**
 * Binds the app's feature registry (and optional i18n/sections config) into
 * the navigation hooks — each app calls this once in `src/appNavigation.ts`
 * and its shell consumes the returned hooks.
 */
export function createAppNavigation(options: CreateAppNavigationOptions): AppNavigationApi {
  const { registry, useTranslator = useEnglishLabels, sections } = options;
  const navigationConfig = buildNavFromDefs(registry.tree);

  function useNavigationItems(): NavigationItem[] {
    const tree = useFeatureTree();
    const t = useTranslator();
    return useMemo(() => translateNavItems(buildNavFromTree(tree), t), [tree, t]);
  }

  function useAppNavigation(): AppNavigation {
    const items = useNavigationItems();
    const t = useTranslator();
    const pathname = useRouterState({ select: (state) => state.location.pathname });

    return useMemo(() => {
      const built: NavigationSection[] = sections
        ? getNavigationSections(items, buildSectionLabels(sections, t), sections.order)
        : [{ id: "main", label: "", items }];
      return {
        sections: built,
        activeNavId: getActiveNavId(pathname, navigationConfig),
      };
    }, [items, pathname, t]);
  }

  function useChildNavigationItems(
    parentId: string,
    childOptions?: { excludeSelf?: boolean },
  ): NavigationItem[] {
    const tree = useFeatureTree();
    const t = useTranslator();
    const excludeSelf = childOptions?.excludeSelf ?? false;

    return useMemo(() => {
      const parent = findFeatureById(tree, parentId);
      if (!parent) {
        return [];
      }
      let childItems = parent.children
        .map((child) => featureToNavItem(child))
        .filter((child): child is NavigationItem => child !== undefined);
      if (excludeSelf && parent.route) {
        childItems = childItems.filter((child) => child.to !== parent.route);
      }
      return translateNavItems(childItems, t);
    }, [tree, parentId, t, excludeSelf]);
  }

  return { navigationConfig, useNavigationItems, useAppNavigation, useChildNavigationItems };
}

function buildSectionLabels(
  sections: AppNavigationSectionsConfig,
  t: NavTranslator,
): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const id of sections.order) {
    labels[id] = t(id, sections.labels?.[id] ?? id);
  }
  return labels;
}
