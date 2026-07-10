import { readFileSync } from "node:fs";
import { format, resolveConfig } from "prettier";
import { describe, expect, it } from "vitest";
import { brandCss, colorRamp, hexToHslChannels, type BrandCssOptions } from "./brand.js";

// Every chromatic token a brand must redefine; anything beyond these is
// opt-in per brand via the tokens/darkTokens overrides.
const lightTokens = [
  "--primary",
  "--primary-foreground",
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `--primary-${shade}`),
  "--accent",
  "--accent-foreground",
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `--accent-${shade}`),
  "--ring",
  "--sidebar-primary",
  "--sidebar-ring",
  "--chart-1",
  "--chart-3",
];
const darkTokens = [
  "--primary",
  "--primary-foreground",
  "--accent",
  "--accent-foreground",
  "--ring",
  "--sidebar-primary",
  "--sidebar-ring",
  "--chart-1",
  "--chart-3",
];

// The authoritative recipes for the shipped complete-look brands. Regenerate a
// file by running brandCss with its recipe (each file's header repeats it).
const shippedBrands: readonly { file: string; options: BrandCssOptions }[] = [
  {
    file: "manuscript.css",
    options: {
      name: "manuscript",
      primary: "#9A3412",
      accent: "#0F766E",
      radius: "0.125rem",
      fontSans: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif',
      fontDisplay: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
      tokens: {
        background: "42 44% 96%",
        foreground: "24 26% 14%",
        card: "45 46% 99%",
        cardForeground: "24 26% 14%",
        popover: "45 46% 99%",
        popoverForeground: "24 26% 14%",
        secondary: "42 32% 91%",
        secondaryForeground: "24 26% 20%",
        muted: "42 32% 91%",
        mutedForeground: "28 14% 40%",
        border: "40 26% 84%",
        input: "40 26% 84%",
        sidebarBackground: "43 40% 93%",
        sidebarForeground: "26 20% 26%",
        sidebarAccent: "42 30% 87%",
        sidebarAccentForeground: "24 26% 14%",
        sidebarBorder: "40 26% 82%",
      },
      darkTokens: {
        primary: "21 83% 56%",
        ring: "21 83% 56%",
        background: "24 22% 8%",
        foreground: "40 28% 88%",
        card: "24 20% 10%",
        cardForeground: "40 28% 88%",
        popover: "24 20% 10%",
        popoverForeground: "40 28% 88%",
        secondary: "26 16% 16%",
        secondaryForeground: "40 28% 88%",
        muted: "26 16% 16%",
        mutedForeground: "36 14% 62%",
        border: "26 16% 20%",
        input: "26 16% 20%",
        sidebarBackground: "24 22% 11%",
        sidebarForeground: "40 22% 80%",
        sidebarAccent: "26 16% 18%",
        sidebarAccentForeground: "40 28% 88%",
        sidebarBorder: "26 16% 20%",
        sidebarPrimary: "21 83% 56%",
        sidebarRing: "21 83% 56%",
      },
    },
  },
  {
    file: "terminal.css",
    options: {
      name: "terminal",
      primary: "#16A34A",
      accent: "#D97706",
      radius: "0rem",
      fontSans:
        'ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", Menlo, Consolas, monospace',
      fontDisplay:
        'ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", Menlo, Consolas, monospace',
      tokens: {
        background: "160 16% 97%",
        foreground: "165 28% 10%",
        card: "0 0% 100%",
        cardForeground: "165 28% 10%",
        popover: "0 0% 100%",
        popoverForeground: "165 28% 10%",
        secondary: "156 16% 92%",
        secondaryForeground: "165 28% 14%",
        muted: "156 16% 92%",
        mutedForeground: "162 10% 38%",
        border: "156 14% 83%",
        input: "156 14% 83%",
        sidebarBackground: "168 32% 8%",
        sidebarForeground: "150 16% 78%",
        sidebarAccent: "166 26% 15%",
        sidebarAccentForeground: "144 50% 86%",
        sidebarBorder: "166 26% 14%",
        sidebarPrimary: "142 64% 56%",
        sidebarRing: "142 64% 56%",
      },
      darkTokens: {
        primary: "142 66% 45%",
        ring: "142 66% 45%",
        background: "168 30% 5%",
        foreground: "146 36% 82%",
        card: "168 28% 7%",
        cardForeground: "146 36% 82%",
        popover: "168 28% 7%",
        popoverForeground: "146 36% 82%",
        secondary: "166 22% 12%",
        secondaryForeground: "146 36% 82%",
        muted: "166 22% 12%",
        mutedForeground: "152 12% 55%",
        border: "166 22% 16%",
        input: "166 22% 16%",
        sidebarBackground: "168 32% 4%",
        sidebarForeground: "146 30% 78%",
        sidebarAccent: "166 24% 11%",
        sidebarAccentForeground: "144 50% 86%",
        sidebarBorder: "166 24% 12%",
      },
    },
  },
  {
    file: "sorbet.css",
    options: {
      name: "sorbet",
      primary: "#DB2777",
      accent: "#F97316",
      radius: "1.25rem",
      fontSans:
        'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, "Arial Rounded MT Bold", Calibri, sans-serif',
      fontDisplay:
        'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, "Arial Rounded MT Bold", Calibri, sans-serif',
      tokens: {
        background: "327 64% 97%",
        foreground: "331 34% 16%",
        card: "0 0% 100%",
        cardForeground: "331 34% 16%",
        popover: "0 0% 100%",
        popoverForeground: "331 34% 16%",
        secondary: "291 42% 94%",
        secondaryForeground: "300 28% 24%",
        muted: "327 46% 93%",
        mutedForeground: "331 16% 42%",
        border: "327 42% 88%",
        input: "327 42% 88%",
        sidebarBackground: "327 60% 95%",
        sidebarForeground: "331 26% 30%",
        sidebarAccent: "327 52% 90%",
        sidebarAccentForeground: "331 34% 16%",
        sidebarBorder: "327 42% 87%",
      },
      darkTokens: {
        primary: "331 78% 61%",
        ring: "331 78% 61%",
        background: "315 32% 9%",
        foreground: "327 36% 92%",
        card: "315 28% 12%",
        cardForeground: "327 36% 92%",
        popover: "315 28% 12%",
        popoverForeground: "327 36% 92%",
        secondary: "315 22% 17%",
        secondaryForeground: "327 36% 92%",
        muted: "315 22% 17%",
        mutedForeground: "327 18% 65%",
        border: "315 22% 21%",
        input: "315 22% 21%",
        sidebarBackground: "315 32% 11%",
        sidebarForeground: "327 28% 82%",
        sidebarAccent: "315 24% 18%",
        sidebarAccentForeground: "327 36% 92%",
        sidebarBorder: "315 22% 21%",
        sidebarPrimary: "331 78% 61%",
        sidebarRing: "331 78% 61%",
      },
    },
  },
  {
    file: "graphite.css",
    options: {
      name: "graphite",
      primary: "#4F46E5",
      accent: "#06B6D4",
      radius: "0.375rem",
      tokens: {
        background: "220 20% 97%",
        foreground: "224 26% 10%",
        card: "0 0% 100%",
        cardForeground: "224 26% 10%",
        popover: "0 0% 100%",
        popoverForeground: "224 26% 10%",
        secondary: "220 16% 93%",
        secondaryForeground: "224 26% 14%",
        muted: "220 16% 93%",
        mutedForeground: "222 10% 42%",
        border: "220 16% 87%",
        input: "220 16% 87%",
        sidebarBackground: "226 21% 11%",
        sidebarForeground: "222 12% 72%",
        sidebarAccent: "226 17% 18%",
        sidebarAccentForeground: "222 22% 95%",
        sidebarBorder: "226 17% 17%",
        sidebarPrimary: "233 86% 75%",
        sidebarRing: "233 86% 75%",
      },
      darkTokens: {
        primary: "234 80% 68%",
        ring: "234 80% 68%",
        background: "226 22% 6%",
        foreground: "222 16% 92%",
        card: "226 20% 8%",
        cardForeground: "222 16% 92%",
        popover: "226 20% 8%",
        popoverForeground: "222 16% 92%",
        secondary: "226 16% 13%",
        secondaryForeground: "222 16% 92%",
        muted: "226 16% 13%",
        mutedForeground: "222 10% 58%",
        border: "226 16% 16%",
        input: "226 16% 16%",
        sidebarBackground: "226 22% 5%",
        sidebarForeground: "222 14% 78%",
        sidebarAccent: "226 18% 12%",
        sidebarAccentForeground: "222 22% 95%",
        sidebarBorder: "226 18% 13%",
      },
    },
  },
];

