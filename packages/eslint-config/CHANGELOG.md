# @bota-apps/eslint-config

## 0.3.0

### Minor Changes

- 8547b92: Enforce camelCase identifiers via `@typescript-eslint/naming-convention`: variables and functions must be camelCase/PascalCase — `SCREAMING_SNAKE_CASE` constants are now errors. Object properties are exempt, so external contracts (Tailwind's `DEFAULT` scale key, ISO currency codes, GraphQL error-code strings) remain legal.

### Patch Changes

- 128cf62: Ignore `storybook-static/` build output in the shared ESLint config.
- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.
