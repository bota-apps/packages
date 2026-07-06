import type {
  RegisteredAuthUser,
  SessionEndpoint,
  SessionPaths,
  SessionUser,
} from "@bota-apps/types/auth";

/** Default contract paths exposed by the host/BFF (`/bff/*`). */
export const defaultSessionPaths: SessionPaths = {
  user: "/bff/user",
  logout: "/bff/logout",
  login: "/bff/login",
  switchOrganization: "/bff/switch-organization",
};

/**
 * Creates a session endpoint bound to `authUrl` — in dev the mock host, in
 * prod the real BFF; the SPA never sees the difference.
 *
 * Cookie-based: every request sends `credentials: "include"`, so the browser
 * attaches the HttpOnly session cookie owned by the host/BFF. There is no token
 * to read or carry — authentication is entirely the cookie. A `401` from the
 * user endpoint simply means "no session" and resolves to `undefined`.
 */
export function createSessionEndpoint<TUser extends SessionUser = RegisteredAuthUser>(
  authUrl: string,
  paths: SessionPaths = defaultSessionPaths,
): SessionEndpoint<TUser> {
  return {
    paths,
    async getUser() {
      const res = await fetch(`${authUrl}${paths.user}`, { credentials: "include" });
      if (res.status === 401) return undefined;
      if (!res.ok) throw new Error(`GET ${paths.user} failed: ${res.status}`);
      const data = (await res.json()) as { user: TUser };
      return data.user;
    },
    async logout() {
      await fetch(`${authUrl}${paths.logout}`, { method: "POST", credentials: "include" });
    },
    async switchOrganization(organizationId) {
      const res = await fetch(`${authUrl}${paths.switchOrganization}`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      if (!res.ok) {
        throw new Error(`POST ${paths.switchOrganization} failed: ${res.status}`);
      }
    },
  };
}
