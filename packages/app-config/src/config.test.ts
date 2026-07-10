import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createViteAppConfig } from "./viteConfig";
import { graphqlAppEnv } from "./env";
import { sessionPaths } from "./sessionPaths";

describe("createViteAppConfig", () => {
  it("maps camelCase schema keys to VITE_<SCREAMING_SNAKE> env vars", () => {
    const schema = z.object({ apiUrl: z.string(), authUrl: z.string() });
    const config = createViteAppConfig(schema, {
      VITE_API_URL: "/graphql",
      VITE_AUTH_URL: "https://auth.example.com",
    });

    expect(config).toEqual({
      apiUrl: "/graphql",
      authUrl: "https://auth.example.com",
    });
  });

  it("reads Vite builtins without the VITE_ prefix (mode → MODE)", () => {
    const schema = z.object({ apiUrl: z.string().min(1), mode: z.string() });
    const config = createViteAppConfig(schema, {
      VITE_API_URL: "/graphql",
      MODE: "development",
    });

    expect(config).toEqual({ apiUrl: "/graphql", mode: "development" });
  });

  it("throws when a required env var is missing", () => {
    const schema = z.object({ apiUrl: z.string().min(1), authUrl: z.string() });
    expect(() => createViteAppConfig(schema, { VITE_API_URL: "/graphql" })).toThrow();
  });
});

describe("graphqlAppEnv", () => {
  const base = {
    MODE: "development",
    VITE_API_URL: "/graphql",
    VITE_AUTH_URL: "",
    VITE_BASE_DOMAINS: "example.com, localhost",
    VITE_SESSION_USER_PATH: "/session/user",
    VITE_SESSION_LOGIN_PATH: "/session/login",
    VITE_SESSION_LOGOUT_PATH: "/session/logout",
    VITE_SESSION_SWITCH_ORG_PATH: "/session/switch-organization",
  };

  it("parses the base env and splits baseDomains into a trimmed list", () => {
    const env = createViteAppConfig(graphqlAppEnv, base);

    expect(env).toEqual({
      mode: "development",
      apiUrl: "/graphql",
      authUrl: "",
      baseDomains: ["example.com", "localhost"],
      sessionUserPath: "/session/user",
      sessionLoginPath: "/session/login",
      sessionLogoutPath: "/session/logout",
      sessionSwitchOrgPath: "/session/switch-organization",
    });
  });

  it("allows an empty authUrl (same-origin) but requires it to be present", () => {
    expect(() =>
      createViteAppConfig(graphqlAppEnv, { ...base, VITE_AUTH_URL: undefined }),
    ).toThrow();
  });

  it("rejects an empty apiUrl (fail fast, no default)", () => {
    expect(() => createViteAppConfig(graphqlAppEnv, { ...base, VITE_API_URL: "" })).toThrow();
  });

  it("rejects a missing session path (fail fast, no default)", () => {
    expect(() =>
      createViteAppConfig(graphqlAppEnv, { ...base, VITE_SESSION_USER_PATH: undefined }),
    ).toThrow();
  });

  it("extends with app-only keys", () => {
    const schema = graphqlAppEnv.extend({
      missingTranslationLevel: z.enum(["error", "warning", "info", "ignore"]).optional(),
    });
    const env = createViteAppConfig(schema, {
      ...base,
      VITE_MISSING_TRANSLATION_LEVEL: "warning",
    });

    expect(env.missingTranslationLevel).toBe("warning");
  });
});

describe("sessionPaths", () => {
  const env = {
    sessionUserPath: "/session/user",
    sessionLoginPath: "/session/login",
    sessionLogoutPath: "/session/logout",
    sessionSwitchOrgPath: "/session/switch-organization",
  };

  it("maps env keys onto the auth-client paths shape, appending the tenant subdomain to user", () => {
    expect(sessionPaths(env, "acme")).toEqual({
      user: "/session/user?subdomain=acme",
      login: "/session/login",
      logout: "/session/logout",
      switchOrganization: "/session/switch-organization",
    });
  });

  it("url-encodes the subdomain", () => {
    expect(sessionPaths(env, "a b").user).toBe("/session/user?subdomain=a%20b");
  });
});
