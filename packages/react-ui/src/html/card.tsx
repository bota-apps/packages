/**
 * html/card — variant-styled card surface + navigation tile + card-internal layout elements.
 *
 * Exports:
 *   CardEl         — bordered panel surface (Card component)
 *   TileEl         — interactive navigation tile (QuickLink component)
 *   TileIconEl     — icon container inside a tile
 *   CardIconEl     — feature icon container (feature card variant)
 *   CardHeaderEl   — card header row with spacing variant
 *   CardTitleGroupEl — title+description stack inside header
 *   CardButtonEl   — card-style interactive button
 */
import { forwardRef, type HTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* CardEl — rounded bordered panel surface                             */
/* ------------------------------------------------------------------ */

export const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      /** Standard card with padding. */
      default: "p-6",
      /** Hover-lift card for grid listings. */
      interactive:
        "h-full transition-shadow duration-200 hover:shadow-lg hover:border-primary/50 group",
      /** Icon-above-title feature card — caller provides internal layout. */
      feature: "",
      /** Tighter padding for dense contexts. */
      compact: "p-4",
      /** Content surface — slightly larger radius, subtle bg. */
      surface: "rounded-xl bg-background shadow-sm border-border/50 p-6",
    },
    /** Stretch to fill the parent's width and height (e.g. a grid/flex cell). */
    fill: {
      true: "h-full w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    fill: false,
  },
});

export type CardElProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export const CardEl = forwardRef<HTMLDivElement, CardElProps>(function CardEl(
  { variant, fill, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ variant, fill }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* TileEl — interactive navigation tile (QuickLink pattern)            */
/* ------------------------------------------------------------------ */

export const tileVariants = cva(
  "group relative flex items-center gap-4 rounded-xl border border-border/60 bg-card text-left transition-all duration-200 hover:border-primary/40 hover:bg-muted/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
  {
    variants: {
      /** Row: single-column list. Grid: multi-column grid. */
      layout: {
        row: "px-5 py-4",
        grid: "flex-col items-start px-5 py-5",
      },
    },
    defaultVariants: {
      layout: "row",
    },
  },
);

export type TileElProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof tileVariants>;

export const TileEl = forwardRef<HTMLDivElement, TileElProps>(function TileEl(
  { layout, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(tileVariants({ layout }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* TileIconEl — icon badge inside a TileEl                             */
/* ------------------------------------------------------------------ */

const tileIconVariants = cva(
  "flex items-center justify-center rounded-lg shrink-0 [&>svg]:size-5",
  {
    variants: {
      layout: {
        row: "h-10 w-10 bg-primary/10 text-primary",
        grid: "h-10 w-10 bg-primary/10 text-primary mb-1",
      },
    },
    defaultVariants: {
      layout: "row",
    },
  },
);

export type TileIconElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tileIconVariants>;

export const TileIconEl = forwardRef<HTMLDivElement, TileIconElProps>(function TileIconEl(
  { layout, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(tileIconVariants({ layout }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* Card internal layout elements                                        */
/* ------------------------------------------------------------------ */

/** Icon container inside a feature card — sizes and colors the icon. */
export const CardIconEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardIconEl(props, ref) {
    return <div ref={ref} className="[&>svg]:h-10 [&>svg]:w-10 text-primary mb-4" {...props} />;
  },
);

const cardHeaderVariants = cva("flex items-start justify-between", {
  variants: {
    /** Spacing after the header row. */
    spacing: {
      /** Standard card — space below header. */
      default: "mb-6",
      /** Interactive card — tighter spacing. */
      compact: "pb-3",
    },
  },
  defaultVariants: { spacing: "default" },
});

/** Header row inside a card (title + optional headerRight). */
export const CardHeaderEl = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(function CardHeaderEl({ spacing, className, ...props }, ref) {
  return <div ref={ref} className={cn(cardHeaderVariants({ spacing }), className)} {...props} />;
});

/** Title + description column inside a CardHeaderEl — flex-col with tight spacing. */
export const CardTitleGroupEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardTitleGroupEl(props, ref) {
    return <div ref={ref} className="flex flex-col space-y-1.5" {...props} />;
  },
);

/** Card-style interactive button (e.g. schema selector items). */
export const CardButtonEl = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function CardButtonEl(props, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="w-full text-left rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg hover:border-primary/50 cursor-pointer"
        {...props}
      />
    );
  },
);
