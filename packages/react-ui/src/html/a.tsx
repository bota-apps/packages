/**
 * html/a — variant-styled <a> primitive + nav-link class utility.
 */
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const anchorVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground hover:underline",
      primary: "font-medium text-primary hover:underline",
      muted: "text-muted-foreground hover:text-foreground",
      /** Full-width bordered button-like link for social providers */
      buttonOutline:
        "flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type AProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof anchorVariants>;

export const A = forwardRef<HTMLAnchorElement, AProps>(function A(
  { variant, className, ...props },
  ref,
) {
  return <a ref={ref} className={cn(anchorVariants({ variant }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* navLinkVariants — className generator for navigation link wrappers  */
/*                                                                      */
/* Used by SidebarNavLink. Applied to the outer link element (RouteLink */
/* or similar) to control its visual style and active state.           */
/* ------------------------------------------------------------------ */

export const navLinkVariants = cva("", {
  variants: {
    navVariant: {
      /** Default: no chrome — parent container (SidebarMenuButton etc.) provides styling. */
      default: "",
      /** Horizontal marketing nav bar: pill with animated underline on active. */
      main: [
        "group inline-flex h-9 w-max items-center justify-center",
        "rounded-md px-4 py-2 text-sm font-medium",
        "transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "relative",
        "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full",
        "after:origin-left after:scale-x-0 after:bg-primary",
        "after:transition-transform after:duration-300 hover:after:scale-x-100",
      ].join(" "),
      /** Vertical sidebar nav — SidebarMenuButton provides all layout/sizing.
       *  We only add `group` so depth-label color inherits via group-[.text-primary]. */
      sidebar: "group",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [{ navVariant: "main", active: true, class: "text-primary after:scale-x-100" }],
  defaultVariants: {
    navVariant: "default",
    active: false,
  },
});

export type NavLinkVariant = NonNullable<VariantProps<typeof navLinkVariants>["navVariant"]>;

/** Returns the className string for a navigation link based on variant and active state. */
export function navLinkClass(navVariant?: NavLinkVariant, active?: boolean): string {
  return navLinkVariants({ navVariant: navVariant ?? "default", active: active ?? false });
}
