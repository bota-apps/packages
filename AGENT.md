# AGENT.md

**@bota-apps packages** — the reusable product layer (design system, schema/runtime utilities, app runtime) shared by every application we build. Extracted from the original app monorepo so no single app owns it; apps install these from npm. pnpm workspace + Turborepo, ESM-only tsc builds, changesets → npm with provenance.

This file is the authoritative convention reference for agents and contributors. `CLAUDE.md` points here. Workflow details (setup, changesets, build quirks) live in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Repository layout

| Package                       | What                                                                                                                                               | Depends on                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `@bota-apps/utils`            | Framework-free utility modules (`./type`, `./time`, `./number`).                                                                                   | —                                            |
| `@bota-apps/types`            | Framework-free TypeScript contracts + API-type constraints. Zero runtime.                                                                          | —                                            |
| `@bota-apps/eslint-config`    | Shared flat ESLint config + Prettier + base tsconfig.                                                                                              | —                                            |
| `@bota-apps/tailwind-preset`  | Tailwind preset, PostCSS config, theme CSS variables (light + dark).                                                                               | —                                            |
| `@bota-apps/gql-client`       | Cookie-credentialed GraphQL client.                                                                                                                | —                                            |
| `@bota-apps/gql-codegen`      | Node-side SDL generator: domain definitions, form/detail schemas, enum metadata, Zod input validators, typed documents.                            | types                                        |
| `@bota-apps/translations`     | Shared translation runtime: singleton + TranslationProvider, `createAppTranslations` (app-local bundles → typed hook), `useTranslations`, helpers. | —                                            |
| `@bota-apps/schema-utils`     | Zod runtime behind `types`: currency, form/field validators, domain builders.                                                                      | types                                        |
| `@bota-apps/fm`               | Feature management + error boundary runtime.                                                                                                       | types                                        |
| `@bota-apps/auth-client`      | Cookie-session auth client.                                                                                                                        | types                                        |
| `@bota-apps/react-ui`         | Context-free UI primitives, schema-driven DynamicForm/DynamicDetail, charts.                                                                       | types, schema-utils, tailwind-preset         |
| `@bota-apps/hooks`            | Generic data layer: React Query + GraphQL context + pipelines.                                                                                     | fm, gql-client                               |
| `@bota-apps/react-components` | App-runtime layer: providers, AppShell, pages, routing, nav, feature bridge.                                                                       | react-ui, auth-client, fm, gql-client, hooks |
| `@bota-apps/mocks` (`mocks/`) | In-memory test/story doubles conforming to the real client types.                                                                                  | types                                        |

`apps/storybook` is the live playground (consumes package **source**); `examples/storybook` is a standalone consumer smoke test (installs the **published** package — run with `pnpm install --ignore-workspace`).

**Dependency direction is law:** a package imports only from lower tiers. `react-ui` never imports the data/auth runtime.

---

## Coding standards

- **camelCase identifiers and file names — always.** Variables, functions, exported constants, file names: `export const pageSize = 10`, `dataTable.tsx`. Never `SCREAMING_SNAKE_CASE`, never PascalCase/kebab-case/snake_case file names (React component _identifiers_ are PascalCase as usual). Enforced by `@typescript-eslint/naming-convention` + `unicorn/filename-case` in the shared eslint config.
  - Allowed exceptions (external contracts only): Tailwind's `DEFAULT` color-scale key, ISO 4217 currency codes as object keys (`ETB`, `USD`), GraphQL error-code strings (`BAD_USER_INPUT`), React `displayName` values, acronym component names (`FAB`).
