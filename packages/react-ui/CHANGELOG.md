# @bota-apps/react-ui

## 0.5.1

### Patch Changes

- 7b64e3c: Add layout/display variants so consumers can drop remaining raw-`className` escape hatches:

  - **Avatar**: `size` (`sm`/`md`/`lg`/`xl`) on `Avatar` and `AvatarFallback` — root sizes the circle, fallback tracks the initials size. Defaults to `md` (unchanged from today).
  - **Card**: `fill` — stretches the card to its parent's width and height (grid/flex cells, e.g. org-chart nodes).
  - **Inline**: row chrome for list/selectable rows — `paddingX`, `paddingY`, `borderBottom`, `background` (`muted`), and `indent` (nested rows; combines with `paddingX`, deeper `pl-*` wins the left side).
  - **Stack**: `width` (fixed-width leading column, `xs`–`xl`) and `shrink` (`"0"`) — pair them for a labeled row's fixed column; the flexible column already uses `grow`.
  - **Text**: `mono` and `tabular` booleans — monospace face and tabular figures for aligned numeric ranges.

  All additive and optional; no existing API changes.

## 0.5.0

### Minor Changes

- 0671cc2: `PhoneDisplay` is now country-agnostic — no built-in locale. The number is shown as given unless you supply formatting props.

  Migration:

  - Removed the `variant` prop and the `PhoneDisplayVariant` type (`"ethiopian" | "international"`), along with the hard-coded `+251` normalization/grouping.
  - Added `countryCode?: string` (calling code applied to national-form input, dropping a leading trunk `0`) and `groups?: number[]` (segment lengths for the national part).
  - To reproduce the previous Ethiopian default, pass `countryCode="251"` with `groups={[3, 2, 2, 2]}`; for the old `"international"` layout use `groups={[3, 3, 3]}`.

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
  - @bota-apps/schema-utils@0.9.1
  - @bota-apps/tailwind-preset@0.5.1
  - @bota-apps/types@0.10.1
  - @bota-apps/utils@0.3.1

## 0.4.3

### Patch Changes

- Updated dependencies [233fc86]
- Updated dependencies [233fc86]
  - @bota-apps/schema-utils@0.9.0
  - @bota-apps/types@0.10.0

## 0.4.2

### Patch Changes

- 6cfe6e1: Add the generic `ListItem` row (`left`/`title`/`description`/`extra`/`right`/`showArrow`, optional `onClick`) — the base row domain apps compose their `*Item` wrappers on. Patch (additive, stays in the `^0.x` range dependents pin).
- Updated dependencies [6cfe6e1]
- Updated dependencies [11a8bb6]
  - @bota-apps/schema-utils@0.8.0

## 0.4.0

### Minor Changes

- a7c25fd: Export the `fmtDate` and `fmtDateRange` display formatters from the dateTime module, so apps can compose the exact strings `<DateTime>` renders (tooltips, labels) without duplicating the format.

### Patch Changes

- Updated dependencies [a7c25fd]
- Updated dependencies [a7c25fd]
  - @bota-apps/schema-utils@0.5.0
  - @bota-apps/types@0.8.0

## 0.3.7

### Patch Changes

- Updated dependencies [f5de1e2]
  - @bota-apps/types@0.7.0
  - @bota-apps/schema-utils@0.4.3

## 0.3.6

### Patch Changes

- Updated dependencies [1966215]
  - @bota-apps/utils@0.2.0

## 0.3.5

### Patch Changes

- Updated dependencies [2e4156b]
  - @bota-apps/types@0.6.0
  - @bota-apps/schema-utils@0.4.2

## 0.3.4

### Patch Changes

- Updated dependencies [0f2e0a9]
  - @bota-apps/tailwind-preset@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [53f7f72]
  - @bota-apps/tailwind-preset@0.4.0

## 0.3.2

### Patch Changes

- Updated dependencies [1e354d6]
  - @bota-apps/types@0.5.0
  - @bota-apps/schema-utils@0.4.1

