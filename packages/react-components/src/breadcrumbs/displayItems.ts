import type { RoutePath } from "../routeLink";
import type { BreadcrumbItem } from "./types";

export type BreadcrumbDisplayItem =
  { kind: "crumb"; label: string; to?: RoutePath } | { kind: "overflow"; hidden: BreadcrumbItem[] };

const minItemsToCollapse = 4;

/**
 * Collapses long trails on narrow viewports to
 * `first / … / second-to-last / last`, with the middle crumbs behind an
 * overflow menu.
 */
export function computeDisplayItems(
  items: BreadcrumbItem[],
  collapse: boolean,
): BreadcrumbDisplayItem[] {
  if (!collapse || items.length < minItemsToCollapse) {
    return items.map((item) => ({ kind: "crumb", label: item.label, to: item.to }));
  }

  const first = items[0];
  const secondToLast = items[items.length - 2];
  const last = items[items.length - 1];
  const hidden = items.slice(1, items.length - 2);

  return [
    { kind: "crumb", label: first.label, to: first.to },
    { kind: "overflow", hidden },
    { kind: "crumb", label: secondToLast.label, to: secondToLast.to },
    { kind: "crumb", label: last.label, to: last.to },
  ];
}
