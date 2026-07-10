---
"@bota-apps/react-components": patch
---

Horizontal nav entries that don't fit fold into a trailing "More" menu instead
of being clipped.

The topnav bar previously relied on horizontal scrolling with no affordance,
so on narrower containers most nav entries were simply invisible. The
horizontal `NavList` is now a priority+ nav: it measures its entries against
its own container (IntersectionObserver), turns the ones that no longer fit
fully invisible in place, and mirrors them into a trailing overflow menu —
groups keep their panel shape as submenus, and the overflow trigger carries
the active tone whenever the active route's entry is hidden. `NavList` gains
an optional `moreLabel` prop (default `"More"`) for the trigger's label, and
the topnav layout's nav region no longer scrolls horizontally.
