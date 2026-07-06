# @bota-apps

A pnpm-workspace monorepo of the publishable `@bota-apps/*` packages — a shared
**design system**, schema/runtime utilities, and an app-runtime layer that any
React + Tailwind application can install from npm instead of copying as
boilerplate.

**Live component gallery:** [bota-apps.github.io/packages](https://bota-apps.github.io/packages/)
(Storybook — every component with its source, in light and dark themes).

## Design philosophy

The UI layer is built on three rules that keep the components reusable across any
app without forking:

- **Variant-based, not override-based.** Every component's appearance is a set of
  named [`cva`](https://cva.style) variants it exposes (`buttonVariants`,
  `badgeVariants`, …). Consumers **pick a variant** (`<Badge variant="success">`),
  they don't reach in with `className` to restyle it. If a look is missing, it's
  added to the component as a new variant — so the design system stays the single
  source of truth and every app renders the same vocabulary.
- **No styling at the call site.** Raw HTML tags and their Tailwind classes live
  only in the foundational `html/` layer; tokens (colors, radii, spacing) live in
  the Tailwind preset as CSS variables. Nothing above that layer hand-writes
  styles, so a consuming app rebrands by overriding **tokens**, not by patching
  components.
- **Context-free primitives.** `@bota-apps/react-ui` components take no app
  context — no data fetching, no auth, no router. They're pure inputs → markup,
  so you can drop them into any React + Tailwind project. App wiring (providers,
  routing, data) is layered separately in `@bota-apps/react-components` for teams
  that want the full runtime.

Higher-level pieces build on the same idea: `DynamicForm` / `DynamicDetail` render
from a **schema** rather than bespoke markup, and interactive primitives wrap
[Radix](https://www.radix-ui.com) so focus, keyboard, and ARIA behavior come from
a battle-tested base.

## Packages

| Package                                                    | What                                                                                                                                                        | Depends on                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`@bota-apps/utils`](packages/utils)                       | Framework-free utility modules: `./type`, `./time`, `./number` subpaths.                                                                                    | —                                            |
| [`@bota-apps/types`](packages/types)                       | Framework-free TypeScript contracts (form/detail/domain types, Money, fm boundary types, config + API-type constraints). Zero runtime.                      | —                                            |
| [`@bota-apps/eslint-config`](packages/eslint-config)       | Shared flat ESLint config + Prettier + base tsconfig.                                                                                                       | —                                            |
| [`@bota-apps/tailwind-preset`](packages/tailwind-preset)   | Tailwind preset, PostCSS config, theme CSS variables (light + dark).                                                                                        | —                                            |
| [`@bota-apps/gql-client`](packages/gql-client)             | Cookie-credentialed `createGraphQLClient(endpoint)`.                                                                                                        | —                                            |
| [`@bota-apps/schema-utils`](packages/schema-utils)         | The Zod runtime behind `types`: currency, dynamic form/field validators, domain builders, config; `./i18n` subpath.                                         | types                                        |
| [`@bota-apps/fm`](packages/fm)                             | Feature management + error boundary runtime.                                                                                                                | types                                        |
| [`@bota-apps/translations`](packages/translations)         | Shared translation runtime: singleton + `TranslationProvider`, `createAppTranslations` (app-local locale bundles → typed hook), `useTranslations`, helpers. | —                                            |
| [`@bota-apps/auth-client`](packages/auth-client)           | `createAuthClient({ authUrl }) → AuthClient` (cookie session).                                                                                              | types                                        |
| [`@bota-apps/react-ui`](packages/react-ui)                 | Context-free React UI primitives, schema-driven DynamicForm/DynamicDetail, charts.                                                                          | types, schema-utils, tailwind-preset         |
| [`@bota-apps/hooks`](packages/hooks)                       | Generic data layer: React Query client + GraphQL context + query/mutation pipelines.                                                                        | fm, gql-client                               |
| [`@bota-apps/react-components`](packages/react-components) | App-runtime layer: providers, AppShell, page containers, routing, feature-tree nav, feature bridge, audit log.                                              | react-ui, auth-client, fm, gql-client, hooks |
| [`@bota-apps/mocks`](mocks)                                | In-memory test/story doubles conforming to the real client types (`createMockAuthClient`).                                                                  | types                                        |

The dependency graph is acyclic; `turbo run build` builds in topological order.

## Develop

```bash
pnpm install
pnpm build       # turbo: tsc + ESM extension fixups, in dependency order
pnpm typecheck
pnpm lint
pnpm test
```

Each package builds with `tsc` to `dist/` (unbundled ESM, file-per-module — good
for tree-shaking and Tailwind `content` scanning) and a small `fixExtensions`
pass that adds explicit `.js` extensions so Node ESM / `nodenext` consumers
resolve correctly. The root `tsconfig.json` maps each package to its `src/` for
live cross-package navigation; published packages always resolve via `dist/`.

## Releasing

Versioning and publishing are managed by [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset            # record a change + semver bump
```

On merge to `main`, `.github/workflows/release.yml` opens (or updates) a
**Version Packages** PR; merging it runs `changeset publish` to the public npm
registry. Internal `workspace:*` deps are rewritten to real versions at publish.

## Example consumer

[`examples/storybook`](examples/storybook) installs the **published**
`@bota-apps/react-ui` from npm (not the workspace copy) and renders its
components — a real-consumer smoke test. Run it standalone:

```bash
cd examples/storybook && pnpm install --ignore-workspace && pnpm storybook
```

(`--ignore-workspace` keeps pnpm from resolving the repo workspace — the
example must install from npm, not link local packages.)
