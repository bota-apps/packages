import { describe, expect, it, vi } from "vitest";
import type { SessionEndpoint, SessionUser } from "@bota-apps/types/auth";
import { createAuthStore } from "./authStore";
import { defaultSessionPaths } from "./sessionEndpoint";

// The user schema is API-owned: the store is generic over any type satisfying
// the SessionUser constraint. This test type carries API-only fields (role,
// organization) to prove they flow through untouched.
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

const userInOrgTwo: User = { ...user, role: "viewer", organization: orgTwo };

function fakeEndpoint(getUser: SessionEndpoint<User>["getUser"]): SessionEndpoint<User> {
  return {
    getUser,
    logout: vi.fn().mockResolvedValue(undefined),
    switchOrganization: vi.fn().mockResolvedValue(undefined),
    paths: defaultSessionPaths,
  };
}

describe("createAuthStore", () => {
  it("resolves an authenticated session and caches the resolution", async () => {
    const getUser = vi.fn().mockResolvedValue(user);
    const store = createAuthStore(fakeEndpoint(getUser));

    await store.ensureReady();
    await store.ensureReady();

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(store.getState()).toEqual({ status: "authenticated", user });
    expect(store.isAuthenticated()).toBe(true);
  });

  it("treats a 401 (undefined user) as unauthenticated", async () => {
    const store = createAuthStore(fakeEndpoint(vi.fn().mockResolvedValue(undefined)));
    await store.ensureReady();
    expect(store.getState().status).toBe("unauthenticated");
  });

  it("reports a network failure as 'error', not 'unauthenticated'", async () => {
    const boom = new Error("network down");
    const store = createAuthStore(fakeEndpoint(vi.fn().mockRejectedValue(boom)));
    await store.ensureReady();
    const state = store.getState();
    if (state.status !== "error") {
      throw new Error(`expected error state, got "${state.status}"`);
    }
    expect(state.error).toBe(boom);
    expect(store.isAuthenticated()).toBe(false);
  });

  it("retries after a failed resolution instead of caching the failure", async () => {
    const getUser = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(user);
    const store = createAuthStore(fakeEndpoint(getUser));

    await store.ensureReady();
    expect(store.getState().status).toBe("error");

    await store.ensureReady();
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(store.getState().status).toBe("authenticated");
  });

  it("re-resolves the session after logout", async () => {
    const getUser = vi.fn().mockResolvedValue(user);
    const store = createAuthStore(fakeEndpoint(getUser));

    await store.ensureReady();
    await store.logout();
    expect(store.getState().status).toBe("unauthenticated");

    await store.ensureReady();
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(store.getState().status).toBe("authenticated");
  });

  it("refresh() drops the cache and re-resolves", async () => {
    const getUser = vi.fn().mockResolvedValueOnce(user).mockResolvedValueOnce(undefined);
    const store = createAuthStore(fakeEndpoint(getUser));

    await store.ensureReady();
    expect(store.getState().status).toBe("authenticated");

    await store.refresh();
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(store.getState().status).toBe("unauthenticated");
  });

  it("marks unauthenticated even when the logout request itself fails", async () => {
    const endpoint = fakeEndpoint(vi.fn().mockResolvedValue(user));
    endpoint.logout = vi.fn().mockRejectedValue(new Error("500"));
    const store = createAuthStore(endpoint);

    await store.ensureReady();
    await expect(store.logout()).rejects.toThrow("500");
    expect(store.getState().status).toBe("unauthenticated");
  });

  it("ignores a stale resolution that lands after logout()", async () => {
    let resolveGetUser: (value: User | undefined) => void = () => {};
    const getUser = vi.fn().mockImplementation(
      () =>
        new Promise<User | undefined>((resolve) => {
          resolveGetUser = resolve;
        }),
    );
    const store = createAuthStore(fakeEndpoint(getUser));

    const pending = store.ensureReady();
    await store.logout();
    expect(store.getState().status).toBe("unauthenticated");

    // The pre-logout request resolves late with a user — it must not
    // re-authenticate the store.
    resolveGetUser(user);
    await pending;
    expect(store.getState().status).toBe("unauthenticated");
    expect(store.isAuthenticated()).toBe(false);
  });

  it("lets refresh() supersede a slower in-flight resolution", async () => {
    const resolvers: Array<(value: User | undefined) => void> = [];
    const getUser = vi.fn().mockImplementation(
      () =>
        new Promise<User | undefined>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const store = createAuthStore(fakeEndpoint(getUser));

    const slow = store.ensureReady();
    const fast = store.refresh();

    // The newer request answers first: no session.
    resolvers[1](undefined);
    await fast;
    expect(store.getState().status).toBe("unauthenticated");

    // The superseded request answers late with a user — stale, ignored.
    resolvers[0](user);
    await slow;
    expect(store.getState().status).toBe("unauthenticated");
  });

  it("keeps a newer refresh()'s cached promise when a superseded resolution fails", async () => {
    let rejectSlow: (err: Error) => void = () => {};
    const getUser = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<User | undefined>((_resolve, reject) => {
            rejectSlow = reject;
          }),
      )
      .mockResolvedValueOnce(user);
    const store = createAuthStore(fakeEndpoint(getUser));

    const slow = store.ensureReady();
    const fresh = store.refresh();
    await fresh;
    expect(store.getState().status).toBe("authenticated");

    // The stale failure must neither surface as an error state nor clear the
    // newer cached resolution.
    rejectSlow(new Error("superseded request failed"));
    await slow;
    expect(store.getState().status).toBe("authenticated");

    await store.ensureReady();
    expect(getUser).toHaveBeenCalledTimes(2);
  });

  it("switchOrganization re-targets the endpoint then re-resolves the user", async () => {
    const getUser = vi.fn().mockResolvedValueOnce(user).mockResolvedValueOnce(userInOrgTwo);
    const endpoint = fakeEndpoint(getUser);
    const store = createAuthStore(endpoint);

    await store.ensureReady();
    await store.switchOrganization("org2");

    expect(endpoint.switchOrganization).toHaveBeenCalledWith("org2");
    const state = store.getState();
    if (state.status !== "authenticated") {
      throw new Error(`expected authenticated state, got "${state.status}"`);
    }
    expect(state.user.organization).toEqual(orgTwo);
    expect(state.user.role).toBe("viewer");
  });

  it("keeps the current state when the switch request fails", async () => {
    const endpoint = fakeEndpoint(vi.fn().mockResolvedValue(user));
    endpoint.switchOrganization = vi.fn().mockRejectedValue(new Error("403"));
    const store = createAuthStore(endpoint);

    await store.ensureReady();
    await expect(store.switchOrganization("org2")).rejects.toThrow("403");
    expect(store.getState()).toEqual({ status: "authenticated", user });
  });

  it("ignores a stale resolution that lands after switchOrganization()", async () => {
    const resolvers: Array<(value: User | undefined) => void> = [];
    const getUser = vi.fn().mockImplementation(
      () =>
        new Promise<User | undefined>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const store = createAuthStore(fakeEndpoint(getUser));

    const pending = store.ensureReady();
    const switched = store.switchOrganization("org2");

    // The post-switch re-resolution is issued after the (awaited) switch call.
    await vi.waitFor(() => {
      expect(resolvers).toHaveLength(2);
    });

    // The post-switch request answers with the new-org user.
    resolvers[1](userInOrgTwo);
    await switched;

    // The pre-switch request answers late with the old-org user — stale, ignored.
    resolvers[0](user);
    await pending;
    const state = store.getState();
    expect(state.user?.organization).toEqual(orgTwo);
  });

  it("notifies subscribers on every transition", async () => {
    const store = createAuthStore(fakeEndpoint(vi.fn().mockResolvedValue(user)));
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    await store.ensureReady();
    expect(listener).toHaveBeenCalledTimes(2); // loading + authenticated

    unsubscribe();
    await store.refresh();
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
