// postcss-import inlines the `@import "@bota-apps/react-ui/theme.css"` (which
// lives in node_modules) before Tailwind runs, so the package's @tailwind
// directives and CSS variables are processed together.
export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
