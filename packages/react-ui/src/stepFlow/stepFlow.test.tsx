import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepFlow, type StepFlowStep } from "./index";

const steps: StepFlowStep[] = [
  { title: "Request received", description: "The request is logged and assigned." },
  { title: "Review", description: "Details are verified.", aside: <span>Manual</span> },
  { title: "Complete", description: "The record is closed." },
];

function fakeRect(top: number, height: number): DOMRect {
  return {
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  };
}

describe("StepFlow", () => {
  it("renders an ordered list with padded numbering, titles, descriptions, and asides", () => {
    const { container } = render(<StepFlow steps={steps} />);
    const list = container.querySelector("ol");
    expect(list).toBeTruthy();
    expect(list!.children).toHaveLength(3);
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();
    expect(screen.getByText("Request received")).toBeTruthy();
    expect(screen.getByText("Details are verified.")).toBeTruthy();
    expect(screen.getByText("Manual")).toBeTruthy();
  });

  it("starts with every chip upcoming and the rail unfilled", () => {
    const { container } = render(<StepFlow steps={steps} />);
    const chips = [...container.querySelectorAll("li > [aria-hidden]")];
    for (const chip of chips) {
      expect(chip.className).toContain("bg-background");
    }
    const fill = container.querySelector('[class*="origin-top"]');
    expect(fill?.getAttribute("style")).toContain("scaleY(0)");
  });

  it("marks passed steps done and the current step active as the reading line advances", async () => {
    const { container } = render(<StepFlow steps={steps} />);
    const list = container.querySelector("ol");
    expect(list).toBeTruthy();
    const items = [...list!.children];
    // Reading line sits at 65% of the 768px jsdom viewport = 499.2px.
    list!.getBoundingClientRect = () => fakeRect(-500, 1000);
    items[0].getBoundingClientRect = () => fakeRect(-500, 300);
    items[1].getBoundingClientRect = () => fakeRect(-200, 300);
    items[2].getBoundingClientRect = () => fakeRect(600, 300);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => {
      const chips = [...container.querySelectorAll("li > [aria-hidden]")];
      expect(chips[0].className).toContain("bg-primary");
      expect(chips[1].className).toContain("bg-selected");
      expect(chips[2].className).toContain("bg-background");
    });
    const fill = container.querySelector('[class*="origin-top"]');
    expect(fill?.getAttribute("style")).toContain("scaleY(0.99");
  });
});
