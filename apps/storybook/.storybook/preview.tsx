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
      // Show the story's actual JSX in the Source / "Show code" block.
      source: { type: "dynamic", language: "tsx" },
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
