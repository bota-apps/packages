import { cva, type VariantProps } from "class-variance-authority";

/** ReadinessSummary root — a vertical stack: header, then grouped issues. */
export const readinessSummaryVariants = cva("flex flex-col gap-4");

/**
 * Issue severity — drives the marker icon color. Never the only signal: each
 * issue also has a default shape icon and a text label, and the header states
 * the count in words.
 */
export const readinessIssueIconVariants = cva("mt-0.5 shrink-0 [&_svg]:size-4 [&_svg]:shrink-0", {
  variants: {
    severity: {
      error: "text-destructive",
      warning: "text-status-warning",
      info: "text-muted-foreground",
    },
  },
  defaultVariants: {
    severity: "error",
  },
});

/**
 * A single issue row. Becomes a full-width button when the issue is actionable,
 * taking the shared focus ring and a transient `muted` hover surface.
 */
export const readinessIssueVariants = cva(
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

export type ReadinessSeverity = NonNullable<
  VariantProps<typeof readinessIssueIconVariants>["severity"]
>;
