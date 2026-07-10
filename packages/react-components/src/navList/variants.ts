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
