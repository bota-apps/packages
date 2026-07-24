---
"@bota-apps/react-ui": minor
---

`SidePanelDock`: stack open side panels in one shared docked column.

- New `SidePanelDockProvider` + `SidePanelDock` — SidePanels rendered anywhere under the provider portal into the dock and stack vertically when more than one is open, sharing the column height and one width preset. The dock hides while every panel is closed and keeps closed panels mounted, so their state survives exactly as it does standalone.
- `SidePanel` discovers the ambient dock automatically; behavior without a provider is unchanged. Its width chevrons resize the shared dock column when stacked.
