# @bota-apps/translations

## 0.3.5

### Patch Changes

- Updated dependencies [ed5439e]
  - @bota-apps/types@0.11.0
  - @bota-apps/schema-utils@0.9.4

## 0.3.4

### Patch Changes

- 38fd879: Documentation and sample-data wording cleanup (JSDoc, changelog entries, test fixtures). No runtime or API changes.
- Updated dependencies [38fd879]
  - @bota-apps/types@0.10.3
  - @bota-apps/schema-utils@0.9.2

## 0.3.3

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
  - @bota-apps/schema-utils@0.9.1
  - @bota-apps/types@0.10.1

## 0.3.2

### Patch Changes

- Updated dependencies [233fc86]
- Updated dependencies [233fc86]
  - @bota-apps/schema-utils@0.9.0
  - @bota-apps/types@0.10.0

## 0.3.1

### Patch Changes

- Updated dependencies [6cfe6e1]
- Updated dependencies [11a8bb6]
  - @bota-apps/schema-utils@0.8.0

## 0.1.0

### Minor Changes

- 4e70aa9: New package: shared translation runtime extracted from the legacy shared translation runtime
  core. The name is engine-neutral (it currently wraps i18next + react-i18next, but
  consumers never depend on those directly). Ships the preconfigured process-wide
  singleton (browser language detection, `en` fallback, locale persisted under
  `bota:locale`), `TranslationProvider`, and `createAppTranslations({ resources, initOptions? })`
  — the factory apps call with their app-local locale bundles to register namespaces
  on the singleton and get back a namespace-typed `useAppTranslations` hook (the
  first caller initializes the instance; later callers, e.g. embedded extensions,
  only add bundles). Also exports `useTranslations` (lower-level namespace hook),
  `changeLanguage` / `getLanguage` (imperative, engine-agnostic), `translateEnum`,
  `ScopedTranslatorProvider` / `useScopedTranslator` (scoped translator context),
  `getServerTranslation` / `serverI18n`, `defaultInitOptions`, and the
  `SupportedLanguage`, `ToStringLeaves`, `TFunction`, `Namespace`, `LocaleResources`,
  `AppTranslationsConfig` types (the last four re-exported so consumers never import
  `i18next`). The i18next `CustomTypeOptions` augmentation ships with the package.
  Note for migrators: the locale localStorage key is now `bota:locale` (renamed from the legacy key).
