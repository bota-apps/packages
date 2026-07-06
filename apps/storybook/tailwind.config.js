import botaPreset from "@bota-apps/tailwind-preset/preset";

/**
 * Workspace Storybook Tailwind config. Unlike a real consumer (which globs the
 * package's compiled dist — see examples/storybook), this app builds from
 * package SOURCE so stories hot-reload against uncompiled components.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [botaPreset],
  content: [
    "./.storybook/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/*/src/**/*.{ts,tsx}",
  ],
};
