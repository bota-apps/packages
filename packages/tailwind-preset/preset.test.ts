import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { botaPreset } from "./preset.js";

async function compile(classes: string): Promise<string> {
  const result = await postcss(
    tailwindcss({
      presets: [botaPreset],
      corePlugins: { preflight: false },
      content: [{ raw: `<div class="${classes}"></div>`, extension: "html" }],
    }),
  ).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

describe("botaPreset color ramps", () => {
  // Regression: hsl(var(--x, <space-separated fallback>)) is unparseable by
  // Tailwind v3's color parser, which silently dropped every opacity-modified
  // ramp utility (bg-primary-500/20 emitted no CSS at all).
  it("emits opacity-modified utilities for ramp shades", async () => {
    const css = await compile(
      "bg-primary-500/20 text-secondary-700/50 bg-accent-100/10 bg-primary/20 bg-destructive-500/20",
    );
    expect(css).toContain(".bg-primary-500\\/20");
    expect(css).toContain("hsl(var(--primary-500) / 0.2)");
    expect(css).toContain(".text-secondary-700\\/50");
    expect(css).toContain(".bg-accent-100\\/10");
    expect(css).toContain(".bg-primary\\/20");
    // Regression for the destructive ramp's move from hardcoded hex to vars.
    expect(css).toContain("hsl(var(--destructive-500) / 0.2)");
  });

  it("emits plain ramp utilities resolving through the theme variables", async () => {
    const css = await compile("bg-primary-500 bg-secondary-50 text-accent-900");
    expect(css).toContain("hsl(var(--primary-500))");
    expect(css).toContain("hsl(var(--secondary-50))");
    expect(css).toContain("hsl(var(--accent-900))");
  });

  it("defines every ramp variable the preset references in theme.css — in BOTH modes", () => {
    // vitest runs from the repo root; import.meta.url is not a file: URL here.
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    // Dark ramps are reversed (shade = contrast steps from the background), so
    // the .dark block must redefine every ramp — a ramp only defined in :root
    // would render light-mode tints on dark surfaces.
    const darkBlock = themeCss.slice(themeCss.indexOf(".dark {"));
    expect(darkBlock.length).toBeGreaterThan(0);
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const ramp of ["primary", "secondary", "accent", "destructive"]) {
      for (const shade of shades) {
        expect(themeCss).toContain(`--${ramp}-${shade}:`);
        expect(darkBlock, `--${ramp}-${shade} redefined in .dark`).toContain(`--${ramp}-${shade}:`);
      }
    }
  });

  it("emits elevation utilities resolving through the shadow tokens", async () => {
    const css = await compile("shadow-raised shadow-overlay shadow-floating");
    expect(css).toContain("var(--shadow-raised)");
    expect(css).toContain("var(--shadow-overlay)");
    expect(css).toContain("var(--shadow-floating)");
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    for (const token of ["--shadow-raised", "--shadow-overlay", "--shadow-floating"]) {
      // Once in :root, once re-tuned in .dark.
      expect(themeCss.split(`${token}:`).length - 1).toBe(2);
    }
  });

  it("emits motion utilities resolving through the duration/easing tokens", async () => {
    const css = await compile(
      "duration-fast duration-base duration-slow ease-standard animate-shimmer",
    );
    expect(css).toContain("transition-duration: var(--duration-fast)");
    expect(css).toContain("transition-duration: var(--duration-base)");
    expect(css).toContain("transition-duration: var(--duration-slow)");
    expect(css).toContain("transition-timing-function: var(--ease-standard)");
    expect(css).toContain("shimmer 1.6s linear infinite");
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("emits selected-state utilities resolving through the interaction tokens", async () => {
    const css = await compile("bg-selected text-selected-foreground bg-selected/60");
    expect(css).toContain("hsl(var(--selected))");
    expect(css).toContain("hsl(var(--selected-foreground))");
    expect(css).toContain("hsl(var(--selected) / 0.6)");
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain("--selected:");
    expect(themeCss).toContain("--selected-foreground:");
  });

  it("emits container-query variants so components can adapt to their container", async () => {
    const css = await compile("@container @lg:grid-cols-2");
    expect(css).toContain("container-type: inline-size");
    expect(css).toContain("@container (min-width: 32rem)");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
  });

  it("resolves the sans/display/mono typefaces through theme.css font tokens", async () => {
    const css = await compile("font-sans font-display font-mono");
    expect(css).toContain("font-family: var(--font-sans)");
    expect(css).toContain("font-family: var(--font-display)");
    expect(css).toContain("font-family: var(--font-mono)");
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain("--font-sans:");
    expect(themeCss).toContain("--font-display:");
    expect(themeCss).toContain("--font-mono:");
  });

  it("ships font pairing files that only retune the typeface tokens", () => {
    const interCss = readFileSync("packages/tailwind-preset/fonts/inter.css", "utf8");
    expect(interCss).toContain("--font-sans:");
    expect(interCss).toContain("--font-display:");
    // Pairings restyle the voice, never the palette or shape.
    expect(interCss).not.toMatch(/--(?!font-)[a-z]/);
  });

  it("ships the compact density rule the appearance provider keys on", () => {
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain(':root[data-density="compact"]');
  });
});