- **No deprecated/back-compat surface.** This is a pre-1.0 fresh library: when an API is superseded, delete the old one in the same change (with a changeset migration note) — never ship `@deprecated` markers.
- **`type` over `interface`** — always, unless declaration merging with an external library makes `interface` a must.
- **Model state as discriminated unions.** When fields are only valid together (`user` exists only when authenticated, `error` only when the request failed), never ship one type with a bag of optionals — split it into named members discriminated by a literal `status`/`kind` field, so narrowing the discriminant narrows the payload. Derive the status union from the state (`type AuthStatus = AuthState["status"]`), don't maintain it by hand. Canonical example: `AuthState` in `packages/auth-client/src/authStore.ts`. Genuinely-independent optional config fields (props, options objects) are not state machines — they stay optional.
- **No fake values — fail fast, trust the contracts.** This is a 100% TypeScript repo: no `any`, no placeholder values invented to satisfy a type, and no defensive re-checking of what a type already guarantees (`status === "authenticated" && Boolean(user)` is a smell — the union says `user` is there). When a contract is violated at a runtime boundary, throw; don't limp on with a default.
- **No force casting** — no `as any` / `as unknown as T` (tests included). Use generics, type guards, `z.infer<>`.
- **Always braces** on `if` — never single-line `if (...) return;`.
- **Prefer `undefined` over `null`** — except API-boundary types with `.nullable()`.
- **Domain schemas are owned by the API.** Packages never define types the API provides (users, organizations, domain entities, audit entries, pagination envelopes, …). They are generic over them and declare only the minimal structural CONSTRAINTS for the fields they actually read (`SessionUser` in `types`); apps register their API-owned types once via declaration merging (`AuthRegister` in `@bota-apps/types/auth`) so every surface is typed app-wide without call-site generics.
- **Packages stay app-agnostic.** No hard-coded service URLs, no baked-in business config. Anything an app might change is a prop or injectable config with a sensible default (see `DocumentPreview.officeViewerUrl`, `createCurrencyFormatter`).
- **English defaults, injectable translations.** No i18n library dependencies — `@bota-apps/translations` is the sole exception: it IS the app-facing translation runtime (it owns the i18next dependency), and no other package may depend on it. User-facing strings default to English and are overridable via label props or an injected `t: (key) => string` (pattern: `packages/schema-utils/src/i18n.ts`).
- **Guard async commits against superseded requests.** Any store or effect that `setState`s after an `await` must check it is still the current resolution (generation counter or AbortController) — otherwise a slow response overwrites the state a newer `refresh()`/`logout()` wrote. Canonical example: `currentGen` in `packages/auth-client/src/authStore.ts`.
- **Cache `Intl` formatter instances.** `Intl.NumberFormat`/`RelativeTimeFormat`/`DateTimeFormat` construction resolves locale data (~10–100× the cost of `.format()`) and formatters run per table cell / chart tick — build them once in a module- or closure-scope `Map` keyed by their options, never per call (see `packages/schema-utils/src/currency.ts`).
- **Tailwind token values must stay parseable.** Preset color values are `hsl(var(--token))` with **no inline fallback** — Tailwind v3 cannot parse `var()` with a space-separated fallback and silently drops opacity-modified utilities (`bg-primary-500/20`). Token defaults live in `theme.css`; `packages/tailwind-preset/preset.test.ts` compile-checks this.
- **Interaction states use `muted` and `selected`, never `accent`.** `accent` is a loud brand-emphasis color that apps rebrand freely — it must never style hover/focus/on states (a shadcn-derived `hover:bg-accent` renders as a saturated brand fill). Transient hover/press surfaces are `bg-muted text-foreground`; persistent on/active states are `bg-selected text-selected-foreground` (soft primary tint tokens in `theme.css`, derived from the primary ramp so brands inherit them). Focus/hover recipes come from `packages/react-ui/src/html/interaction.ts` (`focusRingClasses`, `formControlInteractionClasses`) — compose those fragments, don't hand-roll rings.
- **Responsiveness is container-scoped, not viewport-scoped.** No component may assume it owns the viewport: internal layout switches (grid columns, label visibility) use container queries — the component renders its own `@container` wrapper and styles descendants with `@xl:`/`@2xl:`… variants (plugin ships in the preset). Canonical examples: `FormGrid`, `Stepper`, `QuickLinkGrid`, the DataTable card grid. Viewport breakpoints (`md:`, `lg:`) are reserved for app-shell chrome that genuinely tracks the device (sidebar collapse, FAB visibility). Remember container queries match an _ancestor_ container — the `@container` class goes on a wrapper, never on the element carrying the `@…:` variants.
- **Merging caller options with defaults is per-key, not spread.** `{ ...defaults, ...options }` lets an explicitly-`undefined` key clobber the default (optional translators produce exactly that shape); merge with `options.x ?? defaults.x` per key.

