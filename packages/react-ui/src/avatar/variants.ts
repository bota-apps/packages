import { cva } from "class-variance-authority";

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const avatarImageVariants = cva("aspect-square h-full w-full");

export const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-muted",
  {
    variants: {
      // Initials size tracks the Avatar `size` — pass the same value to both.
      // `md` inherits (no explicit text size) to preserve the historical default.
      size: {
        sm: "text-xs",
        md: "",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
