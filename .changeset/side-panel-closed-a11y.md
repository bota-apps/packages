---
"@bota-apps/react-ui": patch
---

SidePanel: a closed panel now carries the HTML `hidden` attribute plus
`aria-hidden` and `inert`. Children stay mounted (drafts still survive
close/reopen), but the region fully leaves the accessibility tree and tab
order — previously only a CSS class hid it, so its controls could still be
reached by assistive tech and shadow the page's own controls in
accessibility-based queries.
