import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/**
 * The shared @bota-apps flat config. Consumers spread it and add their own
 * overrides:
 *
 *   import bota from "@bota-apps/eslint-config";
 *   export default [...bota, { rules: { ... } }];
 *
 * App-only conventions (no className / no raw HTML / no raw fetch in feature
 * code) are intentionally NOT here — they belong to the generated app's own
 * config, scoped to its feature directories.
 */
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      // Storybook build output.
      "**/storybook-static/**",
      "**/routeTree.gen.ts",
      // Codegen output — generated from the domain SDL, not hand-edited.
      "**/src/generated/**",
      // Codegen build scripts (Node ESM tooling, run by `schema:gen`).
      "**/src/codegen/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      unicorn,
    },
    rules: {
      "no-console": "warn",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Let unused-imports own dead-code detection so it can auto-fix imports.
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "@typescript-eslint/no-explicit-any": "error",
      // Works with verbatimModuleSyntax.
      "@typescript-eslint/consistent-type-imports": "error",

      // Keep filenames camelCase/PascalCase so generated code doesn't drift.
      // TanStack route files (__root, _app, $param) and configs are exempt.
      "unicorn/filename-case": [
        "warn",
        {
          cases: { camelCase: true, pascalCase: true },
          ignore: ["^_", "^\\$", "\\.config\\.", "\\.gen\\.", "vite-env\\.d\\.ts$"],
        },
      ],

      // camelCase identifiers only — no SCREAMING_SNAKE_CASE constants
      // (`export const pageSize = 10`, not `PAGE_SIZE`). Object properties are
      // exempt: external contracts like Tailwind's `DEFAULT` scale key and ISO
      // currency codes (`ETB`, `USD`) are property keys, not declarations.
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variableLike",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
      ],
    },
  },
  // Node tooling (build scripts, *.config.* files): give them Node globals so
  // `process`/`console` aren't flagged as undefined.
  {
    files: ["**/*.{mjs,cjs}", "**/scripts/**", "**/*.config.{js,ts,mjs,cjs}"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "writable",
        require: "readonly",
      },
    },
  },
  // Prettier last: turn off formatting rules that would conflict.
  prettier,
);
