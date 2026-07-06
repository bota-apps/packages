import { useMemo } from "react";
import { Inline, useBreakpoint } from "@bota-apps/react-ui";
import { computeDisplayItems } from "./displayItems";
import { CrumbList } from "./crumbList";
import { useBreadcrumbItemsContext } from "./context";
import type { BreadcrumbVariant } from "./types";

export * from "./variants";
export { BreadcrumbItemsProvider, useBreadcrumbItemsContext } from "./context";
export { useBreadcrumbItems } from "./useBreadcrumbItems";
export { computeDisplayItems, type BreadcrumbDisplayItem } from "./displayItems";
export type { BreadcrumbItem, BreadcrumbVariant } from "./types";

type BreadcrumbsProps = {
  variant?: BreadcrumbVariant;
};

/**
 * Renders the crumb trail supplied by the nearest BreadcrumbItemsProvider —
 * nothing when the trail is empty or a single crumb (the page title already
 * says where you are). Collapses long trails on narrow viewports.
 */
export function Breadcrumbs({ variant = "pill" }: BreadcrumbsProps = {}) {
  const items = useBreadcrumbItemsContext();
  const bp = useBreakpoint();
  const displayItems = useMemo(() => computeDisplayItems(items, bp.below("md")), [items, bp]);

  if (items.length <= 1) {
    return null;
  }

  return (
    <Inline as="nav" aria-label="Breadcrumb" gap="xs">
      <CrumbList items={displayItems} variant={variant} />
    </Inline>
  );
}
