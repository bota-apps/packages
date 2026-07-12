import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useContainerWidth } from "./useContainerWidth";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Probe() {
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="probe">
      {width === undefined ? "unmeasured" : `width:${width}`}
    </div>
  );
}

describe("useContainerWidth", () => {
  it("reports the element's measured width", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ width: 420, height: 100 }),
    );
    render(<Probe />);
    expect(screen.getByTestId("probe").textContent).toBe("width:420");
  });

  it("stays unmeasured when the element reports zero width (jsdom, detached nodes)", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe").textContent).toBe("unmeasured");
  });
});
