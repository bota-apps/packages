import { cva } from "class-variance-authority";

/**
 * Classes RouteLink puts on the router <Link> wrapper per variant. The visuals
 * themselves come from @bota-apps/react-ui (sidebarNavLinkClass / ActionLink /
 * QuickLink) — this cva only adds the group hooks those visuals key their
 * hover styling to.
 */
export const routeLinkVariants = cva("", {
  variants: {
    variant: {
      "side-bar-nav-link": "",
      /** ActionLink colors on group-hover/tl — the wrapper provides the group. */
      text: "group/tl",
      /** QuickLink's TileEl carries its own `group` — no wrapper class needed. */
      "quick-link": "",
    },
  },
  defaultVariants: { variant: "text" },
});
