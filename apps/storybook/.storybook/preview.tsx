import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

// Theme variables + Tailwind layers, generated from package source.
import "../src/styles.css";

const preview: Preview = {
  // Generate a Docs page for every component (autodocs) so each story renders
  // alongside a "Show code" source snippet — the canvas alone gives no way to
  // view the code behind a story.
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    docs: {
      // "auto": show a story's written source when it has a custom `render`
      // (dynamic serialization would collapse component names to their minified
      // identifiers in the production build — e.g. a RouterProvider-wrapped
      // render becomes `<ko router={[object Object]} />`), and fall back to
      // dynamic JSX (from the component's name in meta) for simple arg stories.
      source: { type: "auto", language: "tsx" },
    },
  },
  // Toolbar toggle that flips the `.dark` class the design tokens key off of,
  // so every story can be checked in light and dark mode.
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
