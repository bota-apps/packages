import { cleanup, render, screen, within } from "@testing-library/react";
import { Check } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusLegend, type StatusLegendItem } from "./index";

afterEach(cleanup);

const items: StatusLegendItem[] = [
  { id: "complete", label: "Complete", tone: "primary", icon: <Check aria-hidden /> },
  { id: "pending", label: "Pending", tone: "warning" },
  { id: "issue", label: "Issue", tone: "destructive" },
];

describe("StatusLegend", () => {
  it("renders entries as an accessible list", () => {
    render(<StatusLegend items={items} ariaLabel="Status key" />);

    const list = screen.getByRole("list", { name: "Status key" });
    const entries = within(list).getAllByRole("listitem");
    expect(entries).toHaveLength(3);
    expect(screen.getByText("Complete")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
    expect(screen.getByText("Issue")).toBeTruthy();
  });

  it("applies the tone swatch classes", () => {
    render(<StatusLegend items={items} />);

    const swatch = screen.getByText("Pending").previousSibling as HTMLElement;
    expect(swatch.className).toContain("bg-amber-500/15");
  });

  it("stacks vertically when requested", () => {
    render(<StatusLegend items={items} orientation="vertical" ariaLabel="Key" />);

    expect(screen.getByRole("list", { name: "Key" }).className).toContain("flex-col");
  });
});
