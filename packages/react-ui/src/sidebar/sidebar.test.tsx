import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  sidebarMenuButtonVariants,
} from "./index";

beforeAll(() => {
  // jsdom reports clientWidth 0; pretend we are on a desktop viewport so the
  // non-mobile sidebar renders.
  Object.defineProperty(document.documentElement, "clientWidth", {
    configurable: true,
    get: () => 1024,
  });
});

function renderSidebar(props: ComponentProps<typeof Sidebar> = {}) {
  return render(
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>,
  );
}

describe("Sidebar", () => {
  it("renders menu content inside the sidebar", () => {
    renderSidebar();
    expect(screen.getByText("Workspace")).toBeTruthy();
    const menuButton = screen.getByRole("button", { name: "Dashboard" });
    expect(menuButton.getAttribute("data-active")).toBe("true");
  });

  it("applies sidebarMenuButtonVariants classes to menu buttons", () => {
    renderSidebar();
    const menuButton = screen.getByRole("button", { name: "Dashboard" });
    expect(menuButton.className).toContain("peer/menu-button");
    expect(menuButton.className).toContain("h-8");
    expect(sidebarMenuButtonVariants({ variant: "outline" })).toContain("bg-background");
    expect(sidebarMenuButtonVariants({ size: "lg" })).toContain("h-12");
  });

  it("toggles between expanded and collapsed via the trigger", async () => {
    const user = userEvent.setup();
    const { container } = renderSidebar();

    const root = container.querySelector("[data-side]");
    expect(root?.getAttribute("data-state")).toBe("expanded");

    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(root?.getAttribute("data-state")).toBe("collapsed");

    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(root?.getAttribute("data-state")).toBe("expanded");
  });

  it("renders without the offcanvas wrapper when collapsible is none", () => {
    const { container } = renderSidebar({ collapsible: "none" });
    expect(container.querySelector("[data-side]")).not.toBeTruthy();
    expect(screen.getByText("Workspace")).toBeTruthy();
  });
});
