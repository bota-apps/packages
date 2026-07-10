# @bota-apps/react-components

The app-runtime React layer shared by every authenticated `@bota-apps` app. It
wires auth + data + feature providers and the app chrome around the context-free
primitives in [`@bota-apps/react-ui`](../react-ui). Apps pass their
config/router/nav in, so a fix here applies everywhere instead of being copied
into each app.

## Install

```bash
pnpm add @bota-apps/react-components
# peers: react, react-dom, @tanstack/react-query
```

`react`, `react-dom`, and `@tanstack/react-query` are peer dependencies. This
package builds on [`@bota-apps/react-ui`](../react-ui),
[`@bota-apps/auth-client`](../auth-client), [`@bota-apps/fm`](../fm),
[`@bota-apps/hooks`](../hooks), and [`@bota-apps/gql-client`](../gql-client), and
routes with `@tanstack/react-router`.

## Usage

### The provider stack

`createAppRoot` composes the whole authenticated provider tree in one call. The
only per-app inputs are its clients, router, and feature registry — the tree is
identical everywhere:

```tsx
import { createRoot } from "react-dom/client";
import { createAppRoot } from "@bota-apps/react-components";

const { AppRoot } = createAppRoot({
  authClient, // AuthClient   — from @bota-apps/auth-client
  graphqlClient, // GraphQLClient — from @bota-apps/gql-client
  router, // AnyRouter     — the app's own TanStack router
  featureRegistry, // FeatureRegistry — from @bota-apps/fm
  appearance: {
    // optional AppearanceConfig — presets the app ships CSS for, defaults, storage key
  },
});

createRoot(document.getElementById("root")!).render(<AppRoot />);
```

The composed tree is:

```
ErrorBoundary
  FeatureProvider          resolves the feature tree
    FeatureScopeProvider   ambient app scope (never empty)
      QueryProvider        React Query
        GraphQLProvider    cookie-credentialed graphql-request client
          AuthProvider     session bootstrap via the auth client
            AppearanceProvider   mode / brand / shell layout
              RouterProvider (context: auth, queryClient) + Toasts
```

### App chrome

`AppShell` is the authenticated chrome — fully app-agnostic, with the per-app
title and nav supplied as props and the look driven by the ambient
`AppearanceProvider`:

```tsx
import { AppShell, type NavItemDef } from "@bota-apps/react-components";

const navItems: NavItemDef[] = [/* per-app nav (each app owns its own navItems.ts) */];

<AppShell title="Acme" navItems={navItems} headerActions={appHeaderControls}>
  {children}
</AppShell>;
```

Individual chrome controls can also be mounted directly:
`AppShellLayout` (`layout="sidebar" | "topnav"`), `NavList`, `ThemeToggle`,
`PresetSelect`, `LayoutToggle`, `DensityToggle`, `LanguageToggle`, `UserMenu`,
`OrgSwitcherMenu`.

### Appearance

`AppearanceProvider` / `useAppearance` own a single persisted preference that
bundles an appearance preset (brand tokens + shell layout + density) with the
personal light/dark mode. `PresetSelect` applies a whole look with one pick;
`ThemeToggle` flips only light/dark.

```tsx
import { useAppearance } from "@bota-apps/react-components";

const { mode, toggleMode, preset, applyPreset } = useAppearance();
```

### Routing surfaces

Typed route links and route-level UI wrap `@tanstack/react-router`:

```tsx
import { RouteLink, Breadcrumbs, NotFound, RouteError } from "@bota-apps/react-components";

<RouteLink to="/users/$id" params={{ id }}>
  View user
</RouteLink>;

<Breadcrumbs variant="pill" />;
```

### Page machinery

`PageContainer` renders a page's unified state (loading / error / empty /
content) so pages don't re-implement it; `SuspensePageContainer` is the Suspense
variant, and `derivePageState` computes the state from query results.

```tsx
import { PageContainer, SuspensePageContainer, derivePageState } from "@bota-apps/react-components";
```

### Feature bridge

`FeaturePageGuard` gates a page on a feature being enabled, and `FeatureCard`
renders a feature entry — both bridging [`@bota-apps/fm`](../fm) into the UI.

```tsx
import { FeaturePageGuard, FeatureCard } from "@bota-apps/react-components";
```

### Entity audit log

`EntityAuditLog` renders a generic, API-owned audit trail for any entity:

```tsx
import { EntityAuditLog } from "@bota-apps/react-components";

<EntityAuditLog entries={auditEntries} />;
```

## Subpaths

| Import                        | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/react-components` | The full app-runtime surface: `createAppRoot`, `AppShell` + chrome (`NavList`, `ThemeToggle`, `PresetSelect`, `LayoutToggle`, `DensityToggle`, `LanguageToggle`, `UserMenu`, `OrgSwitcherMenu`), providers (`AppearanceProvider`/`useAppearance`, `ErrorBoundary`, `Toasts`/`toast`), routing (`RouteLink`, `Breadcrumbs`, `NotFound`, `RouteError`), page machinery (`PageContainer`, `SuspensePageContainer`, `derivePageState`), the feature bridge (`FeaturePageGuard`, `FeatureCard`), navigation, actions, and `EntityAuditLog` |

This package ships a single entry point — everything is exported from the package
root.

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
