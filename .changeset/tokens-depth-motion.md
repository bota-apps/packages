---
"@bota-apps/tailwind-preset": minor
---

Elevation, motion, dark-ramp, and typeface-pairing tokens.

New tokens (all overridable per brand):

- **Elevation** — `--shadow-raised`, `--shadow-overlay`, `--shadow-floating` behind the `shadow-raised/overlay/floating` utilities. Dark mode carries depth primarily through surface lightness: `.dark` now lifts `--card` (8%) and `--popover` (10%) above `--background` (4.9%).
- **Motion** — `--duration-fast/base/slow` (120/200/320ms) and `--ease-standard/emphasized` behind `duration-*`/`ease-*` utilities, plus an `animate-shimmer` keyframe. A `prefers-reduced-motion` block collapses the duration tokens to 1ms.
- **Typography** — `--font-mono` is now a token (previously hardcoded in the preset), and a new `fonts/*.css` subpath ships token-only typeface pairings (`fonts/inter.css`); font files load via `@fontsource` in the app.

Dark-mode numeric ramps (migration note):

- The `.dark` block now redefines every numeric ramp (`--primary-50…900`, `--accent-…`, `--secondary-…`, `--destructive-…`) with **reversed semantics**: in dark, the shade number means "contrast steps from the background", so `bg-primary-100` reads as a soft tint and `text-primary-800` as readable text in both modes without `dark:` variants. `brandCss` emits matching dark ramps for every brand via the new `darkColorRamp` export.
- **Apps that hand-write dark ramp overrides** (`:root … .dark { --primary-100: … }`) must regenerate them with `darkColorRamp` from `@bota-apps/tailwind-preset/brand` — keeping absolute-lightness dark ramps will invert `--selected`/`--selected-foreground` pairings.
- theme.css no longer overrides `--selected`/`--selected-foreground` inside `.dark` (the `:root` aliases now resolve correctly there); apps overriding those two tokens in a `.dark` block should drop the override.
- The `destructive` 50–900 ramp moved from hardcoded hex to `--destructive-50…900` variables (same resolved colors in light mode; now brandable).
- `bg-primary-dark` (the `primary.dark` alias → `--primary-400`) now resolves to the dark-ladder 400 step when `.dark` is active.
