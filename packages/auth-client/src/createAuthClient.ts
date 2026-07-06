import type {
  AuthClient,
  RegisteredAuthUser,
  SessionPaths,
  SessionUser,
} from "@bota-apps/types/auth";
import { createSessionEndpoint, defaultSessionPaths } from "./sessionEndpoint";
import { createAuthStore } from "./authStore";

/** Options for {@link createAuthClient}. */
export type AuthClientOptions = {
  /** Base URL of the host/BFF (dev: mock host, prod: real BFF). */
  authUrl: string;
  /** Overrides for the `/bff/*` contract paths. */
  paths?: SessionPaths;
};

/**
 * Composes a session endpoint, an auth store, and the route-guard logic into a
 * single client bound to `authUrl`. This is the only entry point apps need.
 *
 * `TUser` is the app's API-owned user type (see `AuthRegister` in
 * `@bota-apps/types/auth`).
 */
export function createAuthClient<TUser extends SessionUser = RegisteredAuthUser>({
  authUrl,
  paths = defaultSessionPaths,
}: AuthClientOptions): AuthClient<TUser> {
  const endpoint = createSessionEndpoint<TUser>(authUrl, paths);
  const store = createAuthStore(endpoint);

  function loginUrl(returnUrl?: string): string {
    const target = returnUrl ?? window.location.href;
    return `${authUrl}${paths.login}?returnUrl=${encodeURIComponent(target)}`;
  }

  return {
    ...store,
    loginUrl,
    async requireSession() {
      await store.ensureReady();
      const state = store.getState();
      // A transport failure is not "logged out" — surface it to the app's
      // error boundary instead of bouncing the user to the login page.
      if (state.status === "error") {
        throw state.error;
      }
      if (!store.isAuthenticated()) {
        window.location.href = loginUrl(window.location.href);
        await new Promise<never>(() => {});
      }
    },
  };
}
