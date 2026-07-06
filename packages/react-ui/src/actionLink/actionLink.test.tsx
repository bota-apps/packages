import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PlusCircle } from "lucide-react";
import { ActionLink, actionLinkVariants } from "./index";

afterEach(cleanup);

describe("ActionLink", () => {
  it("renders the icon and label", () => {
    const { container } = render(<ActionLink icon={PlusCircle} label="Add project" />);

    const link = screen.getByText("Add project");
    expect(link.className).toContain("text-primary");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("applies the size variant classes", () => {
    render(<ActionLink label="Open report" size="lg" />);

    const link = screen.getByText("Open report");
    expect(link.className).toContain("text-base");
    expect(link.className).toContain("font-semibold");
  });

  it("re-exports actionLinkVariants from html/span", () => {
    expect(actionLinkVariants()).toContain("text-sm");
    expect(actionLinkVariants({ size: "lg" })).toContain("gap-2");
  });
});
