---
"@bota-apps/react-ui": patch
"@bota-apps/react-components": patch
---

Restore rail-anchored content in the sidebar layout. The centered well
introduced in the previous release read as a floating left gutter next to the
fixed rail — the content well and capped `PageContent` widths are anchored to
the start edge again, with spare width staying on the right. The `wide` width
variant and the well's generous cap are unchanged; only `narrow` content
centers itself.
