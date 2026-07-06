// @bota-apps/auth-client — the cookie-session auth RUNTIME. The pure SHAPE
// types live in @bota-apps/types/auth and are re-exported here for consumer
// convenience — EXCEPT AuthRegister: declaration merging must target the module
// that declares the interface, so register the app's API-owned user type with
//   declare module "@bota-apps/types/auth" { interface AuthRegister { user: ApiUser } }

export { createAuthClient } from "./createAuthClient";
export type { AuthClientOptions } from "./createAuthClient";

export { createSessionEndpoint, defaultSessionPaths } from "./sessionEndpoint";

export { createAuthStore } from "./authStore";

export { requireAppContext } from "./authGuards";
export type { AppContext, RootContext } from "./authGuards";

export type { RegisteredCurrentOrganization } from "./currentOrganization";

export { AuthProvider, useAuth, useAuthClient } from "./react/authContext";
export type { UseAuthResult } from "./react/authContext";
export { useCurrentOrganization, useSwitchOrganization } from "./react/orgHooks";

// shape contracts — re-exported from @bota-apps/types/auth for convenience, so
// consumers can `import type { AuthClient } from "@bota-apps/auth-client"`.
export type {
  SessionUser,
  RegisteredAuthUser,
  AuthState,
  AuthStatus,
  AuthPendingState,
  AuthenticatedState,
  UnauthenticatedState,
  AuthErrorState,
  AuthStore,
  AuthClient,
  SessionEndpoint,
  SessionPaths,
} from "@bota-apps/types/auth";
