import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { brandCss, colorRamp, hexToHslChannels } from "./brand.js";

// Every chromatic token a brand must redefine — neutrals stay inherited from
// theme.css's :root/.dark so all brands share the same surfaces.
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

  // The shipped brand files are the generator's own output — regenerating them
  // must be a no-op, so the files and the function can never drift apart.
  it("matches the checked-in brands/*.css files exactly", () => {
    const shipped = [
      { file: "emerald.css", options: { name: "emerald", primary: "#059669", accent: "#F59E0B" } },
      { file: "violet.css", options: { name: "violet", primary: "#7C3AED", accent: "#EC4899" } },
    ];
    for (const brand of shipped) {
      // vitest runs from the repo root; import.meta.url is not a file: URL here.
      const css = readFileSync(`packages/tailwind-preset/brands/${brand.file}`, "utf8");
      expect(css).toBe(brandCss(brand.options));
    }
  });
});
