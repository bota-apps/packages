import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TabNav, tabNavLinkClass, tabNavLinkVariants } from "./index";

afterEach(cleanup);

describe("TabNav", () => {
  it("renders links inside a tab-bar navigation", () => {
    render(
      <TabNav>
        <a href="#overview" className={tabNavLinkClass(true)}>
          Overview
        </a>
        <a href="#projects" className={tabNavLinkClass()}>
          Projects
        </a>
      </TabNav>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("bg-muted");
    expect(screen.getByRole("link", { name: "Overview" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Projects" })).toBeTruthy();
  });

  it("applies the active variant classes to the selected link", () => {
    render(
      <TabNav>
        <a href="#overview" className={tabNavLinkClass(true)}>
          Overview
        </a>
        <a href="#projects" className={tabNavLinkClass()}>
          Projects
        </a>
      </TabNav>,
    );

    const active = screen.getByRole("link", { name: "Overview" });
    const inactive = screen.getByRole("link", { name: "Projects" });
    expect(active.className).toContain("bg-background");
    expect(active.className).toContain("shadow");
    expect(inactive.className).not.toContain("shadow");
  });

  it("re-exports the tab-nav link variants from html/nav", () => {
    expect(tabNavLinkVariants({ active: true })).toBe(tabNavLinkClass(true));
    expect(tabNavLinkVariants()).toContain("hover:bg-background/50");
  });
});
