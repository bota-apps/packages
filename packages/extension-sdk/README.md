# @bota-apps/extension-sdk

The runtime contract for embeddable `@bota-apps` extension apps. An extension runs
either **embedded** in a host (inside an iframe) or **standalone** (its own tab, for
local dev); this package owns that duality so each extension only writes its pages.

## Install

```bash
pnpm add @bota-apps/extension-sdk
# peers: react, react-dom
```

## Usage

`createExtensionApp` returns an `App` that renders the current page bare when embedded
in a host and wraps it in the standalone `ExtensionShell` (sidebar + history-based nav)
when run on its own:

```tsx
import { createExtensionApp } from "@bota-apps/extension-sdk";
import { Gift } from "lucide-react";
import { MilestonesRoute } from "./routes/milestonesRoute";

const { App } = createExtensionApp({
  appName: "Project Milestones",
  appIcon: Gift,
  appVersion: "0.1.0",
  pages: [{ path: "/", label: "Milestones", icon: Gift }],
  readyMessage: { kind: "milestones.ready", appId: "milestones" },
  renderPage: (path) => (path === "/" ? <MilestonesRoute /> : null),
});
```

### Custom install context

The host passes an `AppInstallationContext` (`tenantId`, `tenantName`, `appToken`) on the
URL. Extensions needing extra fields pass their own `readContext`, layering on top of the
base `readContextFromUrl` — `createExtensionApp` is generic over the resulting context
type:

```tsx
readContext: (search) => {
  const base = readContextFromUrl(search);
  const params = new URLSearchParams(search);
  return { ...base, projectId: params.get("projectId") ?? undefined };
},
```

### Talking to the host

The bridge helpers are the entire host↔iframe contract. `isEmbedded()` reports the mode;
`notifyHost(message)` posts a message up to the host window (a no-op when standalone, so
the same code runs in both modes). Each extension owns its own message union:

```tsx
import { isEmbedded, notifyHost } from "@bota-apps/extension-sdk";

if (isEmbedded()) {
  notifyHost({ kind: "milestones.submitted", taskId });
}
```

## API

| Export                     | Kind      | What                                                                         |
| -------------------------- | --------- | ---------------------------------------------------------------------------- |
| `createExtensionApp`       | function  | Bootstrap factory returning `{ App }` — bare when embedded, shell standalone |
| `ExtensionShell`           | component | Standalone sidebar chrome (app name/icon/version + page nav)                 |
| `isEmbedded`               | function  | `true` when running inside a host iframe                                     |
| `notifyHost`               | function  | Post a message up to the host window (no-op standalone)                      |
| `readContextFromUrl`       | function  | Parse the base install context from a URL search string                      |
| `standaloneContext`        | constant  | Fallback install context used when standalone                                |
| `AppInstallationContext`   | type      | Base install-context shape (`tenantId`, `tenantName`, `appToken`)            |
| `ExtensionPage`            | type      | One navigable page (`path`, `label`, `icon`)                                 |
| `ExtensionShellProps`      | type      | Props for `ExtensionShell`                                                   |
| `CreateExtensionAppConfig` | type      | Config accepted by `createExtensionApp`                                      |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
