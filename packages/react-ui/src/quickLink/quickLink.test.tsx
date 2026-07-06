import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FileText } from "lucide-react";
import { QuickLink, QuickLinkGrid, quickLinkGridVariants, tileVariants } from "./index";

afterEach(cleanup);

describe("QuickLink", () => {
  it("renders label, description, and suffix on a tile surface", () => {
    render(
      <QuickLink
        icon={FileText}
        label="Projects"
        description="Create, organize, and track projects"
        suffix={<span>12</span>}
      />,
    );
    expect(screen.getByText("Projects")).toBeTruthy();
    expect(screen.getByText("Create, organize, and track projects")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
  });

  it("applies row layout by default and grid layout for the grid variant", () => {
    const { rerender } = render(<QuickLink icon={FileText} label="Reports" className="probe" />);
    const tile = screen.getByText("Reports").closest(".probe") as HTMLElement;
    expect(tile.className).toContain("py-4");
    expect(tile.className).not.toContain("flex-col");

    rerender(<QuickLink icon={FileText} label="Reports" variant="grid" className="probe" />);
    const gridTile = screen.getByText("Reports").closest(".probe") as HTMLElement;
    expect(gridTile.className).toContain("flex-col");
    expect(tileVariants({ layout: "grid" })).toContain("items-start");
  });

  it("renders QuickLinkGrid with the columns variant and merges className", () => {
    render(
      <QuickLinkGrid columns={2} className="extra">
        <span>Tile</span>
      </QuickLinkGrid>,
    );
    const grid = screen.getByText("Tile").parentElement as HTMLElement;
    expect(grid.className).toContain("sm:grid-cols-2");
    expect(grid.className).toContain("extra");
    expect(quickLinkGridVariants({ columns: 4 })).toContain("lg:grid-cols-4");
  });
});
