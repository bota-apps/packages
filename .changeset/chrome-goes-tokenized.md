---
"@bota-apps/react-components": minor
---

Appearance presets present as real looks, and the shell chrome is brand-themable.

- `AppearancePreset` gains optional `icon` (a lucide icon) and `description`;
  `PresetSelect` renders them as a glyph plus a one-line hint under each
  preset's label, so a preset menu reads like a set of distinct products.
- The shell chrome — the sidebar rail, the sidebar layout's top bar, and the
  topnav bar — now renders against the chrome-scoped `sidebar-*` tokens
  (`bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`) instead of
  the page's `card`/`border` tokens, and `navItemVariants` styles nav links
  with `sidebar-primary`/`sidebar-foreground`/`sidebar-accent` instead of
  `primary`/`muted`. Brands can now give the chrome its own character (e.g. a
  dark rail over a light page) without touching content surfaces. With the
  default theme tokens the rendered look is nearly unchanged (the chrome
  surface moves from pure white to the neutral `--sidebar-background`).
- `AppShell`'s "Signed in as" header text inherits the chrome foreground
  instead of forcing the page-scoped muted tone, which could be unreadable on
  dark-chrome brands.
