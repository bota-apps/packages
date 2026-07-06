import { cva, type VariantProps } from "class-variance-authority";

export const appShellVariants = cva("min-h-screen", {
  variants: {
    variant: {
      default: "relative",
      auth: "bg-background p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type AppShellVariantProps = VariantProps<typeof appShellVariants>;
