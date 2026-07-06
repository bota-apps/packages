import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./index";

function renderMenu() {
  return render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#tasks">Tasks</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
  );
}

describe("NavigationMenu", () => {
  it("renders top-level items with menu semantics", () => {
    renderMenu();

    expect(screen.getByRole("navigation")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Products" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
  });

  it("opens submenu content from the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger.getAttribute("data-state")).toBe("closed");

    await user.click(trigger);
    await waitFor(() => expect(trigger.getAttribute("data-state")).toBe("open"));
    expect(screen.getByRole("link", { name: "Tasks" })).toBeTruthy();
  });

  it("applies navigationMenuTriggerStyle to triggers and styled links", () => {
    renderMenu();

    const trigger = screen.getByRole("button", { name: "Products" });
    const docsLink = screen.getByRole("link", { name: "Docs" });
    expect(navigationMenuTriggerStyle()).toContain("h-10");
    expect(trigger.className).toContain("h-10");
    expect(docsLink.className).toContain("h-10");
  });
});
