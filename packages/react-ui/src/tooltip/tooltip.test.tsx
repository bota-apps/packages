import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./index";

// Hover interactions are unreliable in jsdom, so render the tooltip open.
function renderOpenTooltip(props: { className?: string } = {}) {
  return render(
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent data-testid="tooltip-content" {...props}>
          Explains the action.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("Tooltip", () => {
  it("renders content with tooltip semantics when open", () => {
    renderOpenTooltip();

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toBe("Explains the action.");
    // The trigger is described by the tooltip for assistive tech.
    const trigger = screen.getByRole("button", { name: "Hover me" });
    expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("applies the content variant classes and merges className", () => {
    renderOpenTooltip({ className: "max-w-40" });

    // getByRole("tooltip") returns Radix's visually hidden a11y duplicate, so
    // target the styled content element directly.
    const content = screen.getByTestId("tooltip-content");
    expect(content.className).toContain("bg-primary");
    expect(content.className).toContain("rounded-md");
    expect(content.className).toContain("max-w-40");
  });
});
