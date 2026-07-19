/**
 * Brand token builders for @bota-apps/tailwind-preset.
 *
 * A "brand" is nothing more than a block of CSS variable values scoped under
 * `:root[data-brand="<name>"]` — the Tailwind preset itself never changes, so
 * switching brands at runtime is a single attribute flip on <html> (the same
 * mechanism dark mode uses with the `.dark` class). Apps either import a
 * shipped file from ./brands/ or generate their own once at authoring time:
 *
 *   import { brandCss } from "@bota-apps/tailwind-preset/brand";
 *   writeFileSync("src/brands/acme.css", brandCss({ name: "acme", primary: "#0E7490", accent: "#F59E0B" }));
 *
 * `:root[data-brand]` out-specifies theme.css's `:root` and `.dark` blocks, so
 * import order never matters. Every brand redefines the chromatic tokens
 * (primary/accent ramps, ring, sidebar highlights, the matching chart slots);
 * beyond that a brand may override ANY theme.css token via `tokens`/`darkTokens`
 * (surfaces, borders, chrome, typography, shape), so a brand can range from a
 * simple accent swap to a complete look that reads as a different product.
 */

/** Lightness ladder for the 50–900 ramps (hue/saturation come from the base color). */
const rampLightness = {
  50: 97,
  100: 93,
  200: 86,
  300: 77,
  400: 66,
  500: 53,
  600: 45,
  700: 38,
  800: 31,
  900: 24,
};

/**
 * Dark-mode lightness ladder — REVERSED semantics: in dark, the shade number
 * means "contrast steps from the (dark) background", not absolute lightness.
 * 50 is a whisper above the page, 900 is near-white text. Not a pure mirror of
 * the light ladder: 500 lifts to 57 so bg-*-500 stays legible on near-black.
 * This is what lets bg-*-100 / text-*-800 pairings (and the --selected alias)
 * hold in both modes with zero dark: variants.
 */
const darkRampLightness = {
  50: 14,
  100: 18,
  200: 24,
  300: 33,
  400: 44,
  500: 57,
  600: 66,
  700: 75,
  800: 84,
  900: 92,
};

function parseHex(hex) {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) {
    throw new Error(`Expected a 6-digit hex color like "#2563EB", got "${hex}"`);
  }
  const value = Number.parseInt(match[1], 16);
  return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff };
}

function toHsl(hex) {
  const { r, g, b } = parseHex(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) {
    h = (gn - bn) / d + (gn < bn ? 6 : 0);
  } else if (max === gn) {
    h = (bn - rn) / d + 2;
  } else {
    h = (rn - gn) / d + 4;
  }
  return { h: h * 60, s: s * 100, l: l * 100 };
}

function round(value) {
  return Math.round(value * 10) / 10;
}

/** Space-separated channel triple ("217.2 91.2% 53.3%") — the form theme.css tokens use. */
function channels({ h, s, l }) {
  return `${round(h)} ${round(s)}% ${round(l)}%`;
}

/** Readable text-on-color default: white on deep colors, near-black on light ones. */
function contrastForeground({ l }) {
  return l >= 62 ? "0 0% 10%" : "0 0% 100%";
}

function lightened(hsl, amount) {
  return { ...hsl, l: Math.min(hsl.l + amount, 95) };
}

/** HSL channel triple for a hex color, e.g. hexToHslChannels("#2563EB") → "217.2 91.2% 53.3%". */
export function hexToHslChannels(hex) {
  return channels(toHsl(hex));
}

/**
 * 50–900 ramp derived from a base color: hue and saturation are preserved,
 * lightness follows the shared ladder so every brand's ramp feels consistent.
 */
export function colorRamp(hex) {
  const { h, s } = toHsl(hex);
  const ramp = {};
  for (const [shade, l] of Object.entries(rampLightness)) {
    ramp[shade] = channels({ h, s, l });
  }
  return ramp;
}

/**
 * Dark-mode 50–900 ramp for a base color: same hue/saturation, but lightness
 * follows the reversed dark ladder (shade = contrast steps from the dark
 * background). Apps that hand-write their own dark ramp overrides should
 * derive them with this so tint/text pairings match the theme's semantics.
 */
export function darkColorRamp(hex) {
  const { h, s } = toHsl(hex);
  const ramp = {};
  for (const [shade, l] of Object.entries(darkRampLightness)) {
    ramp[shade] = channels({ h, s, l });
  }
  return ramp;
}

function rampLines(token, ramp) {
  return Object.entries(ramp)
    .map(([shade, value]) => `  --${token}-${shade}: ${value};`)
    .join("\n");
}

/** camelCase token key → CSS custom-property name: sidebarAccentForeground → --sidebar-accent-foreground, chart1 → --chart-1. */
function tokenName(key) {
  return `--${key
    .replace(/([A-Z])/g, "-$1")
    .replace(/(\d+)/g, "-$1")
    .toLowerCase()}`;
}

function tokenLines(tokens) {
  return Object.entries(tokens).map(([key, value]) => `  ${tokenName(key)}: ${value};`);
}

