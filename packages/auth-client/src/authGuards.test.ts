import { describe, expect, it, vi } from "vitest";
import type { AuthClient, AuthState, SessionUser } from "@bota-apps/types/auth";
import { requireAppContext } from "./authGuards";

// The user schema is API-owned: `currentOrg` is an app-level field the guard
// reads structurally off the registered user — this test type stands in for an
// app's registration.
type TestOrg = { id: string; name: string };
type TestUser = SessionUser & { currentOrg?: TestOrg | null };

const org: TestOrg = { id: "org1", name: "Bota Coffee" };

const baseUser: TestUser = {
  id: "u1",
  name: "Test User",
  email: "test@example.com",
};

function fakeAuth(state: AuthState<TestUser>): AuthClient<TestUser> {
  return {
    getState: () => state,
    subscribe: () => () => {},
    ensureReady: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue(undefined),
    switchOrganization: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: () => state.status === "authenticated",
    requireSession: vi.fn().mockResolvedValue(undefined),
    loginUrl: vi.fn().mockReturnValue("https://auth.example.com/login"),
  };
}

describe("requireAppContext", () => {
  it("resolves the current user and organization for an org-scoped session", async () => {
    const user: TestUser = { ...baseUser, currentOrg: org };
    const auth = fakeAuth({ status: "authenticated", user });

    const context = await requireAppContext({ auth, queryClient: undefined });

    expect(auth.requireSession).toHaveBeenCalledTimes(1);
    expect(context).toEqual({ currentUser: user, currentOrg: org });
  });

  it("hands an org-less session to the login flow and never resolves", async () => {
    const auth = fakeAuth({ status: "authenticated", user: { ...baseUser, currentOrg: null } });

    const guard = requireAppContext({ auth, queryClient: undefined });
    const outcome = await Promise.race([
      guard.then(() => "resolved"),
      new Promise((resolve) => setTimeout(() => resolve("pending"), 25)),
    ]);

    expect(outcome).toBe("pending");
    expect(auth.loginUrl).toHaveBeenCalledTimes(1);
  });

  it("also treats a user without the currentOrg field as org-less", async () => {
    const auth = fakeAuth({ status: "authenticated", user: baseUser });

    const guard = requireAppContext({ auth, queryClient: undefined });
    const outcome = await Promise.race([
      guard.then(() => "resolved"),
      new Promise((resolve) => setTimeout(() => resolve("pending"), 25)),
    ]);

    expect(outcome).toBe("pending");
    expect(auth.loginUrl).toHaveBeenCalledTimes(1);
  });

  it("throws when requireSession resolves without an authenticated state", async () => {
    // The real client's requireSession never resolves when unauthenticated —
    // resolving into a non-authenticated state means the store broke its
    // contract, which the guard surfaces instead of limping on.
    const auth = fakeAuth({ status: "unauthenticated", user: undefined });

    await expect(requireAppContext({ auth, queryClient: undefined })).rejects.toThrow(
      'requireSession resolved with status "unauthenticated"',
    );
  });
});
