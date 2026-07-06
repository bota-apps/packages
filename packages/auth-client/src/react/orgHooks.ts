import { useCallback } from "react";
import { hasCurrentOrganization, type RegisteredCurrentOrganization } from "../currentOrganization";
import { useAuth, useAuthClient } from "./authContext";

/**
 * The authenticated user's active organization. Throws when there is no
 * authenticated session or the session has no organization — org-scoped
 * screens must sit behind a guard (see `requireAppContext`) that established
 * both, so absence here is a programming error, not a state to limp through.
 */
export function useCurrentOrganization(): RegisteredCurrentOrganization {
  const { user } = useAuth();
  if (user === undefined || !hasCurrentOrganization(user)) {
    throw new Error(
      "useCurrentOrganization requires an authenticated session with an active organization",
    );
  }
  return user.currentOrg;
}

/**
 * A stable callback that re-targets the session at another organization and
 * re-resolves the user (see `AuthStore.switchOrganization`).
 */
export function useSwitchOrganization(): (organizationId: string) => Promise<void> {
  const client = useAuthClient();
  return useCallback(
    (organizationId: string) => client.switchOrganization(organizationId),
    [client],
  );
}
