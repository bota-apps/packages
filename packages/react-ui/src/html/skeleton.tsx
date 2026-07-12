/**
 * html/skeleton — animated placeholder <div>.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

// Shimmer sweep: the gradient rides above bg-muted (background-image over
// background-color), so the translucent via-stop reads as a highlight moving
// across an opaque placeholder in both modes.
export const skeletonVariants = cva(
  "rounded-md bg-muted bg-gradient-to-r from-muted via-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none",
);

export type SkeletonElProps = HTMLAttributes<HTMLDivElement>;

export const SkeletonEl = forwardRef<HTMLDivElement, SkeletonElProps>(function SkeletonEl(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(skeletonVariants(), className)} {...props} />;
});
