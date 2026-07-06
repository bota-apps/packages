/**
 * html/accordion — raw element primitives for the Accordion component.
 * All CVA for accordion lives here.
 */
import { forwardRef, type HTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

export const accordionRootVariants = cva("space-y-1");

export const accordionItemVariants = cva("border-b");

export const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
);

export const accordionContentVariants = cva(
  "overflow-hidden pt-0 pb-4 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
);

/** Outer container for accordion — small spacing between items. */
export const AccordionContainerEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AccordionContainerEl(props, ref) {
    return <div ref={ref} className={accordionRootVariants()} {...props} />;
  },
);

/** Single accordion item — bottom border separates items. */
export const AccordionItemEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AccordionItemEl(props, ref) {
    return <div ref={ref} className={accordionItemVariants()} {...props} />;
  },
);

/** Trigger button row — full width, chevron-rotate on open. */
export const AccordionTriggerEl = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function AccordionTriggerEl({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(accordionTriggerVariants(), className)}
      {...props}
    />
  );
});

/** Content panel — animated open/close, hidden when collapsed. */
export const AccordionContentEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AccordionContentEl(props, ref) {
    return <div ref={ref} className={accordionContentVariants()} {...props} />;
  },
);

/** Inner padding wrapper inside AccordionContentEl. */
export const AccordionInnerEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AccordionInnerEl(props, ref) {
    return <div ref={ref} className="pb-4" {...props} />;
  },
);
