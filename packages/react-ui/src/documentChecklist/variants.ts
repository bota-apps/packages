import { cva, type VariantProps } from "class-variance-authority";

/** DocumentChecklist root — a vertical stack: header/progress, then the item list. */
export const documentChecklistVariants = cva("@container flex flex-col gap-4");

/**
 * Per-item status marker — drives the icon color. Never the only signal: each
 * item pairs a distinct shape icon with a worded status label, and the header
 * states overall completeness in words.
 */
export const documentChecklistIconVariants = cva(
  "mt-0.5 shrink-0 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      status: {
        provided: "text-emerald-600 dark:text-emerald-400",
        missing: "text-destructive",
        pending: "text-muted-foreground",
        expired: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      status: "missing",
    },
  },
);

/**
 * A single document row. Becomes a full-width button when the item is
 * actionable (`onSelect`), taking the shared focus ring and a transient
 * `muted` hover surface; otherwise it renders as a static row.
 */
export const documentChecklistItemVariants = cva(
  "flex w-full min-w-0 items-start gap-2.5 rounded-md text-left",
  {
    variants: {
      interactive: {
        true: "cursor-pointer px-2 -mx-2 py-1.5 transition-colors duration-fast ease-standard hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 motion-reduce:transition-none",
        false: "py-1",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  },
);

export type DocumentStatus = NonNullable<
  VariantProps<typeof documentChecklistIconVariants>["status"]
>;
