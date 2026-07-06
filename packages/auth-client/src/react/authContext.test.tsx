import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { AuthClient, AuthState } from "@bota-apps/types/auth";
import { AuthProvider, useAuth } from "./authContext";

// A stable snapshot object — useSyncExternalStore requires getState to return
// a cached value, not a fresh object per call.
const authState: AuthState = {
  status: "authenticated",
  user: { id: "u1", name: "Test User", email: "test@example.com" },
};

function stubClient(): AuthClient {
  return {
    getState: () => authState,
    subscribe: () => () => {},
    ensureReady: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    switchOrganization: vi.fn().mockResolvedValue(undefined),
    logout: () => Promise.resolve(),
    isAuthenticated: () => true,
    requireSession: () => Promise.resolve(),
    loginUrl: () => "/login",
  };
}

describe("useAuth", () => {
  it("exposes the auth state and the session helpers, including switchOrganization", async () => {
    const client = stubClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider client={client}>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.status).toBe("authenticated");
    expect(result.current.user?.name).toBe("Test User");

    await result.current.switchOrganization("org2");
    expect(client.switchOrganization).toHaveBeenCalledWith("org2");
  });

  it("throws outside an AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow("within an AuthProvider");
  });
});