## 0.3.1

### Patch Changes

- fd42c7e: Platform foundations: API-owned user schema (generic auth), feature-gating collectors, a utils package, and a mocks package (breaking on 0.x — released as minor per repo policy).

  **Design rule codified: domain schemas are owned by the API.** Packages never define types the API provides (users, organizations, audit entries, pagination envelopes); they are generic over them and declare only the minimal structural constraints they rely on.

  **New: `@bota-apps/utils`** — framework-free utility modules, one subpath per concern:

  - `./type` — the `Equal`/`Expect` type-assertion helpers (moved from the removed `@bota-apps/types/testing` subpath).
  - `./time` — the date formatting presets (moved from the removed `@bota-apps/schema-utils/dates` subpath; same function names).
  - `./number` — `formatNumber` (moved from the schema-utils main entry).

  **New: `@bota-apps/mocks`** — in-memory doubles for tests/stories, organized by module (`src/auth/…`), depending only on `@bota-apps/types` (shapes, no runtime packages). `createMockAuthClient` returns the REAL `AuthClient` type (no extra test-only surface), starts from a `user` or full `state`, and simulates organization switching through an app-provided `resolveSwitch(organizationId, user)` mapping — the mock doesn't presume any user schema.

  **types**

  - **BREAKING:** `User`/`UserRole` removed — the user type is API-owned.
  - New `./auth` subpath — the auth contract SHAPES, mirroring the fm shape/runtime split: `SessionUser` (the minimal constraint the runtime expects on the session user: `id`, `name`, `email`), `AuthRegister`/`RegisteredAuthUser`, `AuthState` and its members, `AuthStore`, `AuthClient`, `SessionEndpoint`, `SessionPaths`. Shape-only consumers (e.g. mocks) depend on `types` alone.
  - **BREAKING:** the `./testing` subpath is removed — import `Equal`/`Expect` from `@bota-apps/utils/type`.

  **auth-client**

  - The whole surface is now generic over the app's API-owned user type: `AuthState<TUser>`, `AuthStore<TUser>`, `SessionEndpoint<TUser>`, `AuthClient<TUser>`, `createAuthClient<TUser>` (all constrained to `SessionUser`). The shapes live in `@bota-apps/types/auth` (re-exported here for convenience); the package keeps only the runtime. Register the app's user type once via declaration merging — `declare module "@bota-apps/types/auth" { interface AuthRegister { user: ApiUser } }` — and every surface (including `useAuth`) is typed with it app-wide, no generics at call sites.
  - **BREAKING:** `SessionPaths` gains a required `switchOrganization` path (default `/bff/switch-organization`). `AuthStore`/`AuthClient`/`useAuth` gain `switchOrganization(organizationId)` — re-targets the session on the host/BFF, then re-resolves the user (superseding any in-flight resolution; a failed switch leaves the current state untouched). Organization data itself lives on the app's registered user type.

  **schema-utils**

  - **BREAKING:** the `./dates` subpath moved to `@bota-apps/utils/time`, and `formatNumber` moved to `@bota-apps/utils/number` (same names).

  **fm**

  - Gating collectors land (the resolver's "phase 5"): `flagCollector`, `permissionCollector` (hide — don't advertise), `planCollector`, `limitCollector`, `setupCollector` (block — advertise but gate). Generic collectors only — app-specific policies (billing, compliance, region, …) are app-defined `FeatureCollector`s passed via `FeatureProvider`'s new `collectors` prop. Gated nodes fail closed against the app-provided `FeatureGateContext` (`context` prop).
  - `FeatureNodeDef` gains declarative gating keys (`flag`, `planFeature`, `limit`, `setup` — alongside the existing `permissions`); new shapes `FeatureGateContext`, `FeatureCollector`, `CollectorVerdict`, `ResolvedFeatureNode`.
  - New hooks `useFeature`, `useFeatureStatus`, `useFeatureChildren`, `useFeatureTree`, and the unstyled `FeatureGate` component (`whenBlocked`/`whenHidden` render slots). `useFeatureScope` is gating-aware, with ancestor verdicts cascaded in (a page inside a hidden module is hidden).
  - New tree utilities: `resolveFeaturePath`, `resolveFeatureTree`, `composeFeatureTree`; `FeatureRegistry` gains `getPath` and now **throws on duplicate feature ids** instead of silently overwriting.

  **hooks**

  - New `usePaginatedQueryPipeline` — a query pipeline for paginated lists that keeps the previous page's data as placeholder while the next page loads.

  **react-ui**

  - Internal: date formatting now comes from `@bota-apps/utils/time` (no API change).

