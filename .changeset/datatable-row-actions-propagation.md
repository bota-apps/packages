---
"@bota-apps/react-ui": patch
---

DataTableRowActions: stop click propagation from the menu trigger, content, and items. On a table wired with both `onRowClick` and `rowActions`, React synthetic events bubbled out of the (portalled) menu up the React tree, so opening a row's menu — or clicking any menu item — also fired the row's `onRowClick` (e.g. navigating away before a confirm dialog could open). The selection checkbox cell already guarded this; the actions cell now does too.
