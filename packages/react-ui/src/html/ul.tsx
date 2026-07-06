/**
 * html/ul — variant-styled <ul> and <li> primitives.
 */
import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type UlProps = HTMLAttributes<HTMLUListElement>;

export const Ul = forwardRef<HTMLUListElement, UlProps>(function Ul({ className, ...props }, ref) {
  return <ul ref={ref} className={cn(className)} {...props} />;
});

export type LiProps = LiHTMLAttributes<HTMLLIElement>;

export const Li = forwardRef<HTMLLIElement, LiProps>(function Li({ className, ...props }, ref) {
  return <li ref={ref} className={cn(className)} {...props} />;
});
