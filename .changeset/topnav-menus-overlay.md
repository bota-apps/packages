---
"@bota-apps/react-components": patch
---

Topnav nav groups open as overlay menus instead of stretching the bar.

`NavList` gains an `orientation` prop (`"vertical"` default — unchanged rail
behavior; `"horizontal"` renders entries with children as portaled dropdown
menus, with deeper levels as submenus and the group's own route as the panel's
first row). `AppShell` passes the orientation matching the active shell
layout, so expanding a nav group in the topnav arrangement no longer grows the
bar and pushes the page content down. Also adds `navMenuItemVariants`, the
page-scoped active tint for rows inside those panels.
