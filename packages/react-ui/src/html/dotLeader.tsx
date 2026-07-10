/**
 * html/dotLeader — dotted leader line for label……value rows.
 *
 * Drop it between the label and the value inside an `Inline` row (print-fidelity
 * documents like statements or invoices): it grows to fill the gap and draws a
 * dotted rule nudged up to sit near the text baseline. Decorative only
 * (`aria-hidden`).
 *
 * The component lives here (html/ is the styling source of truth); the public
 * surface is the `dotLeader/` component module, mirroring html/layout.tsx.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const dotLeaderVariants = cva(
  "flex-1 border-b border-dotted border-border/50 mx-3 translate-y-[-3px]",
);

export type DotLeaderProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dotLeaderVariants>;

export const DotLeader = forwardRef<HTMLDivElement, DotLeaderProps>(function DotLeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} aria-hidden className={cn(dotLeaderVariants(), className)} {...props} />;
});
