import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Stepper, stepperLineVariants, stepperVariants, type StepperStep } from "./index";

afterEach(cleanup);

const steps: StepperStep[] = [
  { key: "account", state: "done", content: "1", label: "Account" },
  { key: "profile", state: "active", content: "2", label: "Profile", description: "In progress" },
  { key: "review", state: "upcoming", content: "3", label: "Review" },
];

describe("Stepper", () => {
  it("renders every step label and description", () => {
    render(<Stepper steps={steps} />);

    expect(screen.getByText("Account")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("In progress")).toBeTruthy();
    expect(screen.getByText("Review")).toBeTruthy();
  });

  it("applies the maxWidth variant to the container-query root", () => {
    const { container } = render(<Stepper steps={steps} maxWidth="md" />);

    const root = container.firstElementChild;
    expect(root?.className).toContain("@container");
    expect(root?.className).toContain("max-w-md");
    expect(stepperVariants({ maxWidth: "xl" })).toContain("max-w-xl");
  });

  it("renders the compact active-step summary for narrow containers", () => {
    render(<Stepper steps={steps} />);

    const summary = screen.getByText("Step 2 of 3 — Profile");
    expect(summary.className).toContain("@2xl:hidden");
  });

  it("hides per-step labels below the compact container threshold", () => {
    render(<Stepper steps={steps} />);

    const label = screen.getByText("Account");
    expect((label.parentElement as HTMLElement).className).toContain("hidden @2xl:flex");
  });

  it("colors connector lines to match each step's state", () => {
    const { container } = render(<Stepper steps={steps} />);

    expect(stepperLineVariants({ state: "done" })).toContain("bg-primary/40");
    expect(stepperLineVariants({ state: "upcoming" })).toContain("bg-border");
    // 3 steps -> 4 line segments; the upcoming step contributes a muted one.
    const lines = container.querySelectorAll('[class*="h-0.5"]');
    expect(lines.length).toBe(4);
    const muted = container.querySelectorAll('[class*="bg-border"]');
    expect(muted.length).toBe(1);
  });

  it("makes bubbles clickable when onStepClick is provided", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} onStepClick={onStepClick} />);

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(onStepClick).toHaveBeenCalledWith("profile");
  });
});
