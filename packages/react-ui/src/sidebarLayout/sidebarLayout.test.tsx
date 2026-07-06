import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SidebarLayout } from "./index";

afterEach(cleanup);

describe("SidebarLayout", () => {
  it("renders the brand above the navigation", () => {
    render(
      <SidebarLayout
        brand={<span>Acme</span>}
        nav={
          <>
            <a href="#dashboard">Dashboard</a>
            <a href="#tasks">Tasks</a>
          </>
        }
      />,
    );

    expect(screen.getByText("Acme")).toBeTruthy();
    const nav = screen.getByRole("navigation");
    expect(nav.textContent).toContain("Dashboard");
    expect(nav.textContent).toContain("Tasks");
    // sidebar nav variant provides spacing/layout classes
    expect(nav.className).toContain("flex-1");
  });
});
