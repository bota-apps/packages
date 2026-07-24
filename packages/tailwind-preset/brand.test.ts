import { readFileSync } from "node:fs";
import { format, resolveConfig } from "prettier";
import { describe, expect, it } from "vitest";
import {
  brandCss,
  colorRamp,
  darkColorRamp,
  hexToHslChannels,
  type BrandCssOptions,
} from "./brand.js";

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
    file: "ledger.css",
    options: {
      name: "ledger",
      primary: "#1E3A8A",
      accent: "#B91C1C",
      radius: "0.125rem",
      fontDisplay: '"American Typewriter", Rockwell, "Courier New", Courier, monospace',
      tokens: {
        background: "40 32% 94%",
        foreground: "222 30% 16%",
        card: "44 42% 98%",
        cardForeground: "222 30% 16%",
        popover: "44 42% 98%",
        popoverForeground: "222 30% 16%",
        secondary: "40 26% 89%",
        secondaryForeground: "222 24% 22%",
        muted: "40 26% 89%",
        mutedForeground: "222 12% 40%",
        border: "38 24% 78%",
        input: "38 24% 78%",
        sidebarBackground: "222 44% 14%",
        sidebarForeground: "40 26% 82%",
        sidebarAccent: "222 36% 20%",
        sidebarAccentForeground: "40 32% 92%",
        sidebarBorder: "222 36% 19%",
        sidebarPrimary: "224 70% 70%",
        sidebarRing: "224 70% 70%",
      },
      darkTokens: {
        primary: "224 64% 64%",
        ring: "224 64% 64%",
        background: "222 20% 9%",
        foreground: "40 22% 88%",
        card: "222 18% 12%",
        cardForeground: "40 22% 88%",
        popover: "222 18% 12%",
        popoverForeground: "40 22% 88%",
        secondary: "222 14% 17%",
        secondaryForeground: "40 22% 88%",
        muted: "222 14% 17%",
        mutedForeground: "222 10% 60%",
        border: "222 14% 21%",
        input: "222 14% 21%",
        sidebarBackground: "222 40% 7%",
        sidebarForeground: "40 16% 78%",
        sidebarAccent: "222 30% 14%",
        sidebarAccentForeground: "40 22% 88%",
        sidebarBorder: "222 30% 13%",
        sidebarPrimary: "224 64% 64%",
        sidebarRing: "224 64% 64%",
      },
    },
  },
  {
    file: "kraft.css",
    options: {
      name: "kraft",
      primary: "#166534",
      accent: "#C2410C",
      radius: "0.375rem",
      fontSans:
        'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
      fontDisplay: 'Rockwell, "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif',
      tokens: {
        background: "36 30% 91%",
        foreground: "30 24% 16%",
        card: "40 36% 97%",
        cardForeground: "30 24% 16%",
        popover: "40 36% 97%",
        popoverForeground: "30 24% 16%",
        secondary: "36 24% 85%",
        secondaryForeground: "30 24% 22%",
        muted: "36 24% 85%",
        mutedForeground: "32 12% 40%",
        border: "34 22% 74%",
        input: "34 22% 74%",
        sidebarBackground: "34 30% 84%",
        sidebarForeground: "30 24% 20%",
        sidebarAccent: "34 26% 77%",
        sidebarAccentForeground: "30 24% 14%",
        sidebarBorder: "34 24% 72%",
      },
      darkTokens: {
        primary: "142 55% 58%",
        ring: "142 55% 58%",
        background: "28 18% 9%",
        foreground: "36 24% 86%",
        card: "28 16% 12%",
        cardForeground: "36 24% 86%",
        popover: "28 16% 12%",
        popoverForeground: "36 24% 86%",
        secondary: "28 12% 17%",
        secondaryForeground: "36 24% 86%",
        muted: "28 12% 17%",
        mutedForeground: "34 10% 60%",
        border: "28 12% 21%",
        input: "28 12% 21%",
        sidebarBackground: "28 18% 11%",
        sidebarForeground: "36 18% 76%",
        sidebarAccent: "28 14% 18%",
        sidebarAccentForeground: "36 24% 86%",
        sidebarBorder: "28 14% 20%",
        sidebarPrimary: "142 55% 58%",
        sidebarRing: "142 55% 58%",
      },
    },
  },
  {
    file: "blueprint.css",
    options: {
      name: "blueprint",
      primary: "#0E7490",
      accent: "#EA580C",
      radius: "0rem",
      fontDisplay:
        'ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", Menlo, Consolas, monospace',
      tokens: {
        background: "206 36% 95%",
        foreground: "212 40% 13%",
        card: "0 0% 100%",
        cardForeground: "212 40% 13%",
        popover: "0 0% 100%",
        popoverForeground: "212 40% 13%",
        secondary: "208 30% 90%",
        secondaryForeground: "212 34% 18%",
        muted: "208 30% 90%",
        mutedForeground: "210 14% 40%",
        border: "208 28% 80%",
        input: "208 28% 80%",
        sidebarBackground: "212 55% 16%",
        sidebarForeground: "205 40% 82%",
        sidebarAccent: "212 45% 23%",
        sidebarAccentForeground: "204 60% 92%",
        sidebarBorder: "212 45% 22%",
        sidebarPrimary: "192 70% 62%",
        sidebarRing: "192 70% 62%",
      },
      darkTokens: {
        primary: "192 70% 55%",
        ring: "192 70% 55%",
        background: "212 45% 7%",
        foreground: "205 40% 88%",
        card: "212 40% 10%",
        cardForeground: "205 40% 88%",
        popover: "212 40% 10%",
        popoverForeground: "205 40% 88%",
        secondary: "212 32% 15%",
        secondaryForeground: "205 40% 88%",
        muted: "212 32% 15%",
        mutedForeground: "207 18% 60%",
        border: "212 32% 19%",
        input: "212 32% 19%",
        sidebarBackground: "212 50% 5%",
        sidebarForeground: "205 34% 80%",
        sidebarAccent: "212 38% 12%",
        sidebarAccentForeground: "204 60% 92%",
        sidebarBorder: "212 38% 13%",
        sidebarPrimary: "192 70% 62%",
        sidebarRing: "192 70% 62%",
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
  {
    file: "freight.css",
    options: {
      name: "freight",
      // Corridor blue: the system/network color — primary actions, links,
      // focus, selected entities, planned movement. Port-authority depth with
      // enough chroma to read as a working signal, not near-black.
      primary: "#175490",
      // Signal orange: manual intervention — human-entered updates, handoffs,
      // action-required states. Never a decorative highlight. Deep enough to
      // carry white text.
      accent: "#D0591C",
      radius: "0.25rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      // Signage voice for headings: a DIN-flavored semi-condensed grotesk in
      // the transport-lettering tradition. Degrades to the Inter body stack
      // when the webfont isn't loaded (loading stays the app's job).
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        // Documentary mono for reference numbers, timestamps, and amounts —
        // the waybill voice. Same loading contract as the display face.
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "212 26% 95%",
        foreground: "213 45% 11%",
        card: "0 0% 100%",
        cardForeground: "213 45% 11%",
        popover: "0 0% 100%",
        popoverForeground: "213 45% 11%",
        secondary: "211 26% 90%",
        secondaryForeground: "213 34% 17%",
        muted: "211 26% 90%",
        mutedForeground: "212 16% 39%",
        border: "212 26% 82%",
        input: "212 26% 82%",
        // Navy-tinted elevation: raised surfaces read crisp on the steel
        // canvas. Dark counterparts are set in darkTokens — a light-block
        // shadow override would out-specify theme.css's .dark shadows.
        shadowRaised: "0 1px 2px 0 hsl(213 55% 12% / 0.07)",
        shadowOverlay:
          "0 4px 8px -2px hsl(213 55% 12% / 0.12), 0 2px 4px -2px hsl(213 55% 12% / 0.08)",
        shadowFloating:
          "0 12px 20px -4px hsl(213 55% 12% / 0.14), 0 4px 8px -4px hsl(213 55% 12% / 0.1)",
        sidebarBackground: "214 60% 10%",
        sidebarForeground: "211 28% 78%",
        sidebarAccent: "213 48% 16%",
        sidebarAccentForeground: "210 44% 94%",
        sidebarBorder: "213 48% 15%",
        sidebarPrimary: "207 80% 66%",
        sidebarRing: "207 80% 66%",
        // Cartographic chart palette — harbor teal, steel slate, crane red,
        // sky, buoy amber, container green (slots 1/3 stay primary/accent).
        chart2: "188 62% 34%",
        chart4: "214 22% 46%",
        chart5: "354 62% 46%",
        chart6: "203 80% 44%",
        chart7: "35 80% 44%",
        chart8: "150 42% 34%",
        // Geo/map tokens — panels, markers, routes, and location-freshness
        // treatments for map-centric screens. Freshness must never be carried
        // by color alone (pair with shape/dash/label at the call site).
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "212 44% 12%",
        mapPanelBorder: "211 24% 84%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(212 45% 15% / 0.1), 0 2px 4px -2px hsl(212 45% 15% / 0.1)",
        mapMarkerDefault: "211 40% 45%",
        mapMarkerSelected: "209 73% 42%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "210 72% 33%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "209 73% 42%",
        mapRouteObserved: "187 52% 36%",
        mapRouteCompleted: "211 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "262 55% 52%",
        mapLocationStale: "211 12% 55%",
        mapOverlayScrim: "hsl(212 50% 10% / 0.5)",
      },
      darkTokens: {
        primary: "208 76% 60%",
        ring: "208 76% 60%",
        background: "214 45% 6.5%",
        foreground: "210 32% 89%",
        card: "213 40% 9.5%",
        cardForeground: "210 32% 89%",
        popover: "213 38% 11%",
        popoverForeground: "210 32% 89%",
        secondary: "213 32% 14%",
        secondaryForeground: "210 32% 89%",
        muted: "213 32% 14%",
        mutedForeground: "211 18% 64%",
        border: "213 32% 18%",
        input: "213 32% 18%",
        shadowRaised: "0 1px 2px 0 hsl(0 0% 0% / 0.5)",
        shadowOverlay: "0 4px 8px -2px hsl(0 0% 0% / 0.55), 0 2px 4px -2px hsl(0 0% 0% / 0.45)",
        shadowFloating: "0 12px 20px -4px hsl(0 0% 0% / 0.6), 0 4px 8px -4px hsl(0 0% 0% / 0.5)",
        sidebarBackground: "215 55% 4.5%",
        sidebarForeground: "211 26% 78%",
        sidebarAccent: "214 38% 11%",
        sidebarAccentForeground: "210 44% 94%",
        sidebarBorder: "214 38% 12%",
        sidebarPrimary: "207 80% 68%",
        sidebarRing: "207 80% 68%",
        chart2: "188 60% 48%",
        chart4: "214 24% 60%",
        chart5: "354 72% 62%",
        chart6: "203 82% 58%",
        chart7: "38 85% 58%",
        chart8: "150 45% 48%",
        mapPanelBackground: "213 38% 10%",
        mapPanelForeground: "210 30% 88%",
        mapPanelBorder: "213 30% 21%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "211 25% 62%",
        mapMarkerSelected: "208 76% 62%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "208 76% 60%",
        mapClusterForeground: "213 45% 8%",
        mapRoutePlanned: "208 76% 60%",
        mapRouteObserved: "187 55% 48%",
        mapRouteCompleted: "211 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "262 62% 66%",
        mapLocationStale: "211 10% 48%",
        mapOverlayScrim: "hsl(213 55% 3% / 0.6)",
      },
      // One brand, two product surfaces: a dense operations console and a
      // comfortable customer portal. Each overrides only what meaningfully
      // differs; density itself stays on the data-density axis.
      surfaces: {
        operations: {
          tokens: {
            background: "212 24% 93.5%",
            border: "212 28% 77%",
            input: "212 28% 77%",
            shadowRaised: "0 1px 1px 0 hsl(213 55% 12% / 0.05)",
          },
          darkTokens: {
            border: "213 32% 22%",
            input: "213 32% 22%",
          },
        },
        customer: {
          tokens: {
            radius: "0.375rem",
            background: "211 32% 97%",
            secondary: "211 28% 92.5%",
            muted: "211 28% 92.5%",
            border: "212 24% 86%",
            input: "212 24% 86%",
          },
          darkTokens: {
            background: "213 38% 7.5%",
            card: "213 34% 10.5%",
            border: "213 28% 17%",
            input: "213 28% 17%",
          },
        },
      },
    },
  },
  // The bright logistics collection: five complete looks sharing one
  // structural language — bright hue-tinted page canvas, white cards, crisp
  // borders, a saturated (or airy) sidebar, and stable chart/map semantics —
  // differing only in identity hue. Selected-navigation tones are chosen to
  // hold WCAG AA with their foregrounds in both modes.
  {
    file: "freightOcean.css",
    options: {
      name: "freightOcean",
      // Ocean blue: confident primary for actions, links, focus, selection.
      primary: "#2563EB",
      // Harbor teal: secondary emphasis that never impersonates a status.
      // Deep enough (L 27%) for white text to hold AA on accent fills.
      accent: "#0B7F7E",
      radius: "0.375rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "214 45% 97%",
        foreground: "218 49% 15%",
        card: "0 0% 100%",
        cardForeground: "218 49% 15%",
        popover: "0 0% 100%",
        popoverForeground: "218 49% 15%",
        secondary: "214 55% 94%",
        secondaryForeground: "218 40% 22%",
        muted: "214 40% 94%",
        mutedForeground: "216 18% 42%",
        border: "214 36% 86%",
        input: "214 36% 86%",
        // Saturated light-mode sidebar; the selected tone sits below the rail
        // color so white item text keeps AA contrast.
        sidebarBackground: "221 83% 53%",
        sidebarForeground: "0 0% 100%",
        sidebarAccent: "224 71% 42%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "221 74% 47%",
        sidebarPrimary: "0 0% 100%",
        sidebarRing: "0 0% 100%",
        // Shared categorical palette (slots 1/3 stay primary/accent); the
        // blue slot shifts to sky so it never shadows the primary.
        chart2: "173 80% 40%",
        chart4: "215 16% 47%",
        chart5: "0 84% 60%",
        chart6: "199 89% 48%",
        chart7: "258 90% 66%",
        chart8: "142 71% 45%",
        // Geo/map tokens — same semantics as the freight brand: planned and
        // selected ride the identity hue, observed stays teal, exceptions
        // red, freshness green/violet/slate (never color alone).
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "218 49% 15%",
        mapPanelBorder: "214 36% 86%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(218 45% 15% / 0.1), 0 2px 4px -2px hsl(218 45% 15% / 0.1)",
        mapMarkerDefault: "221 35% 48%",
        mapMarkerSelected: "221 83% 53%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "226 71% 40%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "221 83% 53%",
        mapRouteObserved: "173 66% 38%",
        mapRouteCompleted: "215 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "262 55% 52%",
        mapLocationStale: "215 12% 55%",
        mapOverlayScrim: "hsl(218 50% 10% / 0.5)",
      },
      darkTokens: {
        primary: "217 91% 65%",
        // Lifted dark primaries carry dark text — white would fail AA.
        primaryForeground: "218 40% 8%",
        ring: "217 91% 65%",
        background: "218 40% 8%",
        foreground: "214 32% 90%",
        card: "218 36% 11%",
        cardForeground: "214 32% 90%",
        popover: "218 34% 12.5%",
        popoverForeground: "214 32% 90%",
        secondary: "218 30% 16%",
        secondaryForeground: "214 32% 90%",
        muted: "218 30% 16%",
        mutedForeground: "216 16% 66%",
        border: "218 28% 20%",
        input: "218 28% 20%",
        sidebarBackground: "220 45% 12%",
        sidebarForeground: "214 30% 86%",
        sidebarAccent: "219 40% 18%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "219 38% 17%",
        sidebarPrimary: "217 91% 70%",
        sidebarRing: "217 91% 70%",
        chart2: "172 66% 50%",
        chart4: "215 20% 65%",
        chart5: "0 91% 71%",
        chart6: "198 93% 60%",
        chart7: "255 92% 76%",
        chart8: "142 69% 58%",
        mapPanelBackground: "218 36% 11%",
        mapPanelForeground: "214 30% 88%",
        mapPanelBorder: "218 26% 22%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "217 30% 62%",
        mapMarkerSelected: "217 91% 65%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "217 91% 65%",
        mapClusterForeground: "218 40% 8%",
        mapRoutePlanned: "217 91% 65%",
        mapRouteObserved: "173 60% 50%",
        mapRouteCompleted: "215 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "262 62% 66%",
        mapLocationStale: "215 10% 48%",
        mapOverlayScrim: "hsl(218 50% 3% / 0.6)",
      },
      surfaces: {
        operations: {
          tokens: {
            background: "214 42% 95.5%",
            border: "214 32% 82%",
            input: "214 32% 82%",
          },
          darkTokens: {
            border: "218 28% 24%",
            input: "218 28% 24%",
          },
        },
        customer: {
          tokens: {
            radius: "0.5rem",
            background: "214 50% 98%",
            border: "214 34% 88%",
            input: "214 34% 88%",
          },
          darkTokens: {
            background: "218 38% 9.5%",
            card: "218 34% 12.5%",
            border: "218 26% 18%",
            input: "218 26% 18%",
          },
        },
      },
    },
  },
  {
    file: "freightSky.css",
    options: {
      name: "freightSky",
      // Bright sky blue: the airiest look in the collection — near-white
      // canvas, light sidebar, tinted (not painted) chrome. Primary and
      // accent sit deep enough for white text to hold AA on fills.
      primary: "#0064F0",
      accent: "#0E8174",
      radius: "0.375rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "210 40% 98%",
        foreground: "217 45% 16%",
        card: "0 0% 100%",
        cardForeground: "217 45% 16%",
        popover: "0 0% 100%",
        popoverForeground: "217 45% 16%",
        secondary: "210 55% 95%",
        secondaryForeground: "217 36% 24%",
        muted: "210 40% 95%",
        mutedForeground: "214 16% 44%",
        border: "211 32% 88%",
        input: "211 32% 88%",
        // Light sidebar: selection is a saturated tint carrying deep-blue
        // text, so the rail stays airy without losing the selected state.
        sidebarBackground: "210 50% 98%",
        sidebarForeground: "217 40% 23%",
        sidebarAccent: "212 100% 95%",
        sidebarAccentForeground: "216 74% 38%",
        sidebarBorder: "211 32% 88%",
        sidebarPrimary: "212 100% 50%",
        sidebarRing: "212 100% 55%",
        // Blue slot shifts to cyan; the primary already owns blue.
        chart2: "173 80% 40%",
        chart4: "215 16% 47%",
        chart5: "0 84% 60%",
        chart6: "189 94% 43%",
        chart7: "258 90% 66%",
        chart8: "142 71% 45%",
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "217 45% 16%",
        mapPanelBorder: "211 32% 88%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(215 45% 15% / 0.1), 0 2px 4px -2px hsl(215 45% 15% / 0.1)",
        mapMarkerDefault: "212 40% 52%",
        mapMarkerSelected: "212 100% 50%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "217 89% 41%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "212 100% 50%",
        mapRouteObserved: "173 66% 38%",
        mapRouteCompleted: "215 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "262 55% 52%",
        mapLocationStale: "215 12% 55%",
        mapOverlayScrim: "hsl(215 50% 10% / 0.5)",
      },
      darkTokens: {
        primary: "212 100% 64%",
        // Lifted dark primaries carry dark text — white would fail AA.
        primaryForeground: "216 36% 8%",
        ring: "212 100% 64%",
        background: "216 36% 8%",
        foreground: "213 30% 90%",
        card: "216 32% 11%",
        cardForeground: "213 30% 90%",
        popover: "216 30% 12.5%",
        popoverForeground: "213 30% 90%",
        secondary: "216 26% 16%",
        secondaryForeground: "213 30% 90%",
        muted: "216 26% 16%",
        mutedForeground: "214 15% 66%",
        border: "216 24% 20%",
        input: "216 24% 20%",
        sidebarBackground: "216 34% 10%",
        sidebarForeground: "213 28% 84%",
        sidebarAccent: "215 60% 22%",
        sidebarAccentForeground: "210 100% 92%",
        sidebarBorder: "216 26% 18%",
        sidebarPrimary: "212 100% 68%",
        sidebarRing: "212 100% 68%",
        chart2: "172 66% 50%",
        chart4: "215 20% 65%",
        chart5: "0 91% 71%",
        chart6: "187 92% 55%",
        chart7: "255 92% 76%",
        chart8: "142 69% 58%",
        mapPanelBackground: "216 32% 11%",
        mapPanelForeground: "213 28% 88%",
        mapPanelBorder: "216 24% 22%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "213 28% 62%",
        mapMarkerSelected: "212 100% 64%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "212 100% 64%",
        mapClusterForeground: "216 36% 8%",
        mapRoutePlanned: "212 100% 64%",
        mapRouteObserved: "173 60% 50%",
        mapRouteCompleted: "215 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "262 62% 66%",
        mapLocationStale: "215 10% 48%",
        mapOverlayScrim: "hsl(216 50% 3% / 0.6)",
      },
      surfaces: {
        operations: {
          tokens: {
            background: "210 38% 96%",
            border: "211 28% 83%",
            input: "211 28% 83%",
          },
          darkTokens: {
            border: "216 24% 24%",
            input: "216 24% 24%",
          },
        },
        customer: {
          tokens: {
            radius: "0.5rem",
            background: "210 45% 98.5%",
            border: "211 30% 89.5%",
            input: "211 30% 89.5%",
          },
          darkTokens: {
            background: "216 34% 9.5%",
            card: "216 30% 12.5%",
            border: "216 22% 18%",
            input: "216 22% 18%",
          },
        },
      },
    },
  },
  {
    file: "freightTeal.css",
    options: {
      name: "freightTeal",
      // Teal horizon: calm operational teal with a blue accent. Teal has
      // high luminance for its lightness, so the primary sits at L 28% to
      // keep white text at AA on fills.
      primary: "#0C827F",
      accent: "#2563EB",
      radius: "0.375rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "174 38% 97%",
        foreground: "184 48% 13%",
        card: "0 0% 100%",
        cardForeground: "184 48% 13%",
        popover: "0 0% 100%",
        popoverForeground: "184 48% 13%",
        secondary: "174 42% 92%",
        secondaryForeground: "184 38% 20%",
        muted: "174 30% 92%",
        mutedForeground: "181 15% 37%",
        border: "176 27% 82%",
        input: "176 27% 82%",
        sidebarBackground: "179 83% 26%",
        sidebarForeground: "0 0% 100%",
        sidebarAccent: "181 85% 19%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "179 74% 22%",
        sidebarPrimary: "0 0% 100%",
        sidebarRing: "173 80% 85%",
        // Teal slot shifts to sky; the primary already owns teal.
        chart2: "199 89% 48%",
        chart4: "215 16% 47%",
        chart5: "0 84% 60%",
        chart6: "217 91% 60%",
        chart7: "258 90% 66%",
        chart8: "142 71% 45%",
        // Planned rides the teal identity, so observed movement borrows the
        // accent blue to stay distinguishable (freshness cues stay shared).
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "184 48% 13%",
        mapPanelBorder: "176 27% 82%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(184 45% 15% / 0.1), 0 2px 4px -2px hsl(184 45% 15% / 0.1)",
        mapMarkerDefault: "180 30% 45%",
        mapMarkerSelected: "178 83% 34%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "179 82% 24%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "178 83% 34%",
        mapRouteObserved: "221 70% 45%",
        mapRouteCompleted: "215 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "262 55% 52%",
        mapLocationStale: "215 12% 55%",
        mapOverlayScrim: "hsl(184 50% 10% / 0.5)",
      },
      darkTokens: {
        primary: "175 65% 48%",
        // Lifted dark primaries carry dark text — white would fail AA.
        primaryForeground: "185 38% 7.5%",
        ring: "175 65% 48%",
        background: "185 38% 7.5%",
        foreground: "178 25% 90%",
        card: "185 34% 10.5%",
        cardForeground: "178 25% 90%",
        popover: "185 32% 12%",
        popoverForeground: "178 25% 90%",
        secondary: "184 28% 15%",
        secondaryForeground: "178 25% 90%",
        muted: "184 28% 15%",
        mutedForeground: "181 14% 65%",
        border: "184 24% 19%",
        input: "184 24% 19%",
        sidebarBackground: "182 45% 11%",
        sidebarForeground: "176 28% 86%",
        sidebarAccent: "180 40% 17%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "181 38% 16%",
        sidebarPrimary: "173 70% 60%",
        sidebarRing: "173 70% 60%",
        chart2: "198 93% 60%",
        chart4: "215 20% 65%",
        chart5: "0 91% 71%",
        chart6: "213 94% 68%",
        chart7: "255 92% 76%",
        chart8: "142 69% 58%",
        mapPanelBackground: "185 34% 10.5%",
        mapPanelForeground: "178 24% 88%",
        mapPanelBorder: "184 22% 21%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "179 22% 60%",
        mapMarkerSelected: "175 65% 48%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "175 65% 48%",
        mapClusterForeground: "185 38% 7.5%",
        mapRoutePlanned: "175 65% 48%",
        mapRouteObserved: "221 84% 62%",
        mapRouteCompleted: "215 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "262 62% 66%",
        mapLocationStale: "215 10% 48%",
        mapOverlayScrim: "hsl(185 50% 3% / 0.6)",
      },
      surfaces: {
        operations: {
          tokens: {
            background: "174 34% 95.5%",
            border: "176 24% 77%",
            input: "176 24% 77%",
          },
          darkTokens: {
            border: "184 24% 23%",
            input: "184 24% 23%",
          },
        },
        customer: {
          tokens: {
            radius: "0.5rem",
            background: "174 42% 98%",
            border: "176 25% 85%",
            input: "176 25% 85%",
          },
          darkTokens: {
            background: "185 36% 9%",
            card: "185 32% 12%",
            border: "184 22% 17%",
            input: "184 22% 17%",
          },
        },
      },
    },
  },
  {
    file: "freightEmerald.css",
    options: {
      name: "freightEmerald",
      // Emerald route: grounded green with a blue accent. Deep emerald
      // (L 26%) keeps white text at AA on fills.
      primary: "#04805A",
      accent: "#2563EB",
      radius: "0.375rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "150 28% 97%",
        foreground: "160 42% 13%",
        card: "0 0% 100%",
        cardForeground: "160 42% 13%",
        popover: "0 0% 100%",
        popoverForeground: "160 42% 13%",
        secondary: "150 35% 92%",
        secondaryForeground: "158 35% 20%",
        muted: "150 25% 92%",
        mutedForeground: "156 14% 37%",
        border: "151 24% 82%",
        input: "151 24% 82%",
        sidebarBackground: "160 84% 28%",
        sidebarForeground: "0 0% 100%",
        sidebarAccent: "162 84% 21%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "160 77% 24%",
        sidebarPrimary: "0 0% 100%",
        sidebarRing: "151 74% 82%",
        // Green slot shifts to lime; the primary already owns green.
        chart2: "173 80% 40%",
        chart4: "215 16% 47%",
        chart5: "0 84% 60%",
        chart6: "217 91% 60%",
        chart7: "258 90% 66%",
        chart8: "84 81% 44%",
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "160 42% 13%",
        mapPanelBorder: "151 24% 82%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(160 40% 15% / 0.1), 0 2px 4px -2px hsl(160 40% 15% / 0.1)",
        mapMarkerDefault: "158 28% 44%",
        mapMarkerSelected: "160 84% 30%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "163 88% 20%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "160 84% 30%",
        mapRouteObserved: "180 62% 38%",
        mapRouteCompleted: "215 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "262 55% 52%",
        mapLocationStale: "215 12% 55%",
        mapOverlayScrim: "hsl(160 45% 10% / 0.5)",
      },
      darkTokens: {
        primary: "158 64% 47%",
        // Lifted dark primaries carry dark text — white would fail AA.
        primaryForeground: "165 30% 7.5%",
        ring: "158 64% 47%",
        background: "165 30% 7.5%",
        foreground: "152 22% 90%",
        card: "165 27% 10.5%",
        cardForeground: "152 22% 90%",
        popover: "164 26% 12%",
        popoverForeground: "152 22% 90%",
        secondary: "162 22% 15%",
        secondaryForeground: "152 22% 90%",
        muted: "162 22% 15%",
        mutedForeground: "156 12% 64%",
        border: "162 20% 19%",
        input: "162 20% 19%",
        sidebarBackground: "163 40% 11%",
        sidebarForeground: "152 24% 86%",
        sidebarAccent: "161 34% 17%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "162 32% 16%",
        sidebarPrimary: "151 65% 60%",
        sidebarRing: "151 65% 60%",
        chart2: "172 66% 50%",
        chart4: "215 20% 65%",
        chart5: "0 91% 71%",
        chart6: "213 94% 68%",
        chart7: "255 92% 76%",
        chart8: "83 78% 55%",
        mapPanelBackground: "165 27% 10.5%",
        mapPanelForeground: "152 20% 88%",
        mapPanelBorder: "162 18% 21%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "157 20% 58%",
        mapMarkerSelected: "158 64% 47%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "158 64% 47%",
        mapClusterForeground: "165 30% 7.5%",
        mapRoutePlanned: "158 64% 47%",
        mapRouteObserved: "180 60% 50%",
        mapRouteCompleted: "215 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "262 62% 66%",
        mapLocationStale: "215 10% 48%",
        mapOverlayScrim: "hsl(165 40% 3% / 0.6)",
      },
      surfaces: {
        operations: {
          tokens: {
            background: "150 25% 95.5%",
            border: "151 22% 77%",
            input: "151 22% 77%",
          },
          darkTokens: {
            border: "162 20% 23%",
            input: "162 20% 23%",
          },
        },
        customer: {
          tokens: {
            radius: "0.5rem",
            background: "150 32% 98%",
            border: "151 22% 85%",
            input: "151 22% 85%",
          },
          darkTokens: {
            background: "165 28% 9%",
            card: "165 25% 12%",
            border: "162 18% 17%",
            input: "162 18% 17%",
          },
        },
      },
    },
  },
  {
    file: "freightViolet.css",
    options: {
      name: "freightViolet",
      // Violet focus: bold premium violet with a blue accent.
      primary: "#7C3AED",
      accent: "#2563EB",
      radius: "0.375rem",
      fontSans:
        '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontDisplay:
        '"Barlow Semi Condensed", Barlow, "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      tokens: {
        fontMono:
          '"IBM Plex Mono", "JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        background: "255 42% 98%",
        foreground: "257 42% 16%",
        card: "0 0% 100%",
        cardForeground: "257 42% 16%",
        popover: "0 0% 100%",
        popoverForeground: "257 42% 16%",
        secondary: "255 45% 94%",
        secondaryForeground: "258 36% 22%",
        muted: "255 34% 93%",
        mutedForeground: "255 15% 42%",
        border: "255 28% 85%",
        input: "255 28% 85%",
        sidebarBackground: "263 70% 48%",
        sidebarForeground: "0 0% 100%",
        sidebarAccent: "264 66% 37%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "263 64% 42%",
        sidebarPrimary: "0 0% 100%",
        sidebarRing: "252 95% 85%",
        // Violet slot shifts to fuchsia; the primary already owns violet.
        chart2: "173 80% 40%",
        chart4: "215 16% 47%",
        chart5: "0 84% 60%",
        chart6: "217 91% 60%",
        chart7: "292 84% 61%",
        chart8: "142 71% 45%",
        // Estimated freshness borrows fuchsia here — the shared violet cue
        // would vanish against a violet identity.
        mapPanelBackground: "0 0% 100%",
        mapPanelForeground: "257 42% 16%",
        mapPanelBorder: "255 28% 85%",
        mapPanelShadow:
          "0 4px 6px -1px hsl(257 40% 15% / 0.1), 0 2px 4px -2px hsl(257 40% 15% / 0.1)",
        mapMarkerDefault: "260 30% 52%",
        mapMarkerSelected: "263 70% 58%",
        mapMarkerWarning: "32 95% 44%",
        mapMarkerCritical: "0 72% 46%",
        mapClusterBackground: "263 69% 42%",
        mapClusterForeground: "0 0% 100%",
        mapRoutePlanned: "263 70% 58%",
        mapRouteObserved: "173 66% 38%",
        mapRouteCompleted: "215 14% 58%",
        mapRouteException: "0 72% 46%",
        mapLocationLive: "142 64% 33%",
        mapLocationReported: "20 69% 48%",
        mapLocationEstimated: "292 64% 52%",
        mapLocationStale: "215 12% 55%",
        mapOverlayScrim: "hsl(257 45% 10% / 0.5)",
      },
      darkTokens: {
        primary: "262 83% 70%",
        // Lifted dark primaries carry dark text — white would fail AA.
        primaryForeground: "258 32% 8.5%",
        ring: "262 83% 70%",
        background: "258 32% 8.5%",
        foreground: "255 28% 91%",
        card: "258 28% 11.5%",
        cardForeground: "255 28% 91%",
        popover: "258 27% 13%",
        popoverForeground: "255 28% 91%",
        secondary: "257 24% 17%",
        secondaryForeground: "255 28% 91%",
        muted: "257 24% 17%",
        mutedForeground: "255 14% 68%",
        border: "257 22% 21%",
        input: "257 22% 21%",
        sidebarBackground: "260 40% 13%",
        sidebarForeground: "255 26% 87%",
        sidebarAccent: "260 36% 20%",
        sidebarAccentForeground: "0 0% 100%",
        sidebarBorder: "260 34% 18%",
        sidebarPrimary: "262 90% 76%",
        sidebarRing: "262 90% 76%",
        chart2: "172 66% 50%",
        chart4: "215 20% 65%",
        chart5: "0 91% 71%",
        chart6: "213 94% 68%",
        chart7: "292 91% 73%",
        chart8: "142 69% 58%",
        mapPanelBackground: "258 28% 11.5%",
        mapPanelForeground: "255 26% 89%",
        mapPanelBorder: "257 20% 23%",
        mapPanelShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.5), 0 2px 4px -2px hsl(0 0% 0% / 0.4)",
        mapMarkerDefault: "258 22% 64%",
        mapMarkerSelected: "262 83% 70%",
        mapMarkerWarning: "38 90% 56%",
        mapMarkerCritical: "0 78% 58%",
        mapClusterBackground: "262 83% 70%",
        mapClusterForeground: "258 32% 8.5%",
        mapRoutePlanned: "262 83% 70%",
        mapRouteObserved: "173 60% 50%",
        mapRouteCompleted: "215 12% 48%",
        mapRouteException: "0 78% 58%",
        mapLocationLive: "142 58% 48%",
        mapLocationReported: "20 75% 58%",
        mapLocationEstimated: "292 70% 68%",
        mapLocationStale: "215 10% 48%",
        mapOverlayScrim: "hsl(258 45% 4% / 0.6)",
      },
      surfaces: {
        operations: {
          tokens: {
            background: "255 36% 96.5%",
            border: "255 24% 80%",
            input: "255 24% 80%",
          },
          darkTokens: {
            border: "257 22% 25%",
            input: "257 22% 25%",
          },
        },
        customer: {
          tokens: {
            radius: "0.5rem",
            background: "255 48% 98.5%",
            border: "255 26% 87%",
            input: "255 26% 87%",
          },
          darkTokens: {
            background: "258 30% 10%",
            card: "258 26% 13%",
            border: "257 20% 19%",
            input: "257 20% 19%",
          },
        },
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

describe("darkColorRamp", () => {
  it("preserves hue/saturation and walks lightness upward (reversed dark semantics)", () => {
    const ramp = darkColorRamp("#7C3AED");
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
    let previousLightness = 0;
    for (const shade of shades) {
      const match = /^(\S+) (\S+)% (\S+)%$/.exec(ramp[shade]);
      expect(match, `ramp ${shade} is a channel triple`).toBeTruthy();
      if (!match) {
        continue;
      }
      expect(match[1]).toBe("262.1");
      expect(match[2]).toBe("83.3");
      const lightness = Number(match[3]);
      expect(lightness).toBeGreaterThan(previousLightness);
      previousLightness = lightness;
    }
    // 100 must read as a tint on a near-black page, 800 as readable text.
    expect(Number(/(\S+)%$/.exec(ramp[100])?.[1])).toBeLessThan(25);
    expect(Number(/(\S+)%$/.exec(ramp[800])?.[1])).toBeGreaterThan(75);
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

  it("emits surface blocks ordered so dark mode wins its specificity ties", () => {
    const css = brandCss({
      name: "duo",
      primary: "#15467A",
      accent: "#D96830",
      tokens: { background: "210 25% 96%" },
      darkTokens: { background: "213 42% 7%" },
      surfaces: {
        operations: {
          tokens: { border: "211 26% 79%" },
          darkTokens: { border: "213 30% 23%" },
        },
        customer: { tokens: { radius: "0.375rem" } },
      },
    });
    const lightSurface = css.indexOf(
      ':root[data-brand="duo"][data-product-surface="operations"] {',
    );
    const dark = css.indexOf(':root[data-brand="duo"].dark {');
    const darkSurface = css.indexOf(
      ':root[data-brand="duo"][data-product-surface="operations"].dark {',
    );
    // Surface-light (0,3,0) ties with brand-dark (0,3,0): the dark block must
    // come later in the file so dark mode wins by source order; surface-dark
    // (0,4,0) emits last.
    expect(lightSurface).toBeGreaterThan(-1);
    expect(dark).toBeGreaterThan(lightSurface);
    expect(darkSurface).toBeGreaterThan(dark);
    expect(css).toContain(':root[data-brand="duo"][data-product-surface="customer"] {');
    // A surface with no darkTokens emits no empty dark block.
    expect(css).not.toContain('[data-product-surface="customer"].dark');
    // The header names the full recipe, surfaces included.
    expect(css).toContain('surfaces: {"operations"');
  });

  it("rejects surface names that are not camelCase identifiers", () => {
    expect(() =>
      brandCss({
        name: "duo",
        primary: "#15467A",
        accent: "#D96830",
        surfaces: { "back office": { tokens: { border: "0 0% 0%" } } },
      }),
    ).toThrow(/camelCase/);
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
