/**
 * Derived token overrides for the appearance provider's custom color: one
 * picked hex drives the primary ramp and the shell chrome in both modes,
 * layered over whichever brand is active (inline styles on <html>
 * out-specify any stylesheet). The ladders and contrast threshold mirror
 * @bota-apps/tailwind-preset's brand builder, so a picked color reads like a
 * first-class brand rather than a raw accent swap.
 */

export type AppearanceColorMode = "light" | "dark";

/** Lightness ladder for the 50–900 ramp (hue/saturation come from the picked color). */
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
} as const;

/** Dark-mode ladder — reversed semantics: shade = contrast steps from the dark background. */
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
} as const;

type Hsl = { h: number; s: number; l: number };

/** Six-digit hex color guard — the only custom-color form the provider accepts. */
export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function hexToHsl(hex: string): Hsl {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = ((value >> 16) & 0xff) / 255;
  const g = ((value >> 8) & 0xff) / 255;
  const b = (value & 0xff) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }
  return { h: h * 60, s: s * 100, l: l * 100 };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Space-separated channel triple ("217.2 91.2% 53.3%") — the form the theme tokens use. */
function channels({ h, s, l }: Hsl): string {
  return `${round(h)} ${round(s)}% ${round(l)}%`;
}

/** Readable text-on-color default: white on deep colors, near-black on light ones. */
function contrastForeground({ l }: Hsl): string {
  return l >= 62 ? "0 0% 10%" : "0 0% 100%";
}

/** Every property customColorTokens may set — what a reset must clear. */
export const customColorTokenNames: readonly string[] = [
  "--primary",
  "--primary-foreground",
  "--ring",
  ...Object.keys(rampLightness).map((shade) => `--primary-${shade}`),
  "--chart-1",
  "--sidebar-background",
  "--sidebar-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-primary",
  "--sidebar-ring",
];

/**
 * The CSS custom-property overrides for a picked color in the given mode.
 * Dark mode lifts the primary for contrast against near-black canvases and
 * dims the chrome to a deep tint of the same hue; light mode paints the
 * chrome with the color itself (lightness-clamped so white text stays
 * readable on pale picks).
 */
export function customColorTokens(hex: string, mode: AppearanceColorMode): Record<string, string> {
  const base = hexToHsl(hex);
  const primary = mode === "light" ? base : { ...base, l: Math.max(base.l, 60) };
  const ladder = mode === "light" ? rampLightness : darkRampLightness;

  const tokens: Record<string, string> = {
    "--primary": channels(primary),
    "--primary-foreground": contrastForeground(primary),
    "--ring": channels(primary),
  };
  for (const [shade, l] of Object.entries(ladder)) {
    tokens[`--primary-${shade}`] = channels({ h: base.h, s: base.s, l });
  }
  tokens["--chart-1"] = channels(
    mode === "light" ? primary : { ...primary, l: Math.min(primary.l + 7, 95) },
  );

  if (mode === "light") {
    const rail = { ...base, l: Math.min(base.l, 58) };
    tokens["--sidebar-background"] = channels(rail);
    tokens["--sidebar-foreground"] = "0 0% 100%";
    // Selection sits deeper than the rail so white selected text holds up.
    tokens["--sidebar-accent"] = channels({ ...rail, l: Math.max(rail.l - 11, 10) });
    tokens["--sidebar-accent-foreground"] = "0 0% 100%";
    tokens["--sidebar-border"] = channels({ ...rail, l: Math.max(rail.l - 6, 8) });
    tokens["--sidebar-primary"] = "0 0% 100%";
    tokens["--sidebar-ring"] = "0 0% 100%";
  } else {
    const lifted = { ...primary, l: Math.min(primary.l + 5, 90) };
    tokens["--sidebar-background"] = channels({ h: base.h, s: Math.min(base.s, 45), l: 12 });
    tokens["--sidebar-foreground"] = channels({ h: base.h, s: Math.min(base.s, 30), l: 88 });
    tokens["--sidebar-accent"] = channels({ h: base.h, s: Math.min(base.s, 40), l: 18 });
    tokens["--sidebar-accent-foreground"] = "0 0% 100%";
    tokens["--sidebar-border"] = channels({ h: base.h, s: Math.min(base.s, 38), l: 17 });
    tokens["--sidebar-primary"] = channels(lifted);
    tokens["--sidebar-ring"] = channels(lifted);
  }
  return tokens;
}
