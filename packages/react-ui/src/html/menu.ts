/**
 * html/menu — foundational cvas shared by the Radix menu components
 * (dropdown menu, context menu).
 */
import { cva } from "class-variance-authority";

/** Sub-menu trigger row. */
export const menuSubTriggerVariants = cva(
  "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-muted focus:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
    },
  },
);

/** Sub-menu popover panel. */
export const menuSubContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
);

/**
 * Root menu popover panel. Deliberately carries no overflow classes — each
 * menu component adds its own scrolling behavior on top of this base.
 */
export const menuContentVariants = cva(
  "z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
);

/** Plain actionable menu row. */
export const menuItemVariants = cva(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
    },
  },
);

/** Checkable menu row with a leading indicator slot. */
export const menuCheckboxItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
);

/** Radio menu row with a leading indicator slot. */
export const menuRadioItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
);

/** Non-interactive section label. */
export const menuLabelVariants = cva("px-2 py-1.5 text-sm font-semibold text-foreground", {
  variants: {
    inset: {
      true: "pl-8",
      false: "",
    },
  },
});
