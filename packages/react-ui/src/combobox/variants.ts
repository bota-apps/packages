import { cva } from "class-variance-authority";

/** Trigger button — the closed combobox control. */
export { formControlTriggerVariants as comboboxTriggerVariants } from "../html/trigger";

/** Popover dropdown panel that hosts the search input and option list. */
export const comboboxContentVariants = cva(
  "z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover text-popover-foreground shadow-overlay outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
);

/** A single option row inside the listbox. */
export const comboboxOptionVariants = cva(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted hover:text-foreground",
  {
    variants: {
      disabled: {
        true: "pointer-events-none opacity-50",
      },
      selected: {
        true: "bg-selected text-selected-foreground",
      },
    },
  },
);
