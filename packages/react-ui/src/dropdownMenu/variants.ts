import { cva } from "class-variance-authority";
import { menuContentVariants, menuSubContentVariants } from "../html/menu";

export {
  menuSubTriggerVariants as dropdownMenuSubTriggerVariants,
  menuItemVariants as dropdownMenuItemVariants,
  menuCheckboxItemVariants as dropdownMenuCheckboxItemVariants,
  menuRadioItemVariants as dropdownMenuRadioItemVariants,
  menuLabelVariants as dropdownMenuLabelVariants,
} from "../html/menu";

/** Shared sub-menu panel anchored to the dropdown-menu transform origin. */
export const dropdownMenuSubContentVariants = cva(
  menuSubContentVariants({
    className: "origin-[--radix-dropdown-menu-content-transform-origin]",
  }),
);

/** Shared menu panel plus dropdown-specific scrolling and transform origin. */
export const dropdownMenuContentVariants = cva(
  menuContentVariants({
    className:
      "max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto overflow-x-hidden origin-[--radix-dropdown-menu-content-transform-origin]",
  }),
);
