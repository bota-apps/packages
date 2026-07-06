import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateRangeInput, dateRangeInputTriggerVariants } from "./index";

describe("DateRangeInput", () => {
  it("shows the placeholder when no range is set", () => {
    render(<DateRangeInput startValue="" endValue="" onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    expect(trigger.textContent).toContain("Pick date range");
    expect(trigger.className).toContain("w-full");
    expect(trigger.className).toContain("text-muted-foreground");
  });

  it("shows the formatted range when both dates are set", () => {
    render(<DateRangeInput startValue="2026-07-01" endValue="2026-07-15" onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    expect(trigger.textContent).not.toContain("Pick date range");
    expect(trigger.className).not.toContain("text-muted-foreground");
  });

  it("opens a calendar and reports the picked start date as ISO", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangeInput startValue="" endValue="" onChange={onChange} />);

    await user.click(screen.getByRole("button"));
    const grid = await screen.findByRole("grid");
    expect(grid).toBeTruthy();

    await user.click(screen.getAllByRole("button", { name: /15/ })[0]);
    expect(onChange).toHaveBeenCalledTimes(1);
    // A single click in range mode selects a one-day range (from === to).
    const [start, end] = onChange.mock.calls[0] as [string, string];
    expect(start).toMatch(/^\d{4}-\d{2}-15$/);
    expect(end).toBe(start);
  });

  it("applies the auto width variant", () => {
    render(<DateRangeInput startValue="" endValue="" onChange={() => {}} width="auto" />);
    expect(screen.getByRole("button").className).toContain("min-w-[12rem]");
    expect(dateRangeInputTriggerVariants({ width: "auto" })).toContain("flex-1");
  });
});
