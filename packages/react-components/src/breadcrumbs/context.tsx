import { createContext, useContext, type ReactNode } from "react";
import type { BreadcrumbItem } from "./types";

// Default [] (not undefined): breadcrumbs are optional chrome — surfaces like
// PageContainer render <Breadcrumbs /> unconditionally and it collapses to
// nothing when no provider supplies items.
const BreadcrumbItemsContext = createContext<BreadcrumbItem[]>([]);

type BreadcrumbItemsProviderProps = {
  items: BreadcrumbItem[];
  children: ReactNode;
};

/** Hosts the current route's crumb trail — typically fed by useBreadcrumbItems. */
export function BreadcrumbItemsProvider({ items, children }: BreadcrumbItemsProviderProps) {
  return (
    <BreadcrumbItemsContext.Provider value={items}>{children}</BreadcrumbItemsContext.Provider>
  );
}

export function useBreadcrumbItemsContext(): BreadcrumbItem[] {
  return useContext(BreadcrumbItemsContext);
}
