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
  e.g. `bg-primary-100`, `text-accent-700`) resolve through optional variables
  `--primary-50` … `--accent-900` with the stock palette as fallback. Define
  them only if you want to rebrand the full scale:

```css
:root {
  --primary: 262 83% 58%; /* semantic token */
  --primary-500: 262 83% 58%; /* optional: numeric ramp step */
}
```

## Brands (runtime theme switching)

A **brand** is a block of token values scoped under `:root[data-brand="<name>"]`,
so switching brands at runtime is one attribute flip on `<html>` — the same
mechanism dark mode uses with the `.dark` class (`@bota-apps/react-components`'
`AppearanceProvider` + `BrandSelect` do exactly that). Brands redefine only the
chromatic tokens (primary/accent ramps, ring, sidebar highlights, matching chart
slots); neutrals inherit from `theme.css`.

Import the shipped brands your app offers, after `theme.css`:

```css
@import "@bota-apps/tailwind-preset/theme.css";
@import "@bota-apps/tailwind-preset/brands/emerald.css";
@import "@bota-apps/tailwind-preset/brands/violet.css";
```

Or generate your own from one or two colors (authoring-time, check the output in):

```js
import { brandCss } from "@bota-apps/tailwind-preset/brand";
writeFileSync(
  "src/brands/acme.css",
  brandCss({ name: "acme", primary: "#0E7490", accent: "#F59E0B" }),
);
```

## Subpaths

| Import                                    | What                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `@bota-apps/tailwind-preset/preset`       | Tailwind preset (`darkMode: class`, color tokens, radii, typography + animate plugins) |
| `@bota-apps/tailwind-preset/theme.css`    | CSS variables for light + `.dark`, plus the `@tailwind` layers                         |
| `@bota-apps/tailwind-preset/brands/*.css` | Shipped brand token blocks (`emerald`, `violet`) scoped under `data-brand`             |
| `@bota-apps/tailwind-preset/brand`        | `brandCss` / `colorRamp` / `hexToHslChannels` brand generators                         |
| `@bota-apps/tailwind-preset/postcss`      | `{ tailwindcss, autoprefixer }` PostCSS config                                         |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
