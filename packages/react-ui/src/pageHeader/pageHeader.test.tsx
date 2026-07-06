import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PageHeader } from "./index";

afterEach(cleanup);

describe("PageHeader", () => {
  it("renders title, description, metadata, and action", () => {
    render(
      <PageHeader
        title="Projects"
        description="Manage the projects in your workspace."
        metadata={<span>142 total</span>}
        action={<button type="button">Add project</button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Projects" })).toBeTruthy();
    expect(screen.getByText("Manage the projects in your workspace.")).toBeTruthy();
    expect(screen.getByText("142 total")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add project" })).toBeTruthy();
  });

  it("renders nothing when no content is provided", () => {
    const { container } = render(<PageHeader />);
    expect(container.firstChild).toBe(null);
  });

  it("omits the action slot when no action is given", () => {
    render(<PageHeader title="Reports" />);
    expect(screen.getByRole("heading", { name: "Reports" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBe(null);
  });
});
