import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OperationalDashboard, operationalDashboardVariants } from "./index";

afterEach(cleanup);

describe("OperationalDashboard", () => {
  it("renders both the primary and secondary slots", () => {
    render(
      <OperationalDashboard
        ariaLabel="Overview"
        primary={<span>Primary panel</span>}
        secondary={<span>Secondary panel</span>}
      />,
    );

    expect(screen.getByText("Primary panel")).toBeTruthy();
    expect(screen.getByText("Secondary panel")).toBeTruthy();
  });

  it("exposes an accessible region named by ariaLabel", () => {
    render(<OperationalDashboard ariaLabel="Operations" primary={<span>Content</span>} />);

    expect(screen.getByRole("region", { name: "Operations" })).toBeTruthy();
  });

  it("spans the primary full width and renders no secondary when it is omitted", () => {
    render(<OperationalDashboard ariaLabel="Overview" primary={<span>Primary only</span>} />);

    const primaryWrapper = screen.getByText("Primary only").parentElement as HTMLElement;
    expect(primaryWrapper.className).toContain("col-span-full");
    // The region has exactly one column wrapper — no empty secondary slot.
    const region = screen.getByRole("region", { name: "Overview" });
    expect(region.children).toHaveLength(1);
  });

  it("applies the container-scoped ratio grid variant inside an @container scope", () => {
    render(
      <OperationalDashboard
        ariaLabel="Overview"
        ratio="primary"
        primary={<span>Primary</span>}
        secondary={<span>Secondary</span>}
      />,
    );

    const region = screen.getByRole("region", { name: "Overview" });
    expect(region.className).toContain("@xl:grid-cols-[2fr_1fr]");
    expect((region.parentElement as HTMLElement).className).toContain("@container");
  });

  it("maps each ratio to a distinct wide-container template", () => {
    expect(operationalDashboardVariants({ ratio: "balanced" })).toContain("@xl:grid-cols-2");
    expect(operationalDashboardVariants({ ratio: "primary" })).toContain("@xl:grid-cols-[2fr_1fr]");
    expect(operationalDashboardVariants({ ratio: "secondary" })).toContain(
      "@xl:grid-cols-[1fr_2fr]",
    );
  });
});
