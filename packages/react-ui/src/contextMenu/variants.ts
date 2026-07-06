import { cva } from "class-variance-authority";
import { menuContentVariants } from "../html/menu";

export {
  menuSubTriggerVariants as contextMenuSubTriggerVariants,
  menuSubContentVariants as contextMenuSubContentVariants,
  menuItemVariants as contextMenuItemVariants,
  menuCheckboxItemVariants as contextMenuCheckboxItemVariants,
  menuRadioItemVariants as contextMenuRadioItemVariants,
  menuLabelVariants as contextMenuLabelVariants,
} from "../html/menu";

/** Shared menu panel plus context-menu-specific entrance animation. */
export const contextMenuContentVariants = cva(
  menuContentVariants({ className: "overflow-hidden animate-in fade-in-80" }),
);