- Updated dependencies [fd42c7e]
  - @bota-apps/utils@0.1.0
  - @bota-apps/types@0.4.0
  - @bota-apps/schema-utils@0.4.0

## 0.3.0

### Minor Changes

- 8547b92: Per-component module structure and a complete variants surface.

  Every visual component now lives in its own directory (`index.tsx` + `variants.ts` + colocated story and test) and **exposes its cva variants publicly**: consumers can import `<name>Variants` (e.g. `dialogContentVariants`, `selectTriggerVariants`, `statCardVariants`, `navItemVariants`) from the package barrel, plus `VariantProps`-derived unions where useful. Existing exported names (`buttonVariants`, `badgeVariants`, `toggleVariants`, `sidebarMenuButtonVariants`, `navigationMenuTriggerStyle`, …) are unchanged.

  Also:

  - New `@bota-apps/react-ui/form` subpath export — the react-hook-form integration was documented as deep-importable but never declared in `exports`; published consumers can now actually resolve it.
  - `LoadingBusiness` is now exported under its own name (it previously shadowed `Loading` internally).
  - Import specifiers are unchanged — the package barrels re-export the same names from the same entry points; no consumer action needed beyond the removals listed in the fresh-library-cleanup changeset.

- 945096b: Discriminated-union state contracts (breaking on 0.x — released as minor per repo policy).

  **auth-client**

  `AuthState` is now a discriminated union on `status` instead of a single type with optional fields. Narrowing the status narrows the payload: `user` is a `User` (never `undefined`) exactly when `status === "authenticated"`, and `error` is a required `Error` that exists exactly when `status === "error"`. The members are exported by name — `AuthPendingState`, `AuthenticatedState`, `UnauthenticatedState`, `AuthErrorState` — and `AuthStatus` is now derived (`AuthState["status"]`, same union as before).

  Migration: code that read `state.error` without checking `status` must narrow first (`if (state.status === "error") { state.error }`); code constructing an `AuthState` literal must match one member exactly (e.g. an authenticated state can no longer omit `user`).

  **react-ui**

  `useCopyToClipboard` reports `error` as `Error | undefined` instead of `Error | null` (repo-wide prefer-`undefined` rule). Replace `error === null` checks with `error === undefined` (or just truthiness).

- 8547b92: Remove all deprecated/back-compat API (breaking on 0.x — released as minor per repo policy).

  **react-ui**

  - `DashShell` removed — compose `SidebarProvider + Sidebar + SidebarInset` instead. Its context surface (`DashShellContext`, `useDashShellContext`, `FIXED_LAYOUT`) is removed with it and has no replacement: the sidebar layout no longer needs a fixed-layout marker, so drop those calls.
  - `useIsMobile` removed — use `useBreakpoint().below("md")`.
  - `Text`'s deprecated `format` prop removed — use `<DateTime variant="…" value={…} />`. The `TextFormat` type is removed with it (use `DateTimeVariant`), and the `fmtDate`/`fmtTime`/`fmtDateRange` helpers are now private to the `dateTime` module — for standalone date formatting use `@bota-apps/schema-utils`' `formatDate`/`formatDateShort`.
  - Legacy `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` compat primitives removed — use the props-driven `Card` API (`title`, `description`, `footer`, `children`).
  - The raw `CardContentEl`/`CardSectionEl`/`CardFooterEl` html-layer primitives are removed with them — compose `CardEl` with your own layout, or use the `Card` API.

  **types / schema-utils**

  - `labelAm` removed from `CurrencyInfo`/`CurrencyDefinition` and the currency registry — resolve localized labels via `getCurrencyLabel(code, t)` / `formatter.getLabel(code, t)`.

  **auth-client**

  - `DEFAULT_SESSION_PATHS` renamed to `defaultSessionPaths` (repo-wide camelCase-constants rule).

