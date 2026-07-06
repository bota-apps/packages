import { cva } from "class-variance-authority";

/**
 * Base classes for the app-shell root container per layout. Thin by design —
 * the inner sidebar/header/main styling stays inline in each layout file,
 * which is the one place that chrome arrangement is styled.
 */
export const appShellLayoutVariants = cva("min-h-screen", {
  variants: {
    layout: {
      sidebar: "flex",
      topnav: "flex flex-col",
    },
  },
  defaultVariants: { layout: "sidebar" },
});
