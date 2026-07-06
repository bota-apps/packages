import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Home } from "lucide-react";
import { SidebarNavLink, navLinkVariants, sidebarNavLinkClass } from "./index";

afterEach(cleanup);

describe("SidebarNavLink", () => {
  it("renders icon, label, and suffix", () => {
    const { container } = render(
      <a href="#home">
        <SidebarNavLink icon={Home} label="Home" suffix={<span>3</span>} />
      </a>,
    );

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("de-emphasises nested labels via treeLevel", () => {
    render(
      <a href="#reports">
        <SidebarNavLink label="Reports" treeLevel={2} />
      </a>,
    );

    const label = screen.getByText("Reports");
    expect(label.className).toContain("text-xs");
    expect(label.className).toContain("text-muted-foreground/70");
  });

  it("re-exports the nav-link variants from html/a", () => {
    expect(navLinkVariants({ navVariant: "main", active: true })).toContain("text-primary");
    expect(sidebarNavLinkClass("sidebar")).toContain("group");
    expect(sidebarNavLinkClass("main", true)).toContain("after:scale-x-100");
  });
});