- 5237cf9: `DocumentPreview` no longer hard-wires Microsoft's Office Online viewer. A new `officeViewerUrl` prop controls how office documents (docx/xlsx/pptx) are embedded: pass a function to use a self-hosted viewer, `null` to disable office previews for privacy-sensitive documents (they fall back to the unsupported state with working download/open actions), or omit it to keep the current Microsoft viewer default. The `labels` overrides now also apply to the unsupported-state Download/Open buttons, which previously bypassed them.
- 76d5c75: Package manifest hygiene sweep.

  - **BREAKING (react-ui):** the `react`/`react-dom` peer range narrows from `^18 || ^19` to `^19.0.0`, matching every other package in the family — the packages are developed and tested against React 19 only. Stay on an older react-ui release if your app is still on React 18.
  - Internal `@bota-apps/*` dependencies now use `workspace:^` (rewritten to real versions at publish) so local builds can never resolve a stale published copy.
  - Pure packages declare `"sideEffects": false` for better tree-shaking.
  - Every package declares `"engines": { "node": ">=20" }`.

- 3659ce3: Rebuild `Dialog` on `@radix-ui/react-dialog` (matching `AlertDialog`/`Sheet`), replacing the hand-rolled implementation.

  Fixes shipped accessibility defects: the dialog now has proper `role="dialog"` semantics with `aria-labelledby`/`aria-describedby` wired to `DialogTitle`/`DialogDescription`, a focus trap with initial focus and focus restoration on close, body scroll lock, working enter/exit animations, and outside content hidden from assistive tech while open. Also fixes `DialogTrigger asChild` silently dropping caller props, and adds a `closeLabel` prop on `DialogContent` and `SheetContent` to localize the sr-only close-button label.

  Migration notes:

  - The export list is unchanged; existing `open`/`defaultOpen`/`onOpenChange` usage works as before.
  - Include a `DialogTitle` in every `DialogContent` (wrap in the `VisuallyHidden` component if the design has no visible title) — Radix warns in dev when it is missing.
  - `DialogContent` now traps focus and locks body scroll while open; interactions that relied on focusing content behind the dialog must move inside it.

### Patch Changes

- 959f6a4: Fix Node16 ESM type resolution for the main entrypoint: tsc synthesizes `import("..")` in a few emitted d.ts files (`alert`, `passwordInput`), and the extension-fixing build step skipped bare `"."`/`".."` specifiers — Node16 consumers hit an internal resolution error. They are now rewritten to `"../index.js"`, and every package build cleans `dist/` first so renamed or deleted sources can no longer leave stale files in the published tarball.
- 55d906b: Fix correctness gaps in form validation and the small utility hooks.

  - **`buildFormZodSchema` / `DynamicForm`**: a required number/currency field no longer accepts empty input — previously `z.coerce.number()` turned `""` into `0`, so an untouched required amount field silently submitted `0`. Empty input now fails with the required message, and `buildDefaultValues` starts required numbers empty instead of at `0`. If an app relied on empty-means-zero, pass `defaultValue: 0` on that field. Validation messages are now overridable for translation via `buildFormZodSchema(fields, { messages })` or the new `validationMessages` prop on `DynamicForm`; empty required fields report "required" before format errors like "invalid email".
  - **`useCopyToClipboard`**: clears its reset timer on unmount, no longer produces an unhandled rejection when clipboard permission is denied (returns `false` and exposes a new `error` field instead), and falls back to `document.execCommand("copy")` in insecure contexts.
  - **`formatRelativeTime`**: rebuilt on `Intl.RelativeTimeFormat` — same "5m ago" shape in English below a week, now with a `locale`/`style` option for localization. **Shape change:** durations of 7 days or more roll up to weeks/months/years ("1w ago", "1mo ago", "1y ago") where the old implementation rendered unbounded day counts ("45d ago"). Invalid dates return `""` instead of "NaNd ago", and future timestamps format as "in 5m" instead of clamping to "0m ago".
  - **`usePrint`**: `isPrinting` no longer sticks `true` forever in browsers that never fire `afterprint` (Safari, canceled dialogs) — the hook settles on window refocus or after a bounded fallback timeout, and the print iframe is torn down on the next print call instead of the moment the promise settles, so a still-open dialog can't spool a blank document.

