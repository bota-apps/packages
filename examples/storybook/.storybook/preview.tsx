import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

// Pulls in the package's theme.css (CSS variables + @tailwind layers) the same
// way a real consumer wires it up. See ../src/styles.css.
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
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
