/**
 * html/nav — variant-styled <nav> primitive + tab-nav utilities.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const navVariants = cva("", {
  variants: {
    variant: {
      sidebar: "flex-1 space-y-1 px-4",
      tabBar:
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground max-md:flex max-md:w-full max-md:h-auto max-md:justify-start max-md:overflow-x-auto max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
    },
  },
});

export type NavProps = HTMLAttributes<HTMLElement> & VariantProps<typeof navVariants>;

export const Nav = forwardRef<HTMLElement, NavProps>(function Nav(
  { variant, className, ...props },
  ref,
) {
  return <nav ref={ref} className={cn(navVariants({ variant }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* tabNavLinkVariants — tab navigation link styles                     */
/* ------------------------------------------------------------------ */

export const tabNavLinkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 max-md:shrink-0 max-md:px-2.5 max-md:py-1.5 max-md:text-xs",
  {
    variants: {
      active: {
        true: "bg-background text-foreground shadow-raised",
        false: "hover:bg-background/50 hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);

/** Returns the className for a tab nav link. `active=true` applies the selected state. */
export function tabNavLinkClass(active?: boolean): string {
  return tabNavLinkVariants({ active: active ?? false });
}

/* ------------------------------------------------------------------ */
/* TabNavContainerEl — outer wrapper for the tab nav bar              */
/* ------------------------------------------------------------------ */

export const TabNavContainerEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TabNavContainerEl(props, ref) {
    return <div ref={ref} className="mb-6" {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* BackLinkEl — wrapper for a "back" navigation link                  */
/* ------------------------------------------------------------------ */

export const backLinkVariants = cva(
  "mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground [&>a]:inline-flex [&>a]:items-center [&>a]:gap-1 [&_svg]:size-4",
);

export const BackLinkEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function BackLinkEl(props, ref) {
    return <div ref={ref} className={backLinkVariants()} {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* SidebarNavLabelEl — depth-variant label inside a sidebar nav item   */
/* ------------------------------------------------------------------ */

const sidebarNavLabelVariants = cva("", {
  variants: {
    depth: {
      "0": "",
      "1": "text-sm font-normal text-muted-foreground/90 group-[.text-primary]:text-primary",
      "2": "text-xs font-normal text-muted-foreground/70 group-[.text-primary]:text-primary",
    },
  },
  defaultVariants: { depth: "0" },
});

export type SidebarNavLabelElProps = HTMLAttributes<HTMLSpanElement> & {
  depth?: 0 | 1 | 2;
};

export const SidebarNavLabelEl = forwardRef<HTMLSpanElement, SidebarNavLabelElProps>(
  function SidebarNavLabelEl({ depth = 0, ...props }, ref) {
    const d: "0" | "1" | "2" = depth >= 2 ? "2" : depth === 1 ? "1" : "0";
    return <span ref={ref} className={sidebarNavLabelVariants({ depth: d })} {...props} />;
  },
);
