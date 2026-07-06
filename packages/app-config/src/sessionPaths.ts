import type { GraphqlAppEnv } from "./env";

/**
 * The session gateway's HTTP contract paths, shaped for the `@bota-apps/auth-client`
 * `paths` option. Kept structural (no auth-client import) so app-config stays
 * dependency-light; it matches `SessionPaths` by shape.
 */
export type SessionPaths = {
  user: string;
  login: string;
  logout: string;
  switchOrganization: string;
};

/**
 * Maps the `session*Path` env keys onto the auth-client `paths` shape, so every
 * host derives its session contract from config instead of hand-rolling the
 * mapping. The active tenant `subdomain` is appended to the user endpoint (the
 * gateway also derives it from the Host, so sending it is harmless).
 */
export function sessionPaths(
  env: Pick<
    GraphqlAppEnv,
    "sessionUserPath" | "sessionLoginPath" | "sessionLogoutPath" | "sessionSwitchOrgPath"
  >,
  subdomain: string,
): SessionPaths {
  return {
    user: `${env.sessionUserPath}?subdomain=${encodeURIComponent(subdomain)}`,
    login: env.sessionLoginPath,
    logout: env.sessionLogoutPath,
    switchOrganization: env.sessionSwitchOrgPath,
  };
}
