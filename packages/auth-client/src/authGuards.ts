import type { AuthClient, RegisteredAuthUser } from "@bota-apps/types/auth";
import { hasCurrentOrganization, type RegisteredCurrentOrganization } from "./currentOrganization";

/**
 * The root router context an app wires its guard-relevant singletons into.
 * `queryClient` is a pass-through slot — the guard never touches it, so its
 * type is app-supplied (`RootContext<QueryClient>`) rather than a dependency
 * of this package.
 */
export type RootContext<TQueryClient = unknown> = {
  auth: AuthClient;
  queryClient: TQueryClient;
};

/** What `requireAppContext` resolves for every route below the guard. */
export type AppContext = {
  currentUser: RegisteredAuthUser;
  currentOrg: RegisteredCurrentOrganization;
};

function neverResolve(): Promise<never> {
  return new Promise<never>(() => {});
}

/**
 * Route guard (`beforeLoad`) for authenticated, org-scoped apps. Resolves the
 * session via the client — `requireSession` navigates to the login target and
 * never resolves when unauthenticated — then requires an active organization
 * on the session user. An org-less session is also handed to the login flow
 * (which must establish an organization) with the same never-resolving
 * contract, so nothing below the guard renders before the navigation lands.
 */
export async function requireAppContext(context: RootContext): Promise<AppContext> {
  const { auth } = context;

  await auth.requireSession();

  const state = auth.getState();
  if (state.status !== "authenticated") {
    // requireSession redirects (never resolving) when unauthenticated —
    // reaching here means the store broke its contract.
    throw new Error(`requireSession resolved with status "${state.status}"`);
  }

  const { user } = state;
  if (!hasCurrentOrganization(user)) {
    // Org-less session: the login flow must establish an organization first.
    window.location.href = auth.loginUrl();
    return neverResolve();
  }

  return { currentUser: user, currentOrg: user.currentOrg };
}
