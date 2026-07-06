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
      "bg-primary-500/20 text-secondary-700/50 bg-accent-100/10 bg-primary/20",
    );
    expect(css).toContain(".bg-primary-500\\/20");
    expect(css).toContain("hsl(var(--primary-500) / 0.2)");
    expect(css).toContain(".text-secondary-700\\/50");
    expect(css).toContain(".bg-accent-100\\/10");
    expect(css).toContain(".bg-primary\\/20");
  });

  it("emits plain ramp utilities resolving through the theme variables", async () => {
    const css = await compile("bg-primary-500 bg-secondary-50 text-accent-900");
    expect(css).toContain("hsl(var(--primary-500))");
    expect(css).toContain("hsl(var(--secondary-50))");
    expect(css).toContain("hsl(var(--accent-900))");
  });

  it("defines every ramp variable the preset references in theme.css", () => {
    // vitest runs from the repo root; import.meta.url is not a file: URL here.
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const ramp of ["primary", "secondary", "accent"]) {
      for (const shade of shades) {
        expect(themeCss).toContain(`--${ramp}-${shade}:`);
      }
    }
  });

  it("resolves the sans/display typefaces through theme.css font tokens", async () => {
    const css = await compile("font-sans font-display");
    expect(css).toContain("font-family: var(--font-sans)");
    expect(css).toContain("font-family: var(--font-display)");
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain("--font-sans:");
    expect(themeCss).toContain("--font-display:");
  });

  it("ships the compact density rule the appearance provider keys on", () => {
    const themeCss = readFileSync("packages/tailwind-preset/theme.css", "utf8");
    expect(themeCss).toContain(':root[data-density="compact"]');
  });
});
