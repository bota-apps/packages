import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const require = createRequire(import.meta.url);
const configDir = dirname(fileURLToPath(import.meta.url));

/** Resolve an addon/framework to its real path (works with pnpm's strict linking). */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  // Stories live next to the components they document.
  stories: ["../../../packages/*/src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite") as "@storybook/react-vite",
    options: {},
  },
  typescript: {
    // The default `react-docgen` parses files in isolation, so it cannot
    // resolve computed prop types — and almost every component here types its
    // props as `VariantProps<typeof xVariants>` (cva). That left the Controls
    // panel and autodocs prop tables empty across the board. The
    // type-checker-backed docgen resolves those unions into real
    // radio/select controls.
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // Docgen only documents files inside its TS program, and the app
      // tsconfig deliberately includes just stories — point docgen at a
      // program that spans the package sources.
      tsconfigPath: join(configDir, "../tsconfig.docgen.json"),
      // The plugin's default include ("**/**.tsx") is resolved against the
      // build cwd (this app), so component sources up in packages/*/src never
      // match — pass an absolute glob. Stories stay excluded (plugin default).
      include: [join(configDir, "../../../packages/*/src/**/*.tsx")],
      // Turn `variant?: "default" | "outline" | …` unions into enumerated
      // control options instead of a free-text box.
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Without this filter every component inherits the full HTML attribute
      // surface (300+ props from React.ButtonHTMLAttributes etc.), burying
      // the props that matter. Keep only props declared in our own source.
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
