# @bota-apps/eslint-config

Shared flat ESLint config, Prettier config, and base `tsconfig` for `@bota-apps`
repos and generated apps. It owns its lint plugins, so consumers install **one**
dev dependency and get the same rules everywhere. This package ships plain
`index.js` / `prettier.json` / `tsconfig.json` — there is no build step and no
`dist/`.

## Install

```bash
pnpm add -D @bota-apps/eslint-config eslint
# eslint ^9 is a peer dependency
```

## Usage

The default export is a flat config array — spread it and append your own overrides.

`eslint.config.mjs`:

```js
import bota from "@bota-apps/eslint-config";

export default [
  ...bota,
  {
    rules: {
      // app-specific overrides…
    },
  },
];
```

Base TypeScript config — `tsconfig.json`:

```json
{ "extends": "@bota-apps/eslint-config/tsconfig.json" }
```

Prettier — reference it from `package.json` (or a `.prettierrc`):

```json
{ "prettier": "@bota-apps/eslint-config/prettier" }
```

## What the flat config enables

- **`@eslint/js` + `typescript-eslint` recommended** as the baseline.
- **`react-hooks`** — `rules-of-hooks` (error) and `exhaustive-deps` (warn).
- **`unused-imports`** owns dead-code detection so it can auto-fix imports;
  `no-unused-imports` is an error, unused vars warn (with `^_` ignore patterns).
- **`@typescript-eslint/no-explicit-any`** (error) and
  **`consistent-type-imports`** (works with `verbatimModuleSyntax`).
- **`unicorn/filename-case`** — camelCase / PascalCase filenames (TanStack route
  files, `.config.`, `.gen.`, and `vite-env.d.ts` are exempt).
- **`@typescript-eslint/naming-convention`** — camelCase/PascalCase identifiers,
  no `SCREAMING_SNAKE_CASE` (object property keys are exempt for external
  contracts like ISO currency codes).
- **Node globals** for `*.{mjs,cjs}`, `scripts/**`, and `*.config.*` files.
- **`eslint-config-prettier`** applied last to disable conflicting formatting rules.

App-only conventions (no `className` in feature code, no raw HTML, no raw `fetch`)
are intentionally **not** here — they belong in the generated app's own config,
scoped to its feature directories.

## Subpaths

| Import                                   | What                                                            |
| ---------------------------------------- | --------------------------------------------------------------- |
| `@bota-apps/eslint-config`               | The flat ESLint config array (default export)                   |
| `@bota-apps/eslint-config/prettier`      | Prettier options (`printWidth: 100`, double quotes, semicolons) |
| `@bota-apps/eslint-config/tsconfig.json` | Base compiler options to `extends` from                         |

## The Prettier options

```json
{
  "printWidth": 100,
  "singleQuote": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true
}
```

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
