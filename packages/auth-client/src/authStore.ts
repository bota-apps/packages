import type {
  AuthState,
  AuthStore,
  RegisteredAuthUser,
  SessionEndpoint,
  SessionUser,
} from "@bota-apps/types/auth";

/**
 * A tiny external store driving auth state. Cookie-based: there is no token to
 * keep — the session lives in an HttpOnly cookie owned by the host/BFF, so we
 * only track who the current user is, resolved from the session endpoint.
 *
 * `TUser` is the app's API-owned user type (see `AuthRegister` in
 * `@bota-apps/types/auth`).
 */
export function createAuthStore<TUser extends SessionUser = RegisteredAuthUser>(
  endpoint: SessionEndpoint<TUser>,
): AuthStore<TUser> {
  let state: AuthState<TUser> = { status: "unknown", user: undefined };
  const listeners = new Set<() => void>();
  let readyPromise: Promise<void> | undefined;
  // Generation counter: refresh(), switchOrganization(), and logout() supersede
  // any in-flight resolution, whose late result must not overwrite the newer
  // state.
  let currentGen = 0;

  function setState(next: AuthState<TUser>) {
    state = next;
    listeners.forEach((listener) => listener());
  }

  async function resolveSession() {
    const gen = ++currentGen;
    setState({ status: "loading", user: undefined });
    try {
      const user = await endpoint.getUser();
      if (gen !== currentGen) {
        return;
      }
      // The endpoint resolves undefined on 401 — that, and only that, means
      // "no session".
      setState(
        user ? { status: "authenticated", user } : { status: "unauthenticated", user: undefined },
      );
    } catch (err) {
      if (gen !== currentGen) {
        return;
      }
      // A throw is a transport/server failure, not a logout — report it as
      // such and let the next ensureReady() retry instead of caching failure.
      setState({
        status: "error",
        user: undefined,
        error: err instanceof Error ? err : new Error(String(err)),
      });
      readyPromise = undefined;
    }
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    ensureReady() {
      readyPromise ??= resolveSession();
      return readyPromise;
    },
    refresh() {
      readyPromise = resolveSession();
      return readyPromise;
    },
    async switchOrganization(organizationId) {
      // Supersede any in-flight resolution — its result describes the old
      // organization. On endpoint failure the state is left untouched (the
      // session still targets the old organization) and the error surfaces.
      currentGen += 1;
      await endpoint.switchOrganization(organizationId);
      readyPromise = resolveSession();
      return readyPromise;
    },
    async logout() {
      // Supersede any in-flight resolution — its request carried the
      // pre-logout cookies and must not re-authenticate the store.
      currentGen += 1;
      try {
        await endpoint.logout();
      } finally {
        setState({ status: "unauthenticated", user: undefined });
        // Allow ensureReady() to re-resolve after a later re-login.
        readyPromise = undefined;
      }
    },
    isAuthenticated() {
      return state.status === "authenticated";
    },
  };
}
