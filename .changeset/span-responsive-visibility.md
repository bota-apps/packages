---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": patch
---

`Span` gains two responsive `display` variants for header-chrome composition, so apps can collapse control labels on phones without raw class overrides:

- `display="srOnlyMobile"` — visible from the `sm` viewport up, screen-reader-only below (button labels that cost too much header width on phones).
- `display="hiddenMobile"` — hidden below the `sm` viewport, `inline-flex` from it (decorative chrome such as keyboard-shortcut hints).

`AppShell`'s sign-out label now uses `srOnlyMobile`.
