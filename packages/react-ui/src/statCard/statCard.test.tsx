import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Users } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StatCard } from "./index";

afterEach(cleanup);

describe("StatCard", () => {
  it("renders label, numeric value, and description", () => {
    render(<StatCard label="Projects" value={42} icon={Users} description="Active projects" />);
    expect(screen.getByText("Projects")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("Active projects")).toBeTruthy();
  });

  it("applies variant, tone, and size classes from statCardVariants", () => {
    const { container } = render(
      <StatCard label="Active" value={7} variant="outlined" tone="success" size="sm" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-l-[3px]");
    expect(root.className).toContain("border-l-emerald-500");
    expect(root.className).toContain("p-2");
  });

  it("becomes an interactive button when onClick is set, firing on click and Enter", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<StatCard label="Pending" value={3} onClick={onClick} />);
    const card = screen.getByRole("button");
    expect(card.className).toContain("cursor-pointer");
    await user.click(card);
    card.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("renders the trailing chart slot when provided", () => {
    render(<StatCard label="Trend" value={42} chart={<span data-testid="trend-chart" />} />);
    expect(screen.getByTestId("trend-chart")).toBeTruthy();
  });

  it("hides the chart slot in containers too narrow to fit it", () => {
    const { container } = render(
      <StatCard label="Trend" value={42} chart={<span data-testid="trend-chart" />} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("@container");
    const chartHost = screen.getByTestId("trend-chart").parentElement as HTMLElement;
    expect(chartHost.className).toContain("hidden");
    expect(chartHost.className).toContain("@[19rem]:block");
  });
});
