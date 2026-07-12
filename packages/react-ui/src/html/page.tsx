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

/**
 * No gutters of its own: the app-shell content well owns page padding, and
 * PageContent adding another layer doubled it — visibly wasteful on phones.
 * PageContent contributes centring, width caps, and fixed-layout scrolling.
 */
export const pageContentVariants = cva("mx-auto w-full", {
  variants: {
    maxWidth: {
      default: "max-w-7xl",
      narrow: "max-w-2xl",
      full: "",
    },
    region: {
      /** Fixed layout header — shrink-protect. */
      header: "flex-shrink-0",
      /** Fixed layout body — scrolls internally. */
      body: "flex-1 overflow-y-auto",
      /** Default — natural flow. */
      default: "",
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
