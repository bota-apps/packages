import { z } from "zod";

/**
 * The base env every GraphQL-backed host app shares. Apps extend it with their
 * own keys (`graphqlAppEnv.extend({ ... })`) and resolve it via
 * {@link createViteAppConfig}. No defaults — a missing or invalid var fails the
 * parse at startup rather than silently degrading.
 *
 * Names are neutral and deployment-agnostic: `apiUrl` / `authUrl` describe the
 * roles, not any particular backend. The `session*Path` keys are the session
 * gateway's HTTP contract, kept in env so each deployment points them at the
 * routes its backend actually serves (see {@link sessionPaths}).
 */
export const graphqlAppEnv = z.object({
  // Build mode (Vite's built-in `MODE`).
  mode: z.enum(["development", "staging", "production"]),
  // GraphQL endpoint the data layer requests through. A same-origin path
  // (`/graphql`, kept first-party so the session cookie rides tenant subdomains)
  // or an absolute URL for a standalone, cookie-sharing API host. Required.
  apiUrl: z.string().min(1),
  // Auth/session gateway origin. Empty string = same-origin (dev via the Vite
  // proxy, prod served same-origin by the session backend); an absolute origin
  // for the standalone stack. Required — declared even when empty so an unset
  // var fails the parse.
  authUrl: z.string(),
  // Allowlisted base domains this deployment serves, comma-separated
  // (`example.com,localhost`). The active tenant is the subdomain under one.
  baseDomains: z.string().transform((value) =>
    value
      .split(",")
      .map((domain) => domain.trim())
      .filter(Boolean),
  ),
  // Session gateway contract paths (resolved against `authUrl`). Held in env so a
  // deployment matches its backend's actual routes; `sessionPaths` maps them onto
  // the auth-client `SessionPaths` shape.
  sessionUserPath: z.string().min(1),
  sessionLoginPath: z.string().min(1),
  sessionLogoutPath: z.string().min(1),
  sessionSwitchOrgPath: z.string().min(1),
});

/** Resolved base env for GraphQL-backed apps (extend the schema for app-only keys). */
export type GraphqlAppEnv = z.infer<typeof graphqlAppEnv>;
