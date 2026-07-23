---
"@bota-apps/react-ui": minor
"@bota-apps/react-components": patch
---

Panel and form-control polish.

- `SidePanel`: renders on the card surface with a soft overlay shadow so it
  reads as its own raised layer beside the content, and gains a `footer` slot
  — a pinned action row below the scrollable body.
- `ScrollArea`: the viewport now inherits a `max-h-*` set on the root.
  Previously a max-height-constrained ScrollArea (e.g. the Combobox option
  list) clipped its content without ever scrolling, because a percentage
  height cannot resolve against a parent sized by max-height alone.
- Form controls (`Input`, `Textarea`, select/combobox triggers): filled with
  `bg-background` instead of transparent — on elevated surfaces they read as
  gently recessed wells rather than bare outlines; on background-colored
  pages the change is invisible.
- `IssueReporter` (panel variant): Cancel/Submit move into the SidePanel's
  pinned footer, form-associated via the form id, so they stay visible while
  the form scrolls.
