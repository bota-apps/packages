import type { LucideIcon } from "lucide-react";

/** One sidebar/nav entry, derived from a feature node with a `route`. */
export type NavigationItem = {
  /** The feature id the entry was built from. */
  id: string;
  label: string;
  description?: string;
  to: string;
  icon: LucideIcon;
  children?: NavigationItem[];
  /** Marked for the condensed primary nav on small viewports. */
  mobilePrimary?: boolean;
  /** Section id the entry groups under (from the node's `meta.section`). */
  section?: string;
};

export type NavigationSection = {
  id: string;
  label: string;
  items: NavigationItem[];
};

/** What a sidebar renders: grouped items plus the entry matching the current route. */
export type AppNavigation = {
  sections: NavigationSection[];
  activeNavId?: string;
};

/**
 * The injectable translation seam — receives a stable key and the English
 * default, returns the display string. The default translator returns the
 * default; apps wire their i18n library here.
 */
export type NavTranslator = (key: string, defaultValue: string) => string;

/**
 * Per-route metadata apps attach to their route definitions: the RBAC resource
 * the route exercises, the nav entry to highlight while it is active, and the
 * access mode / layout the shell derives chrome from.
 */
export type RouteMeta = {
  /** The resource ID representing the full action — e.g. "project:edit". */
  permissionId: string;
  /** The {@link NavigationItem} id to mark active while this route renders. */
  activeNavId: string;
  mode: "read" | "write";
  layout: "dashboard" | "list" | "detail" | "form" | "report";
};
