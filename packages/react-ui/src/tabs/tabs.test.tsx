import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from "./index";

afterEach(cleanup);

function renderTabs() {
  return render(
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel.</TabsContent>
      <TabsContent value="activity">Activity panel.</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("renders a tablist and shows the default tab's panel", () => {
    renderTabs();

    expect(screen.getByRole("tablist")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Overview", selected: true })).toBeTruthy();
    expect(screen.getByText("Overview panel.")).toBeTruthy();
    expect(screen.queryByText("Activity panel.")).not.toBeTruthy();
  });

  it("switches panels when another tab is activated", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Activity" }));

    expect(screen.getByRole("tab", { name: "Activity", selected: true })).toBeTruthy();
    expect(screen.getByText("Activity panel.")).toBeTruthy();
    expect(screen.queryByText("Overview panel.")).not.toBeTruthy();
  });

  it("applies the tabs variants classes", () => {
    renderTabs();

    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("bg-muted");
    expect(tablist.className).toBe(tabsListVariants());

    const trigger = screen.getByRole("tab", { name: "Overview" });
    expect(trigger.className).toContain("data-[state=active]:bg-background");
  });
});
