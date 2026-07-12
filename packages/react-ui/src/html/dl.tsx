/**
 * html/dl — variant-styled <dl>, <dt>, and <dd> primitives for semantic
 * description lists (label/value fact surfaces such as EntitySummary).
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type DlProps = HTMLAttributes<HTMLDListElement>;

export const Dl = forwardRef<HTMLDListElement, DlProps>(function Dl({ className, ...props }, ref) {
  return <dl ref={ref} className={cn(className)} {...props} />;
});

export type DtProps = HTMLAttributes<HTMLElement>;

export const Dt = forwardRef<HTMLElement, DtProps>(function Dt({ className, ...props }, ref) {
  return <dt ref={ref} className={cn(className)} {...props} />;
});

export type DdProps = HTMLAttributes<HTMLElement>;

export const Dd = forwardRef<HTMLElement, DdProps>(function Dd({ className, ...props }, ref) {
  return <dd ref={ref} className={cn(className)} {...props} />;
});