/**
 * Complete brand stylesheet (light + dark blocks) from one or two colors.
 * `name` becomes the `data-brand` attribute value apps switch to at runtime.
 * Beyond color, a brand can also set its shape and voice: `radius` feeds the
 * corner-radius token and `fontSans`/`fontDisplay` the typeface tokens (values
 * are complete font-family lists; loading webfont files stays the app's job).
 * These emit only in the light block — nothing redefines them in dark, so they
 * hold across both modes.
 *
 * `tokens` / `darkTokens` override any remaining theme.css token per block —
 * keys are camelCase token names (`sidebarBackground` → `--sidebar-background`),
 * values verbatim CSS values (HSL channel triples for colors). They emit last
 * in their block, so they also win over the generated chromatic tokens (e.g. a
 * dark-chrome brand brightening `--sidebar-primary`, or `darkTokens.primary`
 * lifting the primary for dark surfaces).
 *
 * `surfaces` lets one brand serve several product surfaces (an operations
 * console and a customer portal, say) without forking into two brands: each
 * entry emits `tokens`/`darkTokens` override blocks scoped to
 * `:root[data-brand="<name>"][data-product-surface="<surface>"]`. Apps declare
 * their surface once, statically, on <html> (it is an app identity, not a user
 * preference, so it does not belong to the appearance provider's axes). A
 * surface overrides only what meaningfully differs — the shared brand blocks
 * stay the identity.
 */
export function brandCss({
  name,
  primary,
  accent,
  primaryForeground,
  accentForeground,
  radius,
  fontSans,
  fontDisplay,
  tokens,
  darkTokens,
  surfaces,
}) {
  if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error(`Brand name must be a camelCase identifier, got "${name}"`);
  }
  for (const surface of Object.keys(surfaces ?? {})) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(surface)) {
      throw new Error(`Surface name must be a camelCase identifier, got "${surface}"`);
    }
  }
  const primaryHsl = toHsl(primary);
  const accentHsl = toHsl(accent);
  const primaryFg = primaryForeground ?? contrastForeground(primaryHsl);
  const accentFg = accentForeground ?? contrastForeground(accentHsl);

  // Reproduce the exact call in the header so a brand file names its own recipe.
  const recipe = [
    `name: ${JSON.stringify(name)}`,
    `primary: ${JSON.stringify(primary)}`,
    `accent: ${JSON.stringify(accent)}`,
    ...(primaryForeground ? [`primaryForeground: ${JSON.stringify(primaryForeground)}`] : []),
    ...(accentForeground ? [`accentForeground: ${JSON.stringify(accentForeground)}`] : []),
    ...(radius ? [`radius: ${JSON.stringify(radius)}`] : []),
    ...(fontSans ? [`fontSans: ${JSON.stringify(fontSans)}`] : []),
    ...(fontDisplay ? [`fontDisplay: ${JSON.stringify(fontDisplay)}`] : []),
    ...(tokens ? [`tokens: ${JSON.stringify(tokens)}`] : []),
    ...(darkTokens ? [`darkTokens: ${JSON.stringify(darkTokens)}`] : []),
    ...(surfaces ? [`surfaces: ${JSON.stringify(surfaces)}`] : []),
  ].join(", ");
  const shapeTokens = [
    ...(radius ? [`  --radius: ${radius};`] : []),
    ...(fontSans ? [`  --font-sans: ${fontSans};`] : []),
    ...(fontDisplay ? [`  --font-display: ${fontDisplay};`] : []),
  ];
  const shapeBlock = shapeTokens.length ? `\n\n${shapeTokens.join("\n")}` : "";
  const lightOverrides = tokens ? `\n\n${tokenLines(tokens).join("\n")}` : "";
  const darkOverrides = darkTokens ? `\n\n${tokenLines(darkTokens).join("\n")}` : "";

  // Ordering is load-bearing: a surface's light block and the brand's dark
  // block tie on specificity (0,3,0), so surface-light blocks must emit BEFORE
  // the dark block (dark wins in dark mode by source order) and surface-dark
  // blocks (0,4,0) emit last. A surface-light token the dark block never
  // redefines (e.g. --radius) still holds across both modes.
  const surfaceBlock = (surface, overrides, dark) => {
    const lines = tokenLines(overrides ?? {});
    if (!lines.length) {
      return "";
    }
    const selector = `:root[data-brand="${name}"][data-product-surface="${surface}"]${dark ? ".dark" : ""}`;
    return `\n\n${selector} {\n${lines.join("\n")}\n}`;
  };
  const surfaceLightBlocks = Object.entries(surfaces ?? {})
    .map(([surface, overrides]) => surfaceBlock(surface, overrides.tokens, false))
    .join("");
  const surfaceDarkBlocks = Object.entries(surfaces ?? {})
    .map(([surface, overrides]) => surfaceBlock(surface, overrides.darkTokens, true))
    .join("");

  return `/* Generated by @bota-apps/tailwind-preset/brand — brandCss({ ${recipe} }) */
:root[data-brand="${name}"] {
  --primary: ${channels(primaryHsl)};
  --primary-foreground: ${primaryFg};
${rampLines("primary", colorRamp(primary))}

  --accent: ${channels(accentHsl)};
  --accent-foreground: ${accentFg};
${rampLines("accent", colorRamp(accent))}

  --ring: ${channels(primaryHsl)};
  --sidebar-primary: ${channels(primaryHsl)};
  --sidebar-ring: ${channels(primaryHsl)};
  --chart-1: ${channels(primaryHsl)};
  --chart-3: ${channels(accentHsl)};${shapeBlock}${lightOverrides}
}${surfaceLightBlocks}

:root[data-brand="${name}"].dark {
  --primary: ${channels(primaryHsl)};
  --primary-foreground: ${primaryFg};
${rampLines("primary", darkColorRamp(primary))}

  --accent: ${channels(accentHsl)};
  --accent-foreground: ${accentFg};
${rampLines("accent", darkColorRamp(accent))}

  --ring: ${channels(primaryHsl)};
  --sidebar-primary: ${channels(primaryHsl)};
  --sidebar-ring: ${channels(primaryHsl)};
  --chart-1: ${channels(lightened(primaryHsl, 7))};
  --chart-3: ${channels(lightened(accentHsl, 7))};${darkOverrides}
}${surfaceDarkBlocks}
`;
}
