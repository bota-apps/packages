import { cva } from "class-variance-authority";

export const avatarVariants = cva("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full");

export const avatarImageVariants = cva("aspect-square h-full w-full");

export const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-muted",
);
