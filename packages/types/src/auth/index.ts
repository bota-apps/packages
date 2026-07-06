// Pure type contracts for @bota-apps/auth-client (cookie-session auth). The
// runtime — createAuthClient/createAuthStore/createSessionEndpoint and the React
// bindings — lives in @bota-apps/auth-client. Consumers that only need the
// SHAPES (e.g. @bota-apps/mocks' createMockAuthClient) import from here and stay
// free of the auth runtime.
//
// The user schema itself is owned by the API — these contracts are generic over
// it, constrained to the minimal SessionUser fields the framework reads.

/**
 * The MINIMAL user shape the runtime layer expects on the session — a
 * constraint, not a schema. The full user type is owned by the API: apps define
 * it there (with roles, organizations, memberships, …) and register it via
 * {@link AuthRegister}; packages only rely on the fields below.
 */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * The user schema is owned by the API — this package never defines it. An app
 * registers its API-owned user type once, via declaration merging:
 *
 * ```ts
 * declare module "@bota-apps/types/auth" {
 *   interface AuthRegister {
 *     user: ApiUser;
 *   }
 * }
 * ```
 *
 * Every auth surface (`AuthState`, `useAuth`, `createAuthClient`, …) is then
 * typed with `ApiUser` app-wide, with no generics at call sites. Unregistered
 * (or registered with a type missing the expected fields), the surfaces fall
 * back to the minimal {@link SessionUser} constraint. The augmentation must
 * target `"@bota-apps/types/auth"` — the module that DECLARES the interface.
 */
// An interface (not a type) on purpose: declaration merging is the mechanism,
// and it is empty until an app merges its user type in.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthRegister {}

export type RegisteredAuthUser = AuthRegister extends { user: infer TUser extends SessionUser }
  ? TUser
  : SessionUser;

/* ── auth state ─────────────────────────────────────────────────────────── */

/** Session not resolved yet — initial ("unknown") or request in flight ("loading"). */
export type AuthPendingState = {
  status: "unknown" | "loading";
  user: undefined;
};

export type AuthenticatedState<TUser extends SessionUser = RegisteredAuthUser> = {
  status: "authenticated";
  user: TUser;
};

/** The endpoint answered 401 — there is no session. */
export type UnauthenticatedState = {
  status: "unauthenticated";
  user: undefined;
};

/** The session request itself failed (transport/server) — auth is undetermined, not logged out. */
export type AuthErrorState = {
  status: "error";
  user: undefined;
  error: Error;
};

/**
 * Discriminated on `status`: narrowing the status narrows the payload —
 * `user` is a `TUser` exactly when `status === "authenticated"`, and `error`
 * exists exactly when `status === "error"`. Every member carries `user`, so
 * `state.user` reads as `TUser | undefined` without narrowing.
 */
export type AuthState<TUser extends SessionUser = RegisteredAuthUser> =
  AuthPendingState | AuthenticatedState<TUser> | UnauthenticatedState | AuthErrorState;

export type AuthStatus = AuthState["status"];

/* ── store / client / endpoint ──────────────────────────────────────────── */

export type AuthStore<TUser extends SessionUser = RegisteredAuthUser> = {
  getState: () => AuthState<TUser>;
  subscribe: (listener: () => void) => () => void;
  /** Idempotently resolves the session once via the endpoint's user request. */
  ensureReady: () => Promise<void>;
  /** Drops the cached resolution and re-resolves the session. */
  refresh: () => Promise<void>;
  /**
   * Re-targets the session at another organization on the host/BFF, then
   * re-resolves the user (whose organization-dependent fields reflect the new
   * tenant).
   */
  switchOrganization: (organizationId: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
};

/**
 * The public auth surface: the external store plus the navigation helpers
 * (`requireSession`, `loginUrl`). Cookie-based throughout — the session lives
 * in an HttpOnly cookie owned by the host/BFF and there is no token to manage.
 */
export type AuthClient<TUser extends SessionUser = RegisteredAuthUser> = AuthStore<TUser> & {
  /**
   * Root-route guard. Resolves the session once; if there is none, hands off to
   * the host/BFF login endpoint and never resolves, so nothing renders before
   * the navigation happens.
   */
  requireSession: () => Promise<void>;
  /** Builds the host/BFF login URL, defaulting the return URL to the current location. */
  loginUrl: (returnUrl?: string) => string;
};

/** The HTTP paths the session endpoint talks to on the host/BFF. */
export type SessionPaths = {
  user: string;
  logout: string;
  login: string;
  switchOrganization: string;
};

/**
 * The transport against the host/BFF. Resolves and tears down the session over
 * the same `/bff/*` contract the production backend exposes.
 */
export type SessionEndpoint<TUser extends SessionUser = RegisteredAuthUser> = {
  /** Resolves the current user, or undefined when unauthenticated (401). */
  getUser: () => Promise<TUser | undefined>;
  logout: () => Promise<void>;
  /** Re-targets the session at another organization. */
  switchOrganization: (organizationId: string) => Promise<void>;
  /** The resolved paths, so the client can build the login URL. */
  paths: SessionPaths;
};
