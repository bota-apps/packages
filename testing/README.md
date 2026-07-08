# @bota-apps/testing

Page-level integration-test harness for `@bota-apps` hosts. Tests mount the
**real app** — the whole `createAppRoot` provider stack, the app's own router
factory, translations, feature registry, every component — with exactly **two**
doubles injected, both from `@bota-apps/mocks`: the auth client and the graphql
client (executing real documents against the app's mock-backend schema).
Nothing is module-mocked, ever.

## Entrypoints

| Import                        | Provides                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/testing`          | `createRenderRoute` (the app's `renderRoute(path)` factory), `createRouteSmoke` (`expectRouteRenders` + `describeRouteSmoke`), `openPageMenu`                                                |
| `@bota-apps/testing/setup`    | `installPageTestEnvironment` — Testing Library cleanup, jest-dom matchers, jsdom shims (matchMedia, ResizeObserver, pointer capture, pinned desktop width), and the missing-translation gate |
| `@bota-apps/testing/coverage` | `describeRouteCoverage` / `computeRouteCoverage` — node-side guard diffing route files against the app's route catalog by shape, so a new route cannot ship untested                         |

## Wiring an app

```ts
// testing/renderRoute.ts — the app-local data/wiring stays in the app
export const renderRoute = createRenderRoute({
  createRouter: createAppRouter, // thin wrapper over createHostRouter
  featureTree: appFeatureTree,
  TranslationProvider, // app-local translations
  schema: mockSchema, // the mock backend's real SDL + resolvers
  seedUser: seededUser,
  graphqlContext: (overrides) => ({ userId: seededUser.id, ...overrides }),
});

export const { expectRouteRenders, describeRouteSmoke } = createRouteSmoke({
  renderRoute,
  catalog: routeCatalog,
  gatedRoutePaths,
  shellCopy: new RegExp(`signed in as ${seededUser.name}`, "i"),
});
```

Each zone's smoke file is one line — `describeRouteSmoke("employees")` — and
the coverage guard fails, naming the exact route, until a newly added route has
a catalog entry and its zone has a smoke file.
