---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": minor
---

Shell chrome controls and new app-shell slots.

- `Button` gains a `chrome` variant styled from the `sidebar-*` token set, for
  controls mounted on the shell chrome (header bar / sidebar rail) where the
  page-surface variants can go illegible on brands with saturated chrome.
- `PresetSelect`, `ThemeToggle`, and `LanguageToggle` accept a `variant` prop
  (default `outline`); `AppShell` now mounts its built-in controls with
  `variant="chrome"`.
- `AppShellLayout` slots grow `sidebarFooter` (bottom-anchored rail content,
  also rendered in the mobile nav sheet) and `footer` (app-wide footer below
  the content row).
- `AppShell` renders a signed-in identity card (avatar initials, name, and a
  new `userDescription` line) at the rail foot; on the sidebar layout the
  sign-out action moves into the card's menu, while the topnav layout keeps
  the header sign-out button. New `footer` prop passes through to the layout.
- New `NotificationsMenu`: a presentational header bell with unread-count
  badge, item list, empty state, and optional mark-all-read action.
- New `AppFooter`: a quiet app-wide footer strip (ownership line + legal
  links, with a `renderLink` hook for router integration).
