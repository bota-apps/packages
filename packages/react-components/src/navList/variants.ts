import { cva } from "class-variance-authority";

/** Sidebar nav link styling — active/inactive tone lives here as a cva variant. */
export const navItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-primary/10 text-primary",
        false: "text-muted-foreground hover:bg-muted",
      },
    },
    defaultVariants: { active: false },
  },
);
