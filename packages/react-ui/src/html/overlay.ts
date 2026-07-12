/**
 * html/overlay — foundational cvas for modal surfaces (dialog, alert dialog, sheet).
 */
import { cva } from "class-variance-authority";

/** Full-screen dimmed backdrop rendered behind a modal surface. */
export const overlayVariants = cva(
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
);

/** Centered modal panel shared by dialog and alert-dialog content. Renders on
 * the popover surface tier — identical to background in light, a lightness
 * step above the page in dark, where surface lightness carries elevation. */
export const modalContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-popover text-popover-foreground p-6 shadow-floating duration-base ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
);
