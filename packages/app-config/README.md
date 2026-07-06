# @bota-apps/app-config

Standardized runtime environment config for `@bota-apps` apps. It owns the Vite env
resolver and the base env schema every GraphQL-backed host shares, so each app derives
its config from one Zod schema that fails fast at startup instead of hand-rolling env
parsing and degrading silently on a missing var.

## Install

```bash
pnpm add @bota-apps/app-config
# peer: zod
```

## Usage

Extend the base schema with any app-only keys, resolve it from `import.meta.env`, and
feed the session paths to the auth client:

```ts
import { createViteAppConfig, graphqlAppEnv, sessionPaths } from "@bota-apps/app-config";
import { createAuthClient } from "@bota-apps/auth-client";
import { z } from "zod";

const envSchema = graphqlAppEnv.extend({
  missingTranslationLevel: z.enum(["error", "warning", "info", "ignore"]).optional(),
});

export const env = createViteAppConfig(envSchema, import.meta.env);

const authClient = createAuthClient({
  authUrl: env.authUrl,
  paths: sessionPaths(env, subdomain),
});
```

### `createViteAppConfig(schema, import.meta.env)`

Maps each schema key onto a Vite env var — `apiUrl` → `VITE_API_URL`, with the `mode`
builtin reading `MODE` — and parses the result with Zod. No defaults: a missing or
invalid var throws at startup, so config fails fast rather than silently degrading.

### `graphqlAppEnv`

The base env schema every GraphQL-backed host shares. Names are deployment-agnostic
(`apiUrl`/`authUrl` describe roles, not a specific backend). Extend it with `.extend({ … })`
for app-only keys.

| Schema key             | Env var                        | Notes                                                            |
| ---------------------- | ------------------------------ | ---------------------------------------------------------------- |
| `mode`                 | `MODE` (Vite builtin)          | `development \| staging \| production`                           |
| `apiUrl`               | `VITE_API_URL`                 | Same-origin path (`/graphql`) or an absolute API URL             |
| `authUrl`              | `VITE_AUTH_URL`                | Empty = same-origin; an absolute origin for the standalone stack |
| `baseDomains`          | `VITE_BASE_DOMAINS`            | Comma-separated; the active tenant is the subdomain under one    |
| `sessionUserPath`      | `VITE_SESSION_USER_PATH`       | Session gateway route — resolved against `authUrl`               |
| `sessionLoginPath`     | `VITE_SESSION_LOGIN_PATH`      | "                                                                |
| `sessionLogoutPath`    | `VITE_SESSION_LOGOUT_PATH`     | "                                                                |
| `sessionSwitchOrgPath` | `VITE_SESSION_SWITCH_ORG_PATH` | "                                                                |

`baseDomains` is transformed from the comma-separated string into a trimmed, non-empty
`string[]`. The resolved type is exported as `GraphqlAppEnv`.

### `sessionPaths(env, subdomain)`

Maps the `session*Path` env keys onto the `@bota-apps/auth-client` `paths` shape,
appending the active tenant `subdomain` to the user endpoint. Kept structural (no
auth-client import) so app-config stays dependency-light; it matches `SessionPaths` by
shape. Hosts derive their session contract from config instead of hand-rolling the
mapping.

## API

| Export                | Kind     | What                                                                         |
| --------------------- | -------- | ---------------------------------------------------------------------------- |
| `createViteAppConfig` | function | Resolve a Zod-validated config from Vite env vars, failing fast on bad input |
| `graphqlAppEnv`       | schema   | Base Zod env schema shared by every GraphQL-backed host                      |
| `GraphqlAppEnv`       | type     | `z.infer` of the resolved base env                                           |
| `sessionPaths`        | function | Map `session*Path` env keys onto the auth-client `paths` shape               |
| `SessionPaths`        | type     | Structural shape of the auth-client session paths                            |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