---

## Component module structure (react-ui, react-components)

Every visual component is a directory — component, variants, story, and test colocated:

```
packages/react-ui/src/button/
├── index.tsx           # the component — the module's ONLY public surface
├── variants.ts         # cva variants (or re-exports from ../html)
├── button.stories.tsx  # component-named, never index-named
└── button.test.tsx     # at minimum a render + assertion smoke test
```

Rules:

- **`index.tsx` is the main component**, not a sibling `button.tsx`. The directory name is the component name. No separate `index.ts` barrel next to `index.tsx` — having both is forbidden. Re-exports happen from `index.tsx`.
- **`variants.ts` always exists** — every component exposes a `<name>Variants` cva that consumers can call, even single-style components (base cva with no options). `index.tsx` re-exports it (`export * from "./variants";`) so variants reach the package barrel. Sole exemption: pure-composition modules that render no styled markup of their own (currently `collapsible`, `dynamicDetail`, `dynamicForm`) — there are no styles to expose.
- **The `html/` layer is the styling source of truth.** Raw HTML tags and the foundational cva definitions live in `packages/react-ui/src/html/`. When a component's styling comes from there, its `variants.ts` _re-exports_ (`export { buttonVariants } from "../html/button";`) — never duplicate or invert the layering. Only `html/` may render raw tags with inline Tailwind.
- **Sibling files are private by default** (types.ts, helpers, subcomponents). Export from `index.tsx` only what external callers need — widening the public surface must be a conscious edit to `index.tsx`.
- **Consumers style via variants, never `className` overrides.** If a variant is missing, add it to the component; also export `VariantProps`-derived unions (`BadgeVariant`) so apps can build typed status→variant maps.
- Multi-component utility modules (`charts/` as the published `./charts` subpath, `print/`, `html/`) keep an `index.ts` barrel; `lib/` holds non-component hooks/utils as flat files with colocated tests.
- The package barrel (`src/index.ts`) uses `export * from "./button"` — a component move into a directory never changes barrel specifiers.

**Wrap Radix, don't hand-roll.** Interactive primitives (dialogs, menus, popovers …) must wrap the corresponding `@radix-ui/*` package — that's where focus management, aria wiring, and keyboard behavior come from. A from-scratch reimplementation will be rejected.

---

## Testing & stories

- Every component directory ships `<name>.test.tsx` (render + key assertion at minimum; richer for behavior-heavy components) and `<name>.stories.tsx` (hosted by `apps/storybook`, verified in CI by the Storybook test-runner).
- Every behavior fix ships with a test in the same change.
- Vitest + jsdom + @testing-library; explicit vitest imports (no globals). The shared root `vitest.setup.ts` (registered via `test.setupFiles`) installs the jsdom polyfills (`ResizeObserver`, `matchMedia`, `scrollIntoView`, pointer capture) and Testing Library auto-cleanup once for every package's tests — add a per-test override (e.g. `vi.stubGlobal`) only when a test needs different behavior.

## Workflow

- **Changesets:** every user-visible change needs one (`pnpm changeset`). On 0.x, breaking changes release as `minor` with explicit migration notes. Migration notes enumerate **every** removed or renamed export (grep the old module's `export`s — types and context/hook surfaces included, not just the headline component) and name the replacement for each.
- **New published entrypoints need a size budget:** `scripts/checkSizeLimitCoverage.mjs` (run in CI) fails when a `package.json` exports subpath resolving into `dist/` has no `.size-limit.json` entry — add one, calibrated snugly against the measured size (`pnpm size`).
- **Build quirk:** packages compile with `moduleResolution: Bundler`; `scripts/fixExtensions.mjs` rewrites extensionless imports in `dist/` (handles directory imports → `/index.js`). See CONTRIBUTING.md.
- **CI gates:** build → typecheck → lint → test → Storybook build + test-runner → size-limit budgets → publint + arethetypeswrong. All must stay green.
- **Commits:** conventional messages. **No AI attribution trailers (no `Co-Authored-By: Claude …`)** — Bota Apps is the sole contributor on this repo.
