/**
 * html/textarea — styled <textarea> primitive.
 */
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

export const textareaVariants = cva(
  "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
);

export type TextareaElProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaEl = forwardRef<HTMLTextAreaElement, TextareaElProps>(function TextareaEl(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(textareaVariants(), className)} {...props} />;
});
