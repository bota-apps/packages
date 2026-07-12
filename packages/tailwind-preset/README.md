# @bota-apps/tailwind-preset

The `@bota-apps` Tailwind preset (design tokens), a ready-made PostCSS config, and
the theme CSS variables (light + dark) that the components render against. This is
the single source of truth for the tokens; [`@bota-apps/react-ui`](../react-ui)
re-exports these same subpaths for convenience.

## Install

```bash
pnpm add -D @bota-apps/tailwind-preset
# peer: tailwindcss
```

## Usage

`tailwind.config.js`:

```js
import preset from "@bota-apps/tailwind-preset/preset";

export default {
  presets: [preset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
};
```

Your global stylesheet (instead of the bare `@tailwind` directives):

```css
@import "@bota-apps/tailwind-preset/theme.css";
```

A ready-made PostCSS config is also exported:

```js
// postcss.config.js
export { default } from "@bota-apps/tailwind-preset/postcss";
```

## Theming

Everything renders through CSS variables, so a consuming app rebrands without
forking the preset:

- **Semantic tokens** (`--primary`, `--secondary`, `--background`, `--muted`, …
  plus `-foreground` pairs, `--sidebar-*`, `--chart-1..8`, `--radius`) are
  defined in `theme.css` for light and `.dark`. Override any of them after the
  `@import` — values are space-separated HSL triples (`221.2 83.2% 53.3%`).
- **Numeric ramps** (`primary-50…900`, `secondary-50…900`, `accent-50…900`,
  `destructive-50…900`, e.g. `bg-primary-100`, `text-accent-700`) resolve
  through variables `--primary-50` … `--destructive-900` whose defaults live in
  `theme.css`. Redefine them only to rebrand the full scale:

```css
:root {
  --primary: 262 83% 58%; /* semantic token */
  --primary-500: 262 83% 58%; /* optional: numeric ramp step */
}
```

In `.dark` the ramps are **reversed**: the shade number means "contrast steps
from the (dark) background", so `bg-primary-100` is a soft tint and
`text-primary-800` readable text in both modes with no `dark:` variants. If
you hand-write dark ramp overrides, derive them with `darkColorRamp` from the
`brand` subpath so your pairings keep those semantics.

- **Elevation** (`shadow-raised`, `shadow-overlay`, `shadow-floating`) and
  **motion** (`duration-fast/base/slow`, `ease-standard/emphasized`,
  `animate-shimmer`) utilities resolve through `--shadow-*`, `--duration-*`,
  and `--ease-*` tokens. Dark mode carries depth mainly through surface
  lightness (`--background` < `--card` < `--popover`); a
  `prefers-reduced-motion` block collapses the duration tokens to 1ms.

- **Typeface pairings** — optional files that only point `--font-sans` /
  `--font-display` at a curated stack (font files stay the app's job; each
  pairing file's header documents the matching `@fontsource` install):

```css
@import "@fontsource-variable/inter";
@import "@bota-apps/tailwind-preset/theme.css";
@import "@bota-apps/tailwind-preset/fonts/inter.css";
```

## Brands (runtime theme switching)

A **brand** is a block of token values scoped under `:root[data-brand="<name>"]`,
so switching brands at runtime is one attribute flip on `<html>` — the same
mechanism dark mode uses with the `.dark` class (`@bota-apps/react-components`'
`AppearanceProvider` + `PresetSelect` do exactly that). Every brand redefines
the chromatic tokens (primary/accent ramps, ring, sidebar highlights, matching
chart slots); beyond that it may override any other theme token — surfaces,
borders, chrome, typefaces, corner radius — so a brand can range from a simple
accent swap to a complete look that reads as a different product.

The shipped brands are complete looks. Import the ones your app offers, after
`theme.css`:

```css
@import "@bota-apps/tailwind-preset/theme.css";
@import "@bota-apps/tailwind-preset/brands/manuscript.css"; /* warm paper, serif voice, hairline borders */
@import "@bota-apps/tailwind-preset/brands/terminal.css"; /* monospace, square corners, console chrome */
@import "@bota-apps/tailwind-preset/brands/sorbet.css"; /* soft rounded corners, berry brights */
@import "@bota-apps/tailwind-preset/brands/graphite.css"; /* charcoal chrome over a light page */
```

Or generate your own (authoring-time, check the output in). One or two colors
make an accent-swap brand; add shape, typeface, and token overrides to build a
full look (`tokens`/`darkTokens` keys are camelCase token names, values verbatim
CSS values):

```js
import { brandCss } from "@bota-apps/tailwind-preset/brand";
writeFileSync(
  "src/brands/acme.css",
  brandCss({
    name: "acme",
    primary: "#0E7490",
    accent: "#F59E0B",
    radius: "0.25rem",
    fontDisplay: '"Iowan Old Style", Palatino, Georgia, serif',
    tokens: { background: "42 44% 96%", sidebarBackground: "43 40% 93%" },
    darkTokens: { background: "24 22% 8%" },
  }),
);
```

## Subpaths

| Import                                    | What                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `@bota-apps/tailwind-preset/preset`       | Tailwind preset (`darkMode: class`, color tokens, radii, typography + animate plugins) |
| `@bota-apps/tailwind-preset/theme.css`    | CSS variables for light + `.dark`, plus the `@tailwind` layers                         |
| `@bota-apps/tailwind-preset/brands/*.css` | Shipped complete-look brands (`manuscript`, `terminal`, `sorbet`, `graphite`)          |
| `@bota-apps/tailwind-preset/brand`        | `brandCss` / `colorRamp` / `darkColorRamp` / `hexToHslChannels` brand generators       |
| `@bota-apps/tailwind-preset/fonts/*.css`  | Typeface pairings (`inter`) — token-only, fonts load via `@fontsource`                 |
| `@bota-apps/tailwind-preset/postcss`      | `{ tailwindcss, autoprefixer }` PostCSS config                                         |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