- 2d71b67: Fix publish-surface issues surfaced by `arethetypeswrong` (now enforced in CI alongside `publint`).

  - **auth-client**: the emitted `d.ts` for `useAuth` contained a synthesized `import("..")` directory specifier that Node16 ESM consumers cannot resolve; `useAuth` now has an explicit `UseAuthResult` return type (also a nicer public type to reference).
  - **tailwind-preset / react-ui**: the `./preset` and `./postcss` subpath exports now ship type declarations — TypeScript `tailwind.config.ts` files get typed imports instead of `any`.

- 1bf0fca: Review fixes across the packages.

  **tailwind-preset**

  - Opacity modifiers work on numeric ramp shades again: `bg-primary-500/20` and friends compiled to nothing because Tailwind v3 cannot parse `var()` colors with space-separated fallbacks. The ramp defaults now live as `--primary-50..900` / `--secondary-50..900` / `--accent-50..900` variables in `theme.css` (rebrand by redefining them) and the preset references them without inline fallbacks.

  **schema-utils** (breaking on 0.x — released as minor per repo policy)

  - `createCurrencyFormatter` fails fast instead of limping on fake values: a custom code set now requires its own `currencies` registry (enforced by overloads), and formatting or labelling a code missing from the registry throws instead of rendering placeholder metadata.
  - Non-ISO custom codes (`USDT`, anything not three letters) no longer crash `Intl.NumberFormat` — they render symbol-prefixed.
  - `Intl.NumberFormat` instances are cached per locale/options, so per-cell `CurrencyText` rendering stops re-resolving locale data on every call.
  - `CurrencyDefinition` is now derived from `CurrencyInfo` (same shape, open `code`).

  **auth-client**

  - Fixed three auth-state races: a superseded in-flight session resolution can no longer overwrite the state written by a newer `refresh()`, a slow `getUser()` response can no longer re-authenticate the store after `logout()`, and a stale failure no longer clears a newer refresh's cached resolution.
  - `UseAuthResult` (the return type of `useAuth`) is exported from the package barrel.

  **react-ui**

  - The chart cva variants (`barChartVariants`, `lineChartVariants`, `areaChartVariants`, `pieChartVariants`) are now actually reachable from `@bota-apps/react-ui/charts` and the root barrel.
  - `DynamicForm` no longer crashes when a validation message key is passed explicitly `undefined` (e.g. from an optional translator) — it falls back to the English default per key.
  - `formatRelativeTime` caches its `Intl.RelativeTimeFormat` instances.

  **react-components**

  - `ThemeProvider` memoizes its context value, so `useTheme` consumers stop re-rendering on unrelated parent re-renders.

- Updated dependencies [c4f1875]
- Updated dependencies [8547b92]
- Updated dependencies [76d5c75]
- Updated dependencies [2d71b67]
- Updated dependencies [1bf0fca]
- Updated dependencies [1d4c8c0]
  - @bota-apps/schema-utils@0.3.0
  - @bota-apps/types@0.3.0
  - @bota-apps/tailwind-preset@0.3.0
