# @bota-apps/tailwind-preset

## 0.13.0

### Minor Changes

- 12d6d67: Refresh the freight brand into a fuller logistics look. Headings pick up a DIN-flavored semi-condensed signage voice (`--font-display`: Barlow Semi Condensed) and technical text a documentary mono (`--font-mono`: IBM Plex Mono) — both degrade gracefully when the webfonts aren't loaded, which stays the app's job. The primary shifts to a livelier port-authority blue (#175490) and the accent deepens to a signal orange (#D0591C) that carries white text. Chrome gets a deeper navy rail with brighter active-nav highlights, elevation tokens turn navy-tinted in light mode (with explicit black-based dark counterparts), chart slots 2/4–8 become a cartographic palette (harbor teal, steel slate, crane red, sky, buoy amber, container green), surface neutrals cool toward steel with crisper borders, and the map tokens harmonize with the new primary hue.

## 0.12.0

### Minor Changes

- 08bcf92: Freight brand, product surfaces, and semantic status tokens:

  - **New brand `freight`** — a logistics-operations look: corridor-blue
    primary over cool-neutral surfaces, dark navy rail, signal-orange accent
    reserved for manual-intervention emphasis, Inter voice, crisp 0.25rem
    corners, and deep blue-black dark mode. The brand file also carries
    geo/map product tokens (`--map-panel-*`, `--map-marker-*`, `--map-route-*`,
    `--map-location-*`, `--map-cluster-*`, `--map-overlay-scrim`) for
    map-centric screens — planned vs observed routes, live/reported/estimated/
    stale positions — kept out of `theme.css` on purpose.
  - **`brandCss` learns `surfaces`** — per-product-surface override blocks
    scoped to `:root[data-brand][data-product-surface="<surface>"]` (+ `.dark`),
    so one brand can serve a dense operations console and a comfortable
    customer portal without forking. The shipped `freight` brand includes
    `operations` and `customer` surfaces.
  - **Semantic status token families** in `theme.css` + preset colors:
    `status-{info,success,warning,danger,neutral}` each with solid
    (`DEFAULT`/`foreground`) and subtle (`subtle`/`subtle-foreground`) pairs,
    re-tuned for dark mode. Status meaning now has canonical tokens instead of
    raw palette classes.
  - **Badge families resolve status colors through the new tokens** —
    `BadgeEl` success/warning/muted, `IconBadgeEl` info/success/warning, and
    `StepBubbleEl` info/success/warning now render from `status-*` tokens
    (dropping their hardcoded green/yellow/gray classes and `dark:` variants),
    so badge status colors follow the theme in both modes under every brand.

## 0.11.0

### Minor Changes

- 8eb9615: Paper-look brand family and a stronger brand voice end to end:

  - **New brands `kraft` and `blueprint`**, and a bolder `ledger`: ledger now
    pairs its manila page with a dark ink-navy rail; kraft is brown wrapping
    paper with stamp-green primary and slab display headings; blueprint is pale
    drafting paper with a deep blue rail, square corners, and a monospace
    display voice.
  - **Headings now render in the theme's display face** (`font-display`). The
    token defaults to `var(--font-sans)`, so nothing changes until a brand sets
    its own display stack — then every heading carries the brand (manuscript's
    serif headings finally show).
  - **Sidebar layout: the content well is anchored to the rail** instead of
    centered in the remaining space, which read as a giant left gutter on wide
    screens. The well keeps a `max-w-7xl` cap and its gutters; spare width now
    stays on the right.

## 0.10.0

### Minor Changes

- 0e2d5b4: New shipped brand: `ledger` — a paper-form look with manila surfaces, stamp
  ink-blue primary, stamp-red accent, ruled borders, square corners, and a
  typewriter display voice. Import
  `@bota-apps/tailwind-preset/brands/ledger.css` after `theme.css` and switch
  with `data-brand="ledger"`. The PresetSelect story now demos it alongside the
  other shipped looks.

## 0.9.0

### Minor Changes

- 888d537: New `drift` keyframes with `animate-drift` / `animate-drift-reverse` utilities — a slow ambient float for decorative background layers (used by the Hero aurora treatment). Transform-only so it stays on the compositor; pair with `motion-reduce:animate-none` at the call site like every decorative loop.

## 0.8.0

### Minor Changes

- 5ff7de0: Elevation, motion, dark-ramp, and typeface-pairing tokens.

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

## 0.7.0

### Minor Changes

- 3722dd4: Brands can now define complete looks, and the shipped brands do.

  `brandCss` accepts two new options, `tokens` and `darkTokens` — per-block
  overrides for any theme.css token (surfaces, borders, chrome, chart slots),
  keyed by camelCase token name (`sidebarBackground` → `--sidebar-background`).
  They emit last in their block, so they also win over the generated chromatic
  tokens (e.g. `darkTokens.primary` lifting the primary for dark surfaces). A
  brand can now range from a simple accent swap to a look that reads as a
  different product.

  The shipped example brands are replaced by four complete looks:

  - **Removed:** `brands/emerald.css`, `brands/violet.css`. If you imported one,
    either switch to a shipped look below or regenerate the old file yourself —
    they were plain accent swaps: `brandCss({ name: "emerald", primary:
"#059669", accent: "#F59E0B" })` and `brandCss({ name: "violet", primary:
"#7C3AED", accent: "#EC4899" })`.
  - **Added:** `brands/manuscript.css` (warm paper surfaces, serif voice,
    hairline borders, near-square corners), `brands/terminal.css` (monospace,
    square corners, console-dark chrome), `brands/sorbet.css` (soft 1.25rem
    corners, rounded type, berry brights), `brands/graphite.css` (charcoal
    chrome over a light page, crisp radius).

  No JS exports were removed; `brandCss` calls without the new options emit
  byte-identical CSS as before.

## 0.6.0

### Minor Changes

- 8c59a99: Add interaction-state design tokens and container-query support.

  - New `selected` / `selected-foreground` semantic colors (CSS variables `--selected`, `--selected-foreground` in `theme.css`, light + dark) — the soft emphasis surface for persistent on/active states (toggle groups, selected menu items, calendar ranges, active nav). They resolve through the primary ramp, so existing brand CSS picks them up with no regeneration.
  - The preset now ships `@tailwindcss/container-queries`, enabling `@container` and `@sm:`…`@7xl:` variants so components can respond to their own container width instead of the viewport.

## 0.5.1

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords and a structured author field. No runtime or API changes.

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
