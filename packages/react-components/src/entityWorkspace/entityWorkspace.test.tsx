import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntityWorkspace, type EntityWorkspaceTab } from "./index";

afterEach(cleanup);

const tabs: EntityWorkspaceTab[] = [
  { id: "overview", label: "Overview", content: <p>Overview panel</p> },
  { id: "items", label: "Items", content: <p>Items panel</p> },
  { id: "activity", label: "Activity", content: <p>Activity panel</p> },
];

describe("EntityWorkspace", () => {
  it("renders the header title, subtitle, status, and actions", () => {
    render(
      <EntityWorkspace
        title="Record REF-1042"
        subtitle="Stage A → Stage C"
        status={<span>Active</span>}
        actions={<button type="button">Submit</button>}
        tabs={tabs}
      />,
    );

    expect(screen.getByRole("heading", { name: "Record REF-1042" })).toBeTruthy();
    expect(screen.getByText("Stage A → Stage C")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });

  it("renders a tab per entry and shows the first tab by default", () => {
    render(<EntityWorkspace title="Record" tabs={tabs} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByText("Overview panel")).toBeTruthy();
    expect(screen.queryByText("Items panel")).toBeNull();
  });

  it("switches tabs on activation when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<EntityWorkspace title="Record" tabs={tabs} />);

    await user.click(screen.getByRole("tab", { name: "Items" }));
    expect(screen.getByText("Items panel")).toBeTruthy();
    expect(screen.queryByText("Overview panel")).toBeNull();
  });

  it("respects a controlled activeTab and reports changes", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <EntityWorkspace title="Record" tabs={tabs} activeTab="activity" onTabChange={onTabChange} />,
    );

    expect(screen.getByText("Activity panel")).toBeTruthy();
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    expect(onTabChange).toHaveBeenCalledWith("overview");
    // Controlled: the panel does not change until the parent updates activeTab.
    expect(screen.getByText("Activity panel")).toBeTruthy();
  });

  it("honors a defaultTab when uncontrolled", () => {
    render(<EntityWorkspace title="Record" tabs={tabs} defaultTab="items" />);

    expect(screen.getByText("Items panel")).toBeTruthy();
  });
});
