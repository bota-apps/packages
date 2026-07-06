import { Link, type LinkComponentProps, type LinkProps } from "@tanstack/react-router";
import {
  ActionLink,
  QuickLink,
  SidebarNavLink,
  type SidebarNavLinkVariant,
  cn,
  sidebarNavLinkClass,
} from "@bota-apps/react-ui";
import type { LucideIcon } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { routeLinkVariants } from "./variants";

export * from "./variants";

/**
 * The router-typed path union — matches Link's `to` prop. Through TanStack
 * Router's module augmentation this narrows to the app's registered routes
 * when used from app context; inside packages it stays the open union.
 */
export type RoutePath = NonNullable<LinkProps["to"]>;

/**
 * Boundary helper: promotes a plain `string` (from declarative sources like
 * the feature tree or API action targets) into the typed `RoutePath` union
 * accepted by TanStack Router. The string is assumed to be a valid route —
 * no runtime validation. Use only at the single boundary between untyped
 * configuration and the typed router, never inside business logic.
 */
export function toRoutePath(route: string): RoutePath {
  return route;
}

export type RouteLinkVariant = "side-bar-nav-link" | "quick-link" | "text";

type BaseLinkProps = Omit<LinkComponentProps, "children" | "to"> & {
  to: RoutePath;
};

type SidebarNavLinkRouteLinkProps = BaseLinkProps & {
  variant: "side-bar-nav-link";
  icon?: LucideIcon;
  label: string;
  treeLevel?: number;
  navVariant?: SidebarNavLinkVariant;
  active?: boolean;
  suffix?: ReactNode;
};

type TextRouteLinkProps = BaseLinkProps & {
  variant: "text";
  icon?: LucideIcon;
  label: string;
  size?: "default" | "lg";
};

type QuickLinkRouteLinkProps = BaseLinkProps & {
  variant: "quick-link";
  icon: LucideIcon;
  label: string;
  description?: string;
  suffix?: ReactNode;
};

/** Discriminated on `variant` — each variant carries exactly its own visual props. */
export type RouteLinkProps =
  SidebarNavLinkRouteLinkProps | TextRouteLinkProps | QuickLinkRouteLinkProps;

/**
 * RouteLink — the one place a router <Link> meets the react-ui link visuals.
 * Feature code picks a variant and passes typed props; it never styles the
 * anchor itself.
 */
export const RouteLink = forwardRef<HTMLAnchorElement, RouteLinkProps>(
  function RouteLinkInner(props, ref) {
    if (props.variant === "side-bar-nav-link") {
      const {
        variant: _variant,
        icon,
        label,
        treeLevel,
        navVariant,
        active,
        suffix,
        to,
        className,
        ...rest
      } = props;
      return (
        <Link
          ref={ref}
          to={to}
          className={cn(sidebarNavLinkClass(navVariant, active), className)}
          {...rest}
        >
          <SidebarNavLink icon={icon} label={label} treeLevel={treeLevel} suffix={suffix} />
        </Link>
      );
    }

    if (props.variant === "text") {
      const { variant, icon, label, size, to, className, ...rest } = props;
      return (
        <Link ref={ref} to={to} className={cn(routeLinkVariants({ variant }), className)} {...rest}>
          <ActionLink icon={icon} label={label} size={size} />
        </Link>
      );
    }

    const { variant: _variant, icon, label, description, suffix, to, ...rest } = props;
    return (
      <Link ref={ref} to={to} {...rest}>
        <QuickLink icon={icon} label={label} description={description} suffix={suffix} />
      </Link>
    );
  },
);
