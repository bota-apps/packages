import type { AuthClient, AuthState, RegisteredAuthUser, SessionUser } from "@bota-apps/types/auth";

export type MockAuthClientOptions<TUser extends SessionUser = RegisteredAuthUser> = {
  /** Start authenticated as this user; omit to start unauthenticated. */
  user?: TUser;
  /** Full control over the starting state (wins over `user`). */
  state?: AuthState<TUser>;
  /** The URL `loginUrl()` reports (default `"/login"`). */
  loginUrl?: string;
  /**
   * Maps an organization switch to the re-resolved user — the real client
   * re-fetches the session after the BFF re-targets it, and only the app knows
   * how its API-owned user changes per organization. `switchOrganization`
   * throws unless this is configured.
   */
  resolveSwitch?: (organizationId: string, user: TUser) => TUser;
  /**
   * Escape hatch to replace any subset of the client surface. Merged **last**,
   * so it wins over both the seeded defaults and the behavioral options above —
   * override one member (e.g. make `refresh` reject, or spy on `loginUrl`) and
   * keep the faithful implementation for the rest, or pass every member for a
   * full replacement. Typed `Partial<AuthClient<TUser>>`, so an override that
   * doesn't match the real client's shape is a compile error.
   */
  overrides?: Partial<AuthClient<TUser>>;
};

/**
 * An in-memory {@link AuthClient} for tests and stories — no fetch, no
 * navigation. It conforms to the REAL client type (nothing extra), so anything
 * accepting an `AuthClient` accepts it. Unlike the real client,
 * `requireSession` resolves even when unauthenticated (it cannot navigate);
 * assert on state instead.
 *
 * Pass `overrides` to replace any subset of the surface (partial) or all of it
 * (full) while keeping shape-fidelity — see {@link MockAuthClientOptions}.
 */
export function createMockAuthClient<TUser extends SessionUser = RegisteredAuthUser>(
  options: MockAuthClientOptions<TUser> = {},
): AuthClient<TUser> {
  let state: AuthState<TUser> =
    options.state ??
    (options.user
      ? { status: "authenticated", user: options.user }
      : { status: "unauthenticated", user: undefined });
  const listeners = new Set<() => void>();

  function setState(next: AuthState<TUser>) {
    state = next;
    listeners.forEach((listener) => listener());
  }

  const base: AuthClient<TUser> = {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async ensureReady() {},
    async refresh() {},
    async switchOrganization(organizationId) {
      if (state.status !== "authenticated") {
        throw new Error("switchOrganization requires an authenticated session.");
      }
      if (!options.resolveSwitch) {
        throw new Error("createMockAuthClient: configure resolveSwitch to use switchOrganization.");
      }
      setState({
        status: "authenticated",
        user: options.resolveSwitch(organizationId, state.user),
      });
    },
    async logout() {
      setState({ status: "unauthenticated", user: undefined });
    },
    isAuthenticated: () => state.status === "authenticated",
    async requireSession() {
      if (state.status === "error") {
        throw state.error;
      }
    },
    loginUrl: () => options.loginUrl ?? "/login",
  };

  // Consumer overrides win over the faithful defaults. Partial merge keeps every
  // un-overridden member intact; a full override replaces all of them.
  return { ...base, ...options.overrides };
}
