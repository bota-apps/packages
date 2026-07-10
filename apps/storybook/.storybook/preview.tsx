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
      // Show each control's description and default (straight from JSDoc +
      // types) in the panel, and surface required props first.
      expanded: true,
      sort: "requiredFirst",
    },
    // Log every `onX` callback in the Actions panel without per-story wiring.
    // (Storybook 9 drops this in favor of explicit `fn()` args — revisit when
    // upgrading; stories that need to *assert* on calls already use `fn()`.)
    actions: { argTypesRegex: "^on[A-Z].*" },
    // Alphabetize the sidebar so placement never depends on story-file
    // discovery order.
    options: {
      storySort: { method: "alphabetical" },
    },
    docs: {
      // Docs pages are long (every story of a component); give them a
      // table of contents.
      toc: true,
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
