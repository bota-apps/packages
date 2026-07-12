/**
 * html/interaction — the shared interaction-state recipe for every control.
 *
 * One focus/hover treatment across the system instead of per-component
 * hand-rolled rings:
 *   - focus:   soft 2px ring in the ring color at reduced opacity, plus a
 *              ring-colored border on field controls
 *   - hover:   border tint on field controls, `muted` surface on flat controls
 *
 * Semantic surface rules (enforced across the package):
 *   - transient hover/press surfaces  → `muted`
 *   - persistent on/active states     → `selected` / `selected-foreground`
 *   - `accent` is a deliberate brand-emphasis color, never an interaction state
 */

/** Keyboard-focus ring for non-field controls (buttons, toggles, links, tiles). */
export const focusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";

/**
 * Field-style controls (inputs, textareas, select/combobox triggers): border
 * tint on hover, ring-colored border + soft ring on keyboard focus.
 */
export const formControlInteractionClasses =
  "transition-colors hover:border-ring/40 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Press feedback for pointer-activated controls (buttons, toggles, tiles):
 * subtle scale-down on :active, on the token duration/easing. Owns the full
 * transition property list (colors + shadow + transform) because
 * tailwind-merge collapses `transition-colors` and `transition-transform`
 * into one group — composing both would silently drop one.
 */
export const pressableClasses =
  "transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-fast ease-standard active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";
