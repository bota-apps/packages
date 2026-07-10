import { cva } from "class-variance-authority";

/**
 * Nav link styling — active/inactive tone lives here as a cva variant.
 * Nav links render inside the shell chrome, so they style against the
 * chrome-scoped sidebar-* tokens (not the page's muted/selected tokens): a
 * brand with a dark rail over a light page keeps its links readable, and with
 * the default tokens this matches the page-scoped look exactly.
 */
export const navItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-sidebar-primary/10 text-sidebar-primary",
        false: "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);

/**
 * Menu-panel counterpart of navItemVariants: horizontal nav groups open as
 * portaled menus on a popover surface (page-scoped tokens), so the active row
 * carries the selected tint rather than the chrome-scoped sidebar one. The
 * row's base look comes from the menu item recipe; this only layers the
 * active state.
 */
export const navMenuItemVariants = cva("", {
  variants: {
    active: {
      true: "bg-selected text-selected-foreground",
      false: "",
    },
  },
  defaultVariants: { active: false },
});
