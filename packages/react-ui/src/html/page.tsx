/**
 * html/page — variant-styled page layout elements.
 * Used by the Page, PageContent, and ContentSurface components.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* PageEl — root page wrapper                                           */
/* ------------------------------------------------------------------ */

export const pageVariants = cva("", {
  variants: {
    layout: {
      /** Natural flow — no height constraint. */
      flow: "",
      /** Fixed height — flex-col, children scroll internally. */
      fixed: "flex flex-col h-full",
    },
  },
  defaultVariants: { layout: "flow" },
});

export type PageElProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof pageVariants>;

export const PageEl = forwardRef<HTMLDivElement, PageElProps>(function PageEl(
  { layout, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(pageVariants({ layout }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* PageContentEl — centred, padded content area                        */
/* ------------------------------------------------------------------ */

export const pageContentVariants = cva("mx-auto w-full px-3 md:px-4", {
  variants: {
    maxWidth: {
      default: "max-w-7xl",
      narrow: "max-w-2xl",
      full: "",
    },
    region: {
      /** Fixed layout header — shrink-protect + top padding. */
      header: "flex-shrink-0 pt-6",
      /** Fixed layout body — scrolls internally. */
      body: "flex-1 overflow-y-auto pb-6",
      /** Default — vertical padding both sides. */
      default: "py-6",
    },
  },
  defaultVariants: { maxWidth: "default", region: "default" },
});

export type PageContentElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageContentVariants>;

export const PageContentEl = forwardRef<HTMLDivElement, PageContentElProps>(function PageContentEl(
  { maxWidth, region, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(pageContentVariants({ maxWidth, region }), className)}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* ContentSurfaceEl — elevated card-like content panel                 */
/* ------------------------------------------------------------------ */

export const ContentSurfaceEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ContentSurfaceEl(props, ref) {
    return (
      <div
        ref={ref}
        className="w-full rounded-xl bg-background shadow-raised border border-border/50 p-4 md:p-6"
        {...props}
      />
    );
  },
);