describe("hexToHslChannels", () => {
  it("converts hex to the space-separated channel triple theme.css uses", () => {
    expect(hexToHslChannels("#2563EB")).toBe("221.2 83.2% 53.3%");
    expect(hexToHslChannels("#FFFFFF")).toBe("0 0% 100%");
  });

  it("rejects non-hex input", () => {
    expect(() => hexToHslChannels("blue")).toThrow(/6-digit hex/);
    expect(() => hexToHslChannels("#FFF")).toThrow(/6-digit hex/);
  });
});

describe("colorRamp", () => {
  it("preserves hue/saturation and walks the lightness ladder monotonically", () => {
    const ramp = colorRamp("#7C3AED");
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
    let previousLightness = 100;
    for (const shade of shades) {
      const match = /^(\S+) (\S+)% (\S+)%$/.exec(ramp[shade]);
      expect(match, `ramp ${shade} is a channel triple`).toBeTruthy();
      if (!match) {
        continue;
      }
      expect(match[1]).toBe("262.1");
      expect(match[2]).toBe("83.3");
      const lightness = Number(match[3]);
      expect(lightness).toBeLessThan(previousLightness);
      previousLightness = lightness;
    }
  });
});

describe("brandCss", () => {
  it("scopes light and dark blocks under :root[data-brand] with every chromatic token", () => {
    const css = brandCss({ name: "acme", primary: "#0E7490", accent: "#F59E0B" });
    const [lightBlock, darkBlock] = css.split(':root[data-brand="acme"].dark');
    expect(lightBlock).toContain(':root[data-brand="acme"] {');
    expect(darkBlock).toBeTruthy();
    for (const token of lightTokens) {
      expect(lightBlock).toContain(`${token}: `);
    }
    for (const token of darkTokens) {
      expect(darkBlock).toContain(`${token}: `);
    }
  });

  it("picks readable foregrounds by base lightness and honors overrides", () => {
    const deep = brandCss({ name: "deep", primary: "#1D4ED8", accent: "#0F766E" });
    expect(deep).toContain("--primary-foreground: 0 0% 100%;");
    const pale = brandCss({
      name: "pale",
      primary: "#93C5FD",
      accent: "#FDE68A",
      accentForeground: "20 14% 4%",
    });
    expect(pale).toContain("--primary-foreground: 0 0% 10%;");
    expect(pale).toContain("--accent-foreground: 20 14% 4%;");
  });

  it("emits shape and typeface tokens only when the brand asks for them", () => {
    const plain = brandCss({ name: "plain", primary: "#0E7490", accent: "#F59E0B" });
    expect(plain).not.toContain("--radius");
    expect(plain).not.toContain("--font-sans");

    const shaped = brandCss({
      name: "shaped",
      primary: "#0E7490",
      accent: "#F59E0B",
      radius: "1rem",
      fontSans: '"Inter", ui-sans-serif, sans-serif',
      fontDisplay: '"Fraunces", serif',
    });
    const [lightBlock, darkBlock] = shaped.split(':root[data-brand="shaped"].dark');
    expect(lightBlock).toContain("--radius: 1rem;");
    expect(lightBlock).toContain('--font-sans: "Inter", ui-sans-serif, sans-serif;');
    expect(lightBlock).toContain('--font-display: "Fraunces", serif;');
    // Light-block tokens hold in dark — the dark block never redefines them.
    expect(darkBlock).not.toContain("--radius");
    expect(darkBlock).not.toContain("--font-");
    // The header names the full recipe so the file can be regenerated verbatim.
    expect(shaped).toContain('radius: "1rem"');
  });

  it("rejects names that are not camelCase identifiers", () => {
    expect(() => brandCss({ name: "My Brand", primary: "#000000", accent: "#000000" })).toThrow(
      /camelCase/,
    );
  });

  it("emits tokens/darkTokens overrides last in their block, kebab-cased", () => {
    const css = brandCss({
      name: "framed",
      primary: "#4F46E5",
      accent: "#06B6D4",
      tokens: { background: "220 20% 97%", sidebarAccentForeground: "222 22% 95%" },
      darkTokens: { primary: "234 80% 68%", chart1: "234 80% 68%" },
    });
    const [lightBlock, darkBlock] = css.split(':root[data-brand="framed"].dark');
    expect(lightBlock).toContain("--background: 220 20% 97%;");
    expect(lightBlock).toContain("--sidebar-accent-foreground: 222 22% 95%;");
    // Overrides emit after the generated chromatic tokens, so a brand can win
    // over them (dark-chrome brands brightening primary for dark surfaces).
    expect(darkBlock).toContain("--chart-1: 234 80% 68%;");
    expect(darkBlock?.lastIndexOf("--primary: 234 80% 68%;")).toBeGreaterThan(
      darkBlock?.indexOf("--primary: ") ?? 0,
    );
    // The header names the full recipe so the file can be regenerated verbatim.
    expect(css).toContain('tokens: {"background":"220 20% 97%"');
  });

  // The shipped brand files are the generator's own output (run through the
  // repo's Prettier formatting, as the pre-commit hook does) — regenerating
  // them must be a no-op, so the files and the function can never drift apart.
  // Each file's header comment carries this exact recipe, so either is enough
  // to reproduce the other.
  it("matches the checked-in brands/*.css files exactly", async () => {
    for (const brand of shippedBrands) {
      // vitest runs from the repo root; import.meta.url is not a file: URL here.
      const path = `packages/tailwind-preset/brands/${brand.file}`;
      const css = readFileSync(path, "utf8");
      const prettierOptions = await resolveConfig(path);
      expect(css).toBe(
        await format(brandCss(brand.options), { ...prettierOptions, parser: "css" }),
      );
    }
  });
});
