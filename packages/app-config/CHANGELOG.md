# @bota-apps/app-config

## 0.2.1

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.

## 0.2.0

### Minor Changes

- 0d6b4ac: Standardize the session gateway contract in `graphqlAppEnv` and rename for consistency:

  - Rename `sessionOrigin` → `authUrl` (env var `VITE_SESSION_ORIGIN` → `VITE_AUTH_URL`) — matches the `@bota-apps/auth-client` `authUrl` param and the `apiUrl` naming, so no field/param mismatch at the call site.
  - Add the session gateway paths to env (`sessionUserPath`, `sessionLoginPath`, `sessionLogoutPath`, `sessionSwitchOrgPath` → `VITE_SESSION_*_PATH`), so each deployment points them at the routes its backend serves instead of hard-coding the contract in the app.
  - Add `sessionPaths(env, subdomain)` — maps those env keys onto the auth-client `paths` shape (appending the tenant subdomain to the user endpoint), so hosts stop hand-rolling the mapping.

## 0.1.0

### Minor Changes

- 233fc86: New package `@bota-apps/app-config`: standardized runtime env for `@bota-apps` apps.

  - `createViteAppConfig(schema, import.meta.env)` — maps each schema key onto a Vite env var (`apiUrl` → `VITE_API_URL`, `mode` → the `MODE` builtin) and parses it with Zod, failing fast on missing/invalid values (moved from `@bota-apps/schema-utils`).
  - `graphqlAppEnv` — the base env schema every GraphQL-backed host shares (`mode`, `apiUrl`, `sessionOrigin`, `baseDomains`), extended per app. Replaces the env schema each host previously hand-rolled inline, with neutral, deployment-agnostic names.
