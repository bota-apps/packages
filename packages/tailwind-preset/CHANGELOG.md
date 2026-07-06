# @bota-apps/tailwind-preset

## 0.5.0

### Minor Changes

- 0f2e0a9: Brands go beyond color (shape + typography tokens), and a new UI density axis.

  **tailwind-preset**

  - New typeface tokens: the preset's `font-sans`/`font-display` utilities (and the preflight body font) now resolve through `--font-sans`/`--font-display`, with system-stack defaults in `theme.css`. A brand block can change the app's typeface, not just its palette — the token names the family; loading webfont files stays the app's job.
  - `brandCss()` accepts optional `radius`, `fontSans`, and `fontDisplay`: a brand can now set its corner radius (`--radius`, e.g. `"1rem"` soft / `"0"` sharp) and typefaces in one recipe. Emitted only when provided — existing brand files regenerate byte-identically.
  - New density rule: `:root[data-density="compact"]` scales the root font-size (87.5%), compacting every rem-based utility uniformly with no per-component styles.

  **react-components**

  - `AppearanceProvider` gains a fourth axis, `density` (`"comfortable" | "compact"`, default comfortable), applied as `data-density` on `<html>` and persisted with the rest of the preference. New: `defaultDensity` config, `setDensity`/`toggleDensity` in `useAppearance()`, `appearanceDensities`/`AppearanceDensity` exports. Stored preferences from earlier versions lack the field and fall back to the default — no migration needed.
  - New `DensityToggle` (one-click comfortable ⇄ compact flip) for apps composing granular axis controls; density is also part of appearance presets (see the appearance-presets change in this release).

## 0.4.0

### Minor Changes

- 53f7f72: Multi-brand theming and switchable shell layouts.

  **tailwind-preset**

  - New `brands/*.css` token blocks: a brand is a complete chromatic token set (primary/accent ramps, ring, sidebar highlights, matching chart slots) scoped under `:root[data-brand="<name>"]` + `:root[data-brand="<name>"].dark`, so switching brands at runtime is one attribute flip on `<html>` — the same mechanism dark mode uses. Neutrals inherit from `theme.css`. Ships `brands/emerald.css` and `brands/violet.css`; import the ones your app offers after `theme.css`.
  - New `@bota-apps/tailwind-preset/brand` subpath: `brandCss({ name, primary, accent })` generates a full brand stylesheet from one or two hex colors (plus `colorRamp` and `hexToHslChannels`). The shipped brand files are this function's own output, verified by test.

  **react-components (breaking)**

  - `AppearanceProvider`/`useAppearance` replace `ThemeProvider`/`useTheme`. One provider now owns all three appearance axes as a single persisted preference (default localStorage key `"appearance"`): `mode` (light/dark, still the `.dark` class), `brand` (sets `data-brand` on `<html>`), and `layout` (which `AppShellLayout` arrangement renders). Config: `defaultMode`, `brands` (the `BrandOption[]` the app ships CSS for), `defaultBrand`, `defaultLayout`, `storageKey`.

    Migration — every removed export and its replacement:
    - `ThemeProvider` → `AppearanceProvider` (prop renames: `defaultTheme` → `defaultMode`; `storageKey` now stores a JSON object, so stored plain `"dark"`/`"light"` strings from the old provider are ignored once and users re-pick).
    - `useTheme()` → `useAppearance()` (`theme` → `mode`, `toggle` → `toggleMode`).

  - `AppShellLayout` gains `layout?: "sidebar" | "topnav"` (default `"sidebar"`, the previous arrangement): `topnav` renders the same slots as a single top bar (brand + horizontal nav + header slots) over a full-width content well. `appShellLayoutKinds`/`AppShellLayoutKind` are exported; `appShellLayoutVariants` now takes `{ layout }` (calling it with no arguments still returns the sidebar base).
  - New `BrandSelect` (brand picker fed by the ambient provider; renders nothing for single-brand apps) and `LayoutToggle` (one-click sidebar ⇄ topnav flip). `AppShell` mounts `BrandSelect`, `LayoutToggle`, and `ThemeToggle` in the header and follows the ambient `layout`.
  - `createAppRoot` accepts `appearance?: AppearanceConfig` and mounts `AppearanceProvider` in place of `ThemeProvider`.

## 0.3.0

### Minor Changes

- 1d4c8c0: Fix the `secondary` numeric color scale and make all numeric ramps themeable.

  - **Fix:** `secondary-50…900` was a copy-paste of primary's blue ramp, so `bg-secondary-500` rendered primary blue while `bg-secondary` rendered the grey `--secondary` token. It is now a real neutral (slate) ramp aligned with the token. If a design intentionally relied on the blue `secondary-*` utilities, switch those to `primary-*`.
  - **Theming:** the `primary`/`secondary`/`accent` numeric ramps now resolve through optional CSS variables (`--primary-50` … `--accent-900`) with the stock palette as fallback — apps can rebrand the full scale by defining variables instead of forking the preset. Semantic tokens are unchanged. See the package README for the theming contract.

### Patch Changes

- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.

- 2d71b67: Fix publish-surface issues surfaced by `arethetypeswrong` (now enforced in CI alongside `publint`).

  - **auth-client**: the emitted `d.ts` for `useAuth` contained a synthesized `import("..")` directory specifier that Node16 ESM consumers cannot resolve; `useAuth` now has an explicit `UseAuthResult` return type (also a nicer public type to reference).
  - **tailwind-preset / react-ui**: the `./preset` and `./postcss` subpath exports now ship type declarations — TypeScript `tailwind.config.ts` files get typed imports instead of `any`.

- 1bf0fca: Review fixes across the packages.

  **tailwind-preset**

  - Opacity modifiers work on numeric ramp shades again: `bg-primary-500/20` and friends compiled to nothing because Tailwind v3 cannot parse `var()` colors with space-separated fallbacks. The ramp defaults now live as `--primary-50..900` / `--secondary-50..900` / `--accent-50..900` variables in `theme.css` (rebrand by redefining them) and the preset references them without inline fallbacks.

  **schema-utils** (breaking on 0.x — released as minor per repo policy)

  - `createCurrencyFormatter` fails fast instead of limping on fake values: a custom code set now requires its own `currencies` registry (enforced by overloads), and formatting or labelling a code missing from the registry throws instead of rendering placeholder metadata.
  - Non-ISO custom codes (`USDT`, anything not three letters) no longer crash `Intl.NumberFormat` — they render symbol-prefixed.
  - `Intl.NumberFormat` instances are cached per locale/options, so per-cell `CurrencyText` rendering stops re-resolving locale data on every call.
  - `CurrencyDefinition` is now derived from `CurrencyInfo` (same shape, open `code`).

  **auth-client**

  - Fixed three auth-state races: a superseded in-flight session resolution can no longer overwrite the state written by a newer `refresh()`, a slow `getUser()` response can no longer re-authenticate the store after `logout()`, and a stale failure no longer clears a newer refresh's cached resolution.
  - `UseAuthResult` (the return type of `useAuth`) is exported from the package barrel.

  **react-ui**

  - The chart cva variants (`barChartVariants`, `lineChartVariants`, `areaChartVariants`, `pieChartVariants`) are now actually reachable from `@bota-apps/react-ui/charts` and the root barrel.
  - `DynamicForm` no longer crashes when a validation message key is passed explicitly `undefined` (e.g. from an optional translator) — it falls back to the English default per key.
  - `formatRelativeTime` caches its `Intl.RelativeTimeFormat` instances.

  **react-components**

  - `ThemeProvider` memoizes its context value, so `useTheme` consumers stop re-rendering on unrelated parent re-renders.
