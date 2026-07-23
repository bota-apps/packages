# @bota-apps/testing

## 0.1.9

### Patch Changes

- Updated dependencies [7ef9f0f]
  - @bota-apps/react-components@0.14.0

## 0.1.8

### Patch Changes

- Updated dependencies [4ed2014]
  - @bota-apps/react-components@0.13.0

## 0.1.7

### Patch Changes

- Updated dependencies [9d18b35]
  - @bota-apps/mocks@0.3.0

## 0.1.6

### Patch Changes

- Updated dependencies [8eb9615]
  - @bota-apps/react-components@0.12.0

## 0.1.5

### Patch Changes

- Updated dependencies [b32b034]
  - @bota-apps/react-components@0.11.0

## 0.1.4

### Patch Changes

- Updated dependencies [d64ff10]
  - @bota-apps/react-components@0.10.0

## 0.1.3

### Patch Changes

- Updated dependencies [3722dd4]
  - @bota-apps/react-components@0.9.0

## 0.1.2

### Patch Changes

- 38fd879: Documentation and sample-data wording cleanup (JSDoc, changelog entries, test fixtures). No runtime or API changes.
- Updated dependencies [38fd879]
  - @bota-apps/types@0.10.3
  - @bota-apps/react-components@0.8.5

## 0.1.0

### Minor Changes

- 2249836: Initial release — the page-level integration-test harness for `@bota-apps` hosts, extracted from the original app monorepo's `testing/` directory. Tests mount the real app (`createAppRoot` stack, the app's own router factory, translations, feature registry) with exactly two doubles injected, both from `@bota-apps/mocks`.

  - `createRenderRoute(config)` — builds the app's `renderRoute(path, { auth?, context? })` from its injections: router factory, feature tree, translation provider, mock-backend schema, seed persona, graphql-context builder.
  - `createRouteSmoke(config)` — `expectRouteRenders` (waits for the first terminal surface — shell, error, or 404 — then asserts the route rendered content; flag-gated stubs assert their gate) and `describeRouteSmoke(zone)` (a zone smoke file is one line).
  - `openPageMenu(user)` — opens `PageContainer`'s menu-actions dropdown by its accessible name.
  - `@bota-apps/testing/setup` — `installPageTestEnvironment()`: Testing Library cleanup, jest-dom matchers, jsdom shims (matchMedia, ResizeObserver, pointer capture, pinned desktop width), and a missing-translation gate that fails the test that rendered an `[i18n] MISSING` key.
  - `@bota-apps/testing/coverage` — `describeRouteCoverage` / `computeRouteCoverage`: diffs route files against the app's route catalog by shape (params/seed-ids → `*`) in both directions, so a new route cannot ship untested and failures name the exact route.

### Patch Changes

- Updated dependencies [2249836]
  - @bota-apps/react-components@0.8.3
