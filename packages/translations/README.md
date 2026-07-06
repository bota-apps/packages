# @bota-apps/translations

Shared translation runtime for `@bota-apps` apps: a preconfigured process-wide
singleton (`en` fallback, `bota:locale` localStorage persistence, browser
language detection), a `TranslationProvider`, and `createAppTranslations` — the
factory apps use to register their app-local locale bundles and get a
namespace-typed translation hook. Locale bundles themselves stay in the app
(under `src/translations/locales`); this package is only the runtime.

The name is deliberately engine-neutral: it currently wraps i18next, but that is
an implementation detail. Consumers depend on `@bota-apps/translations` alone —
never on `i18next` / `react-i18next` directly — so the engine can change without
touching a single call site. This is the sole package permitted to own the
i18next dependency; no other `@bota-apps` package may depend on it.

## Install

```bash
pnpm add @bota-apps/translations
# peer: react
```

## Usage

Register the app's bundles once at module scope and re-export the typed hook:

```ts
// app: src/translations/index.ts
import { createAppTranslations, TranslationProvider } from "@bota-apps/translations";
import { en } from "./locales/en";
import { am } from "./locales/am";

// The app path already scopes the hook — no need to re-prefix
// (`@tasks/translations` → `useAppTranslations`, not `useTasksAppTranslations`).
export const { useAppTranslations } = createAppTranslations({ resources: { en, am } });
export { TranslationProvider };
```

Mount the provider once at the app root:

```tsx
import { TranslationProvider } from "@tasks/translations";

<TranslationProvider>
  <App />
</TranslationProvider>;
```

Read translations anywhere — the namespace union is typed from the `en` bundle:

```tsx
import { useAppTranslations } from "@tasks/translations";

const { t } = useAppTranslations("common");
```

The first `createAppTranslations` call initializes the singleton (pass
`initOptions` there to replace `defaultInitOptions` wholesale); later calls —
e.g. from embedded extensions — only add their bundles. The i18next
`CustomTypeOptions` augmentation ships with the package, so importing anything
from `@bota-apps/translations` pulls it in — apps do not declare their own.

## API

| Export                                             | What                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `createAppTranslations`                            | Registers app-local locale bundles and returns a namespace-typed `useAppTranslations` hook. |
| `TranslationProvider`                              | Mounts the translation runtime for the React tree.                                          |
| `useTranslations(ns)`                              | Lower-level namespace hook (prefer the typed hook from `createAppTranslations`).            |
| `changeLanguage(lng)` / `getLanguage()`            | Imperative, engine-agnostic language control (switches every mounted surface at once).      |
| `defaultInitOptions`                               | The default init options the singleton boots with.                                          |
| `translateEnum(values, t, prefix)`                 | Enum values → translated `{ value, label }` options, looked up as `${prefix}.${value}`.     |
| `ScopedTranslatorProvider` / `useScopedTranslator` | Share a pre-bound translator through layout layers without prop-drilling.                   |
| `getServerTranslation(lng, ns?)` / `serverI18n`    | SSR / Node-side translation — switches the singleton and returns a bound `t`.               |

Types re-exported so consumers never import `i18next` directly:
`SupportedLanguage`, `ToStringLeaves`, `TFunction`, `Namespace`.

## Subpaths

| Import                             | What                                                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/translations`          | The React runtime: provider, `createAppTranslations`, hooks, translator, enum/server helpers.                                     |
| `@bota-apps/translations/coverage` | React-free coverage utilities (`flattenBundleKeys`, `findMissingKeys`, `expectedKeysFromSchemas`) — compare bundles in a test.    |
| `@bota-apps/translations/testing`  | Drive the pure localize transforms against a nested bundle (`bundleLocalizeContext`, `resolveBundleKey`) without booting i18next. |
| `@bota-apps/translations/review`   | Node-only translation-review worksheet generator (`runTranslationReview`, `TranslationReviewError`).                              |
| `bota-translation-review` (bin)    | CLI wrapper over the `review` module for generating/approving/checking review worksheets.                                         |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
