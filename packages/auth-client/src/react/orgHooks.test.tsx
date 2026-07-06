import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import type { AuthClient, AuthState, SessionUser } from "@bota-apps/types/auth";
import { AuthProvider } from "./authContext";
import { useCurrentOrganization, useSwitchOrganization } from "./orgHooks";

type TestOrg = { id: string; name: string };
type TestUser = SessionUser & { currentOrg?: TestOrg | null };

const org: TestOrg = { id: "org1", name: "Bota Coffee" };

const baseUser: TestUser = {
  id: "u1",
  name: "Test User",
  email: "test@example.com",
};

function fakeClient(state: AuthState<TestUser>): AuthClient<TestUser> {
  return {
    getState: () => state,
    subscribe: () => () => {},
    ensureReady: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue(undefined),
    switchOrganization: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: () => state.status === "authenticated",
    requireSession: vi.fn().mockResolvedValue(undefined),
    loginUrl: () => "https://auth.example.com/login",
  };
}

function wrapperFor(client: AuthClient<TestUser>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthProvider client={client}>{children}</AuthProvider>;
  };
}

describe("useCurrentOrganization", () => {
  it("returns the authenticated user's active organization", () => {
    const client = fakeClient({ status: "authenticated", user: { ...baseUser, currentOrg: org } });
    const { result } = renderHook(() => useCurrentOrganization(), {
      wrapper: wrapperFor(client),
    });
    expect(result.current).toEqual(org);
  });

  it("throws when the session is unauthenticated", () => {
    const client = fakeClient({ status: "unauthenticated", user: undefined });
    expect(() =>
      renderHook(() => useCurrentOrganization(), { wrapper: wrapperFor(client) }),
    ).toThrow(
      "useCurrentOrganization requires an authenticated session with an active organization",
    );
  });

  it("throws when the authenticated user has no organization", () => {
    const client = fakeClient({ status: "authenticated", user: { ...baseUser, currentOrg: null } });
    expect(() =>
      renderHook(() => useCurrentOrganization(), { wrapper: wrapperFor(client) }),
    ).toThrow(
      "useCurrentOrganization requires an authenticated session with an active organization",
    );
  });
});

describe("useSwitchOrganization", () => {
  it("forwards to the client's switchOrganization", async () => {
    const client = fakeClient({ status: "authenticated", user: { ...baseUser, currentOrg: org } });
    const { result } = renderHook(() => useSwitchOrganization(), {
      wrapper: wrapperFor(client),
    });

    await result.current("org2");
    expect(client.switchOrganization).toHaveBeenCalledWith("org2");
  });

  it("keeps a stable callback identity across re-renders", () => {
    const client = fakeClient({ status: "authenticated", user: { ...baseUser, currentOrg: org } });
    const { result, rerender } = renderHook(() => useSwitchOrganization(), {
      wrapper: wrapperFor(client),
    });

    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
