import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimatedNumber } from "./index";

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

function stubIntersectionObserver() {
  const callbacks: IntersectionCallback[] = [];
  class ControllableObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    constructor(callback: IntersectionCallback) {
      callbacks.push(callback);
    }
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", ControllableObserver);
  return {
    intersect() {
      for (const callback of callbacks) {
        callback([{ isIntersecting: true }]);
      }
    },
  };
}

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

function visibleValue(container: HTMLElement): string {
  const spans = container.querySelectorAll('[aria-hidden="true"]');
  // [0] is the invisible sizer, [1] is the painted value.
  return spans[1].textContent ?? "";
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AnimatedNumber", () => {
  it("always exposes the final formatted value to assistive technology", () => {
    stubIntersectionObserver();
    const { container } = render(<AnimatedNumber value={1234} />);
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly?.textContent).toBe("1,234");
    // The sizer reserves the final width even before the tween starts.
    expect(container.querySelector(".invisible")?.textContent).toBe("1,234");
  });

  it("snaps to the final value for reduced-motion users", () => {
    stubReducedMotion(true);
    const io = stubIntersectionObserver();
    const { container } = render(<AnimatedNumber value={250} />);
    act(() => {
      io.intersect();
    });
    expect(visibleValue(container)).toBe("250");
  });

  it("counts up to the value after entering the viewport", async () => {
    const io = stubIntersectionObserver();
    const { container } = render(<AnimatedNumber value={100} durationMs={40} />);
    expect(visibleValue(container)).toBe("0");
    act(() => {
      io.intersect();
    });
    await waitFor(() => {
      expect(visibleValue(container)).toBe("100");
    });
  });

  it("applies a custom format to frames and the accessible value", async () => {
    const io = stubIntersectionObserver();
    const { container } = render(
      <AnimatedNumber value={42} durationMs={40} format={(v) => `${Math.round(v)}+`} />,
    );
    act(() => {
      io.intersect();
    });
    await waitFor(() => {
      expect(visibleValue(container)).toBe("42+");
    });
    expect(container.querySelector(".sr-only")?.textContent).toBe("42+");
  });

  it("tweens to a new value from the settled one", async () => {
    const io = stubIntersectionObserver();
    const { container, rerender } = render(<AnimatedNumber value={10} durationMs={40} />);
    act(() => {
      io.intersect();
    });
    await waitFor(() => {
      expect(visibleValue(container)).toBe("10");
    });
    rerender(<AnimatedNumber value={20} durationMs={40} />);
    await waitFor(() => {
      expect(visibleValue(container)).toBe("20");
    });
  });
});
