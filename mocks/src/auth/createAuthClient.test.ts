import { describe, expect, it, vi } from "vitest";
import type { SessionUser } from "@bota-apps/types/auth";
import { createMockAuthClient } from "./createAuthClient";

// The mock is generic over the app's API-owned user type, like the real client.
type User = SessionUser & { role: string; organization: { id: string; name: string } };

const orgOne = { id: "org1", name: "Bota Coffee" };
const orgTwo = { id: "org2", name: "Bota Bakery" };

const user: User = {
  id: "u1",
  name: "Test User",
  email: "test@example.com",
  role: "admin",
  organization: orgOne,
};

describe("createMockAuthClient", () => {
  it("starts unauthenticated by default and authenticated with a user", () => {
    expect(createMockAuthClient().getState().status).toBe("unauthenticated");
    expect(createMockAuthClient({ user }).getState()).toEqual({
      status: "authenticated",
      user,
    });
  });

  it("switchOrganization re-resolves the user via resolveSwitch and notifies subscribers", async () => {
    const client = createMockAuthClient({
      user,
      resolveSwitch: (organizationId, current) =>
        organizationId === "org2" ? { ...current, role: "viewer", organization: orgTwo } : current,
    });
    const listener = vi.fn();
    client.subscribe(listener);

    await client.switchOrganization("org2");

    const state = client.getState();
    if (state.status !== "authenticated") {
      throw new Error(`expected authenticated state, got "${state.status}"`);
    }
    expect(state.user.organization).toEqual(orgTwo);
    expect(state.user.role).toBe("viewer");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("switchOrganization throws without resolveSwitch or without a session", async () => {
    await expect(createMockAuthClient({ user }).switchOrganization("org2")).rejects.toThrow(
      "resolveSwitch",
    );
    await expect(
      createMockAuthClient({ resolveSwitch: (_, current) => current }).switchOrganization("org2"),
    ).rejects.toThrow("authenticated");
  });

  it("logout transitions to unauthenticated", async () => {
    const client = createMockAuthClient({ user });
    await client.logout();
    expect(client.getState().status).toBe("unauthenticated");
    expect(client.isAuthenticated()).toBe(false);
  });

  it("a configured error state surfaces through requireSession", async () => {
    const boom = new Error("session backend down");
    const client = createMockAuthClient<User>({
      state: { status: "error", user: undefined, error: boom },
    });
    await expect(client.requireSession()).rejects.toBe(boom);
  });

  it("overrides replace a single member and keep the rest faithful", async () => {
    const boom = new Error("refresh failed");
    const client = createMockAuthClient<User>({
      user,
      overrides: {
        refresh: () => Promise.reject(boom),
        loginUrl: () => "/custom-login",
      },
    });

    // overridden members win
    await expect(client.refresh()).rejects.toBe(boom);
    expect(client.loginUrl()).toBe("/custom-login");
    // un-overridden members keep the faithful default
    expect(client.isAuthenticated()).toBe(true);
    await client.logout();
    expect(client.getState().status).toBe("unauthenticated");
  });

  it("overrides can spy on a member without losing behavior", async () => {
    const loginUrl = vi.fn(() => "/login");
    const client = createMockAuthClient<User>({ overrides: { loginUrl } });
    client.loginUrl("/back");
    expect(loginUrl).toHaveBeenCalledWith("/back");
  });
});
