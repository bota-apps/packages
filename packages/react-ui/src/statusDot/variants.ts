import { cva, type VariantProps } from "class-variance-authority";

export const statusDotVariants = cva("inline-block rounded-full shrink-0", {
  variants: {
    status: {
      green: "bg-status-success",
      red: "bg-status-danger",
      yellow: "bg-status-warning",
      gray: "bg-status-neutral",
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
    },
  },
  defaultVariants: { status: "gray", size: "sm" },
});

export type StatusDotProps = VariantProps<typeof statusDotVariants>;
