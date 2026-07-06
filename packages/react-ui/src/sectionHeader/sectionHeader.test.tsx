import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SectionHeader } from "./index";

afterEach(cleanup);

describe("SectionHeader", () => {
  it("renders the title as a heading with optional description", () => {
    render(<SectionHeader title="Team members" description="People in this department." />);
    expect(screen.getByRole("heading", { level: 2, name: "Team members" })).toBeTruthy();
    expect(screen.getByText("People in this department.")).toBeTruthy();
  });

  it("renders actions when provided", () => {
    render(
      <SectionHeader
        title="Documents"
        actions={[
          <button key="upload" type="button">
            Upload
          </button>,
          <button key="export" type="button">
            Export
          </button>,
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
  });

  it("omits the actions container when the list is empty", () => {
    render(<SectionHeader title="Documents" />);
    expect(screen.queryByRole("button")).toBe(null);
  });
});
