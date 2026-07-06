# @bota-apps/auth-client

Cookie-session auth client for `@bota-apps` apps. You give it an `authUrl`; it
gives you an `AuthClient` — a session endpoint, an external auth store, a
root-route guard, and React bindings, all composed by `createAuthClient`. No
tokens are read or held: the session lives in an `HttpOnly` cookie owned by the
gateway/BFF and is resolved over a `/bff/*` contract.

The auth SHAPE types (`AuthClient`, `AuthState`, `SessionUser`, …) live in
[`@bota-apps/types/auth`](../types) and are re-exported here for convenience, so
consumers import both the runtime and its types from this single package.

## Install

```bash
pnpm add @bota-apps/auth-client
# peer: react
```

## Usage

Compose the client once at bootstrap — this is the only entry point most apps
need:

```ts
import { createAuthClient } from "@bota-apps/auth-client";

export const authClient = createAuthClient({ authUrl: appConfig.bffUrl });
```

`AuthClientOptions` also accepts `paths` to override the `/bff/*` contract; the
default is `defaultSessionPaths` (`/bff/{user,logout,login}`).

The resulting `AuthClient` surface:

- `getState()` / `subscribe(listener)` — read the current `AuthState` and react
  to changes (the store is external-store friendly).
- `ensureReady()` — resolve the session once, awaitable.
- `isAuthenticated()` — boolean guard derived from state.
- `logout()` — clears the server session and updates state.
- `loginUrl(returnUrl?)` — builds the BFF login URL (defaults the return target
  to the current location).
- `requireSession()` — root-route guard: awaits readiness, rethrows a transport
  error to the app's error boundary (a network failure is **not** treated as
  "logged out"), and otherwise redirects to the login page when there is no
  session.

`AuthState` is a discriminated union on `status`
(`pending` | `authenticated` | `unauthenticated` | `error`), so narrowing the
status narrows the payload — `user` exists only on the authenticated member.

### React bindings

Provide the client, then read it with the hooks:

```tsx
import { AuthProvider, useAuth } from "@bota-apps/auth-client";

<AuthProvider client={authClient}>{children}</AuthProvider>;

function UserBadge() {
  const { user, logout, loginUrl } = useAuth();
  return user ? <button onClick={logout}>{user.name}</button> : <a href={loginUrl()}>Sign in</a>;
}
```

`useAuthClient()` returns the raw client for imperative calls;
`useCurrentOrganization()` / `useSwitchOrganization()` cover the multi-org case.

### Registering the app's user type

The client is generic over `TUser extends SessionUser`. Apps register their
API-owned user type once via declaration merging against the module that
declares the interface — so every surface (`useAuth().user`, `getState()`) is
typed app-wide without call-site generics:

```ts
declare module "@bota-apps/types/auth" {
  interface AuthRegister {
    user: ApiUser;
  }
}
```

## API

| Export                                             | What                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `createAuthClient`                                 | Composes endpoint + store + guard into an `AuthClient` bound to `authUrl`.    |
| `createSessionEndpoint` / `defaultSessionPaths`    | The `/bff/*` session transport and its default path contract.                 |
| `createAuthStore`                                  | The external auth store (state + `subscribe`), guarded against stale commits. |
| `requireAppContext`                                | Route-loader guard returning the typed `AppContext` / `RootContext`.          |
| `AuthProvider` / `useAuth` / `useAuthClient`       | React provider and hooks over an `AuthClient`.                                |
| `useCurrentOrganization` / `useSwitchOrganization` | Current-org read and switch hooks.                                            |

Shape types (`AuthClient`, `AuthState`, `AuthStatus`, `SessionUser`,
`RegisteredAuthUser`, `SessionEndpoint`, `SessionPaths`, and the per-status state
members) are re-exported from `@bota-apps/types/auth`.

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
