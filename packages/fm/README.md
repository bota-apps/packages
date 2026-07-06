# @bota-apps/fm

Feature-management and error-boundary runtime. One feature tree per app drives
per-action error classification, telemetry, and notifications, plus gating and
navigation. Error handling is owned by the feature node — not sprinkled at call
sites — and the package depends on no UI or telemetry SDK: the app wires
concretes via `configureFeatureRuntime`.

Each feature node yields a `FeatureScope` with two faces: a **gating** face
(available/status, driven by collectors) and a **boundary** face (`run`/`recover`
that classifies errors, emits one telemetry fingerprint, and notifies once). The
SHAPE types live in [`@bota-apps/types/fm`](../types); this package is the
runtime (error classes, classifier, registries, tree resolver, scope/boundary,
React providers) and re-exports those types for convenience.

## Install

```bash
pnpm add @bota-apps/fm
# peer: react
```

## Usage

Wire the runtime seam once at bootstrap, then build a registry from the tree:

```ts
import { configureFeatureRuntime, createFeatureRegistry } from "@bota-apps/fm";
import type { FeatureNodeDef } from "@bota-apps/fm";

// 1. Inject the app's UI/telemetry/auth concretes once.
configureFeatureRuntime({
  notify: ({ message, level }) => toast({ title: message, variant: level }),
  track: (event) => analytics.track(event.fingerprint, event.context),
  requestLogout: () => authClient.logout(),
});

// 2. Define the tree and build a registry (provide it via <FeatureProvider>).
const tree = { id: "app", children: [/* … */] } as const satisfies FeatureNodeDef;
export const featureRegistry = createFeatureRegistry(tree);
```

Provide the registry and resolve a scope in a component, then run an action
under its boundary:

```tsx
import { FeatureProvider, useFeatureScope } from "@bota-apps/fm";

<FeatureProvider registry={featureRegistry}>{children}</FeatureProvider>;

function CreateProject() {
  const scope = useFeatureScope("projects:create");
  const onSubmit = (values) =>
    scope.run(() => api.createProject(values), { success: { onSuccess } });
  // classifies errors, emits one telemetry fingerprint, notifies once — no try/catch
}
```

Gate UI on a feature's resolved status without a boundary:

```tsx
import { FeatureGate, useFeatureStatus } from "@bota-apps/fm";

<FeatureGate feature="billing:projects">
  <ProjectsPanel />
</FeatureGate>;
```

## API

The package groups its runtime into a few areas:

| Area          | Exports (selection)                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Errors        | `AppError`, `ApiError`, `GraphQLError`, `ValidationError`, `BusinessRuleError`, `AuthError`, `NetworkError`, `UnexpectedError`, `classifyError`, `featureErrorRegistry`                                                                                |
| Boundary      | `configureFeatureRuntime` / `getFeatureRuntime`, `runFeatureAction`, `tryOrDefault`, `reportQueryError`, `buildFeatureOptions`, `routeClassifiedError`                                                                                                 |
| Tree          | `createFeatureRegistry`, `resolveFeature` / `resolveFeaturePath` / `resolveFeatureTree`, `composeFeatureTree`, `deriveFeatureAnnotations`, `defaultCollectors` (`flag`/`permission`/`plan`/`limit`/`setup`)                                            |
| Scope         | `makeScope`                                                                                                                                                                                                                                            |
| Apps/manifest | `appManifestToFeature` / `appManifestToContribution`, `mountAppContributions`, `toAppManifest`, `useFeatureRegistry`, `resolveLucideIcon`                                                                                                              |
| Capabilities  | `capabilitiesToFeatureInputs`, `buildResourceTree` / `collectResourceIds` / `pruneToGranted`                                                                                                                                                           |
| React         | `FeatureProvider`, `FeatureScopeProvider`, `FeatureGate`, `createFeatureAccess`, and the `useFeature*` hooks (`useFeatureScope`, `useFeature`, `useFeatureStatus`, `useFeatureChildren`, `useFeatureTree`, `useFeatureAnnotations`, `useFeatureSetup`) |

Shape types (`FeatureNodeDef`, `FeatureScope`, `ResolvedFeature`,
`FeatureRuntime`, `TrackEvent`, `NotifyMessage`, the `AppManifest` family, the
`Extract*` id helpers, …) are re-exported from `@bota-apps/types/fm`.

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
