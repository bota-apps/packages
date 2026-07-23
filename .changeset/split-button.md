---
"@bota-apps/react-ui": minor
---

New `SplitButton` component — a primary action with an attached chevron menu of secondary choices. Declarative `SplitButtonItem[]` model (label, optional description second line, lucide icon, `disabled`/`hidden`, `separatorBefore`), required `menuLabel` for an accessible trigger name, `variant`/`size`/`fullWidth`/`align` options. When every item is hidden it renders a plain button. Composes the existing Button and DropdownMenu primitives; exposes `splitButtonVariants` and segment/item variant cvas.
