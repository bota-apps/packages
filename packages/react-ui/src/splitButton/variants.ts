import { cva } from "class-variance-authority";

/** Group wrapper — the two segments must read as one attached control. */
export const splitButtonVariants = cva("inline-flex items-stretch", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

/** Primary (label) segment — flattens the shared edge, keeps the focus ring on top. */
export const splitButtonPrimaryVariants = cva("rounded-r-none focus-visible:z-10", {
  variants: {
    fullWidth: {
      true: "grow",
      false: "",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

/**
 * Menu-trigger (chevron) segment. Solid variants draw a soft divider in their
 * own foreground color; the outline variant overlaps the adjacent borders.
 */
export const splitButtonTriggerVariants = cva("rounded-l-none px-2 focus-visible:z-10", {
  variants: {
    variant: {
      default: "border-l border-primary-foreground/20",
      secondary: "border-l border-secondary-foreground/20",
      destructive: "border-l border-destructive-foreground/20",
      outline: "-ml-px",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Menu panel — wide enough for two-line items with descriptions. */
export const splitButtonContentVariants = cva("min-w-56");

/** Menu row — two-line rows top-align the leading icon with the label line. */
export const splitButtonItemVariants = cva("", {
  variants: {
    twoLine: {
      true: "items-start [&>svg]:mt-0.5",
      false: "",
    },
  },
  defaultVariants: {
    twoLine: false,
  },
});

/** Two-line item body next to the optional icon. */
export const splitButtonItemBodyVariants = cva("flex min-w-0 flex-col gap-0.5");

/** Secondary line under an item label. */
export const splitButtonItemDescriptionVariants = cva("text-xs text-muted-foreground");
