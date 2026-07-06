/**
 * html/sectionList — CVA-styled primitives for collapsible section lists.
 *
 * Exports:
 *   SectionListSectionEl  — Card-like container for each section
 *   SectionListHeaderEl   — Clickable header button with chevron rotation
 *   SectionListContentEl  — Content area below the header
 */
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* SectionListSectionEl — rounded card surface per section              */
/* ------------------------------------------------------------------ */

export const SectionListSectionEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SectionListSectionEl({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("rounded-lg border overflow-hidden", className)} {...props} />
    );
  },
);

/* ------------------------------------------------------------------ */
/* SectionListHeaderEl — clickable header with chevron rotation         */
/* ------------------------------------------------------------------ */

export const SectionListHeaderEl = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function SectionListHeaderEl({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left rounded-lg bg-muted/50 hover:bg-muted/80 [&[data-state=closed]>svg]:-rotate-90 [&>svg]:transition-transform",
        className,
      )}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* SectionListContentEl — content area below header                     */
/* ------------------------------------------------------------------ */

export const SectionListContentEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SectionListContentEl({ className, ...props }, ref) {
    return <div ref={ref} className={cn("pl-11 pr-4 pb-4", className)} {...props} />;
  },
);
