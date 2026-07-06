/**
 * html/skeleton — animated placeholder <div>.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

export const skeletonVariants = cva("animate-pulse rounded-md bg-muted");

export type SkeletonElProps = HTMLAttributes<HTMLDivElement>;

export const SkeletonEl = forwardRef<HTMLDivElement, SkeletonElProps>(function SkeletonEl(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(skeletonVariants(), className)} {...props} />;
});
