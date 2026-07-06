import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@bota-apps/react-ui";
import { OrgSwitcherMenu, type OrgSwitcherOrganization } from "./index";

// The menu renders Radix menu items, so tests host it in a plain DropdownMenu.
function renderInMenu(menu: ReactElement) {
  return render(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{menu}</DropdownMenuContent>
    </DropdownMenu>,
  );
}

const organizations: OrgSwitcherOrganization[] = [
  { id: "org1", name: "Alpha" },
  { id: "org2", name: "Beta" },
];

describe("OrgSwitcherMenu", () => {
  it("offers the other organizations and the create action", async () => {
    const onSelect = vi.fn();
    const onCreate = vi.fn();
    renderInMenu(
      <OrgSwitcherMenu
        organizations={organizations}
        currentOrganizationId="org1"
        onSelect={onSelect}
        onCreate={onCreate}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Organizations")).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: /Alpha/ })).toBeNull();

    await userEvent.click(screen.getByRole("menuitem", { name: /Beta/ }));
    expect(onSelect).toHaveBeenCalledWith(organizations[1]);
  });

  it("renders nothing when there is nowhere to switch and nothing to create", async () => {
    renderInMenu(
      <OrgSwitcherMenu
        organizations={[organizations[0]]}
        currentOrganizationId="org1"
        onSelect={() => {}}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("menu")).toBeTruthy();
    expect(screen.queryByText("Organizations")).toBeNull();
  });
});
