import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Calendar, calendarVariants } from "./index";

afterEach(cleanup);

describe("Calendar", () => {
  it("renders a month grid with weekday headers", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 6, 1)} />);
    expect(screen.getByRole("grid")).toBeTruthy();
    expect(screen.getByText("July 2026")).toBeTruthy();
    expect(screen.getByText("Mo")).toBeTruthy();
  });

  it("selects a day in single mode", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={new Date(2026, 6, 1)} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /15(th|.*July)/i }));
    expect(onSelect).toHaveBeenCalled();
    const selected = onSelect.mock.calls[0][0] as Date;
    expect(selected.getDate()).toBe(15);
    expect(selected.getMonth()).toBe(6);
  });

  it("applies the base variant class and merges className", () => {
    const { container } = render(
      <Calendar mode="single" className="custom-class" defaultMonth={new Date(2026, 6, 1)} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("custom-class");
    expect(root.className).toContain("p-3");
    expect(calendarVariants()).toBe("p-3");
  });
});
