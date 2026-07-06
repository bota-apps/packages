import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { AuthClient, AuthState } from "@bota-apps/types/auth";

// The context carries the app's registered user type (AuthRegister in
// @bota-apps/types/auth) — one registration types every consumer, so no
// generics appear at call sites.
const AuthContext = createContext<AuthClient | undefined>(undefined);

export function AuthProvider({ client, children }: { client: AuthClient; children: ReactNode }) {
  useEffect(() => {
    void client.ensureReady();
  }, [client]);

  return <AuthContext.Provider value={client}>{children}</AuthContext.Provider>;
}

/** Returns the {@link AuthClient} from context. Throws outside an `AuthProvider`. */
export function useAuthClient(): AuthClient {
  const client = useContext(AuthContext);
  if (!client) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return client;
}

export type UseAuthResult = AuthState &
  Pick<AuthClient, "logout" | "isAuthenticated" | "loginUrl" | "switchOrganization">;

/**
 * Subscribes to auth state and exposes the navigation/session helpers. Uses
 * `useSyncExternalStore` so renders stay in sync with the external store.
 *
 * The explicit return type keeps tsc from synthesizing `import("..")`
 * specifiers in the emitted d.ts, which Node16 ESM consumers cannot resolve.
 */
export function useAuth(): UseAuthResult {
  const client = useAuthClient();
  const state = useSyncExternalStore(client.subscribe, client.getState, client.getState);
  return {
    ...state,
    logout: client.logout,
    isAuthenticated: client.isAuthenticated,
    loginUrl: client.loginUrl,
    switchOrganization: client.switchOrganization,
  };
}
