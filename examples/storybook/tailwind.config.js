import botaPreset from "@bota-apps/react-ui/preset";

/**
 * Consumer Tailwind config — exactly as documented in the package README.
 * The preset carries the design tokens; the content globs must include the
 * package's compiled dist so Tailwind generates the utility classes the
 * components reference.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [botaPreset],
  content: [
    "./.storybook/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@bota-apps/react-ui/dist/**/*.js",
  ],
};
