import { cva } from "class-variance-authority";

export const radioGroupVariants = cva("grid gap-2");

export const radioGroupItemVariants = cva(
  "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow-raised focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
);
