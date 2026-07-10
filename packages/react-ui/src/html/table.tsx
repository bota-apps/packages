/**
 * html/table — variant-styled table element primitives.
 * These replace the raw tags in table.tsx — raw <table> etc. live only here.
 */
import { forwardRef } from "react";
import type {
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Scroll + wrapper containers                                          */
/* ------------------------------------------------------------------ */

/** Scroll wrapper for wide tables — prevents horizontal overflow. */
export const TableScrollContainerEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TableScrollContainerEl(props, ref) {
    return <div ref={ref} className="relative w-full overflow-auto" {...props} />;
  },
);

/** Rounded-border wrapper for DataTable — wraps the scroll container + table. */
export const TableDataWrapperEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TableDataWrapperEl(props, ref) {
    return <div ref={ref} className="rounded-md border" {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* Core table elements                                                  */
/* ------------------------------------------------------------------ */

export const TableEl = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function TableEl({ className, ...props }, ref) {
    return (
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    );
  },
);

export const TheadEl = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TheadEl({ className, ...props }, ref) {
    return <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />;
  },
);

export const TbodyEl = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TbodyEl({ className, ...props }, ref) {
    return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
  },
);

export const TfootEl = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TfootEl({ className, ...props }, ref) {
    return (
      <tfoot
        ref={ref}
        className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------ */
/* TrEl — table row with optional clickable variant                     */
/* ------------------------------------------------------------------ */

export const trVariants = cva(
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  {
    variants: {
      clickable: {
        true: "cursor-pointer",
      },
      severity: {
        warning:
          "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/40 dark:hover:bg-yellow-950/60",
        error: "bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60",
      },
    },
  },
);

export type TrElProps = HTMLAttributes<HTMLTableRowElement> & VariantProps<typeof trVariants>;

export const TrEl = forwardRef<HTMLTableRowElement, TrElProps>(function TrEl(
  { clickable, severity, className, ...props },
  ref,
) {
  return <tr ref={ref} className={cn(trVariants({ clickable, severity }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* ThEl — table header cell with align + sortable variants             */
/* ------------------------------------------------------------------ */

export const thVariants = cva(
  "h-8 px-2 md:h-10 md:px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      sortable: {
        true: "cursor-pointer select-none",
      },
    },
    defaultVariants: { align: "left" },
  },
);

export type ThElProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> &
  VariantProps<typeof thVariants>;

export const ThEl = forwardRef<HTMLTableCellElement, ThElProps>(function ThEl(
  { align, sortable, className, ...props },
  ref,
) {
  return <th ref={ref} className={cn(thVariants({ align, sortable }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* TdEl — table data cell with align + empty variants                  */
/* ------------------------------------------------------------------ */

export const tdVariants = cva(
  "px-2 py-2 md:px-4 md:py-3 align-middle [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      empty: {
        true: "h-24 text-center",
      },
    },
  },
);

export type TdElProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> &
  VariantProps<typeof tdVariants>;

export const TdEl = forwardRef<HTMLTableCellElement, TdElProps>(function TdEl(
  { align, empty, className, ...props },
  ref,
) {
  return <td ref={ref} className={cn(tdVariants({ align, empty }), className)} {...props} />;
});

export const CaptionEl = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(function CaptionEl({ className, ...props }, ref) {
  return (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  );
});

/* ------------------------------------------------------------------ */
/* Pagination elements — used by DataTable server-side pagination       */
/* ------------------------------------------------------------------ */

/** Footer bar for pagination controls. */
export const PaginationBarEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PaginationBarEl(props, ref) {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between border-t px-2 py-2 md:px-4 md:py-3"
        {...props}
      />
    );
  },
);

/** Info text inside PaginationBarEl. */
export const PaginationInfoEl = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function PaginationInfoEl(props, ref) {
  return <p ref={ref} className="text-sm text-muted-foreground" {...props} />;
});

/** Prev/Next button inside PaginationBarEl. */
export const PaginationButtonEl = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function PaginationButtonEl(props, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
      {...props}
    />
  );
});
