import type { RoutePath } from "../routeLink";

export type BreadcrumbItem = {
  label: string;
  /** Omitted on the current (last) crumb — it renders as text, not a link. */
  to?: RoutePath;
};

export type BreadcrumbVariant = "slash" | "pill" | "highlighted";
