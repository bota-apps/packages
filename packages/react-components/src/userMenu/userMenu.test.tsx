import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider, type AuthClient, type AuthState } from "@bota-apps/auth-client";
import { OrgSwitcherMenu } from "../orgSwitcherMenu";
import { UserMenu } from "./index";

// A stable snapshot object — useSyncExternalStore requires getState to return
// a cached value, not a fresh object per call.
const authenticated: AuthState = {
  status: "authenticated",
  user: { id: "u1", name: "Jane Doe", email: "jane@example.com" },
};

const unauthenticated: AuthState = { status: "unauthenticated", user: undefined };

function stubAuthClient(state: AuthState): AuthClient {
  return {
    getState: () => state,
    subscribe: () => () => {},
    ensureReady: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    switchOrganization: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: () => state.status === "authenticated",
    requireSession: () => Promise.resolve(),
    loginUrl: () => "https://auth.example.com/bff/login",
  };
}

describe("UserMenu", () => {
  it("renders nothing without a session", () => {
    const { container } = render(
      <AuthProvider client={stubAuthClient(unauthenticated)}>
        <UserMenu />
      </AuthProvider>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows the identity and runs a custom sign-out", async () => {
    const onSignOut = vi.fn();
    render(
      <AuthProvider client={stubAuthClient(authenticated)}>
        <UserMenu onSignOut={onSignOut} />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(await screen.findByRole("menu")).toBeTruthy();

    await userEvent.click(screen.getByRole("menuitem", { name: /Sign out/ }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("hosts the organization switcher and reports the selected organization", async () => {
    const onSelect = vi.fn();
    const organizations = [
      { id: "org1", name: "Current Org" },
      { id: "org2", name: "Other Org" },
    ];
    render(
      <AuthProvider client={stubAuthClient(authenticated)}>
        <UserMenu>
          <OrgSwitcherMenu
            organizations={organizations}
            currentOrganizationId="org1"
            onSelect={onSelect}
          />
        </UserMenu>
      </AuthProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Account" }));
    const otherOrg = await screen.findByRole("menuitem", { name: /Other Org/ });
    // The current organization is not offered.
    expect(screen.queryByRole("menuitem", { name: /Current Org/ })).toBeNull();

    await userEvent.click(otherOrg);
    expect(onSelect).toHaveBeenCalledWith(organizations[1]);
  });
});
