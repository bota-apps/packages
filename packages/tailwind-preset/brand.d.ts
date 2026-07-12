export type RampShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type BrandCssOptions = {
  /** The `data-brand` attribute value apps switch to at runtime (camelCase). */
  name: string;
  /** Brand primary as a 6-digit hex color, e.g. "#2563EB". */
  primary: string;
  /** Brand accent as a 6-digit hex color. */
  accent: string;
  /** Override for --primary-foreground as an HSL channel triple ("210 40% 98%"). */
  primaryForeground?: string;
  /** Override for --accent-foreground as an HSL channel triple. */
  accentForeground?: string;
  /** Corner-radius token (--radius), e.g. "1rem" for soft or "0" for sharp. */
  radius?: string;
  /** --font-sans as a complete font-family list; font files stay the app's job. */
  fontSans?: string;
  /** --font-display as a complete font-family list. */
  fontDisplay?: string;
  /**
   * Light-block overrides for any remaining theme.css token — keys are
   * camelCase token names (`sidebarBackground` → `--sidebar-background`),
   * values verbatim CSS values (HSL channel triples for colors). Emitted last,
   * so they win over the generated chromatic tokens too.
   */
  tokens?: Record<string, string>;
  /** Dark-block token overrides — same shape as `tokens`. */
  darkTokens?: Record<string, string>;
};

/** HSL channel triple for a hex color, e.g. hexToHslChannels("#2563EB") → "217.2 91.2% 53.3%". */
export declare function hexToHslChannels(hex: string): string;

/** 50–900 ramp derived from a base color (hue/saturation preserved, shared lightness ladder). */
export declare function colorRamp(hex: string): Record<RampShade, string>;

/**
 * Dark-mode 50–900 ramp (reversed semantics: shade = contrast steps from the
 * dark background). Use this to derive hand-written dark ramp overrides so
 * tint/text pairings match the theme's dark semantics.
 */
export declare function darkColorRamp(hex: string): Record<RampShade, string>;

/** Complete brand stylesheet (light + dark blocks) from one or two colors. */
export declare function brandCss(options: BrandCssOptions): string;
