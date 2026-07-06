/**
 * html/header — variant-styled <header> primitive + semantic header section elements.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const headerVariants = cva("", {
  variants: {
    variant: {
      sticky:
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      app: "sticky top-0 z-30 h-16 shrink-0 border-b bg-sidebar px-4 flex items-center justify-between gap-2 transition-[width,height] ease-linear",
    },
  },
});

export type HeaderProps = HTMLAttributes<HTMLElement> & VariantProps<typeof headerVariants>;

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { variant, className, ...props },
  ref,
) {
  return <header ref={ref} className={cn(headerVariants({ variant }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* Section header elements                                              */
/* ------------------------------------------------------------------ */

export const sectionHeaderVariants = cva(
  "pb-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between",
);

/** Outer row for a page section header (title + actions). Responsive column-to-row. */
export const SectionHeaderEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SectionHeaderEl(props, ref) {
    return <div ref={ref} className={sectionHeaderVariants()} {...props} />;
  },
);

/** Title + description group inside a SectionHeader — prevents flex overflow. */
export const SectionHeaderTitleGroupEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SectionHeaderTitleGroupEl(props, ref) {
    return <div ref={ref} className="space-y-1 min-w-0" {...props} />;
  },
);

/** Actions row inside a SectionHeader — wraps and aligns action buttons. */
export const SectionHeaderActionsEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SectionHeaderActionsEl(props, ref) {
    return (
      <div
        ref={ref}
        className="flex gap-2 flex-wrap sm:flex-nowrap sm:shrink-0 justify-end"
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------ */
/* Page header elements                                                 */
/* ------------------------------------------------------------------ */

export const pageHeaderVariants = cva("flex items-center justify-between mb-6");

/** Row header for a page — description + optional action, with bottom margin. */
export const PageHeaderEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PageHeaderEl(props, ref) {
    return <div ref={ref} className={pageHeaderVariants()} {...props} />;
  },
);

/** Left content area inside a PageHeader — allows truncation. */
export const PageHeaderContentEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PageHeaderContentEl(props, ref) {
    return <div ref={ref} className="min-w-0" {...props} />;
  },
);

/** Right action slot inside a PageHeader — prevents shrinking. */
export const PageHeaderActionEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PageHeaderActionEl(props, ref) {
    return <div ref={ref} className="shrink-0" {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* Header bar layout elements (used by HeaderBar component)            */
/* ------------------------------------------------------------------ */

/** Inner container row of an app header bar. */
export const HeaderBarContentEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function HeaderBarContentEl(props, ref) {
    return <div ref={ref} className="container h-16 flex items-center" {...props} />;
  },
);

/** Brand/logo slot in the header bar — adds right margin. */
export const HeaderBarBrandEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function HeaderBarBrandEl(props, ref) {
    return <div ref={ref} className="mr-4" {...props} />;
  },
);

/** Desktop navigation slot — hidden on mobile, flex-row-1 on desktop. */
export const HeaderBarNavEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function HeaderBarNavEl(props, ref) {
    return <div ref={ref} className="hidden lg:flex flex-1 flex-row items-center" {...props} />;
  },
);

/** Actions/user slot pushed to the right end of the header bar. */
export const HeaderBarActionsEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function HeaderBarActionsEl(props, ref) {
    return <div ref={ref} className="ml-auto flex items-center gap-4" {...props} />;
  },
);
