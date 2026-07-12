import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal, RevealGroup } from "./index";

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

/** Controllable IntersectionObserver stub capturing every instance. */
function stubIntersectionObserver() {
  const instances: {
    callback: IntersectionCallback;
    observed: Element[];
    disconnected: boolean;
  }[] = [];
  class ControllableObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    private readonly entry: (typeof instances)[number];
    constructor(callback: IntersectionCallback) {
      this.entry = { callback, observed: [], disconnected: false };
      instances.push(this.entry);
    }
    observe(el: Element): void {
      this.entry.observed.push(el);
    }
    unobserve(): void {}
    disconnect(): void {
      this.entry.disconnected = true;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", ControllableObserver);
  return instances;
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("arms the hidden entrance pose after mount and keeps content in the DOM", () => {
    stubIntersectionObserver();
    const { container } = render(
      <Reveal>
        <p>Section content</p>
      </Reveal>,
    );
    expect(screen.getByText("Section content")).toBeTruthy();
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("opacity-0");
    expect(wrapper?.className).toContain("translate-y-6");
    expect(wrapper?.className).toContain("duration-slow");
  });

  it("transitions to the resting state when the element intersects, once", () => {
    const observers = stubIntersectionObserver();
    const { container } = render(
      <Reveal effect="fade">
        <p>Arrives</p>
      </Reveal>,
    );
    expect(observers).toHaveLength(1);
    act(() => {
      observers[0].callback([{ isIntersecting: true }]);
    });
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("opacity-100");
    expect(wrapper?.className).not.toContain("opacity-0");
    expect(observers[0].disconnected).toBe(true);
  });

  it("never hides content when reduced motion is preferred", () => {
    stubReducedMotion(true);
    stubIntersectionObserver();
    const { container } = render(
      <Reveal>
        <p>Always visible</p>
      </Reveal>,
    );
    expect(container.firstElementChild?.className).not.toContain("opacity-0");
  });

  it("applies the stagger delay as a transition delay", () => {
    stubIntersectionObserver();
    const { container } = render(
      <Reveal delayMs={180}>
        <p>Later</p>
      </Reveal>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.getAttribute("style")).toContain("transition-delay: 180ms");
  });
});

describe("RevealGroup", () => {
  it("wraps each child with an incrementing delay and no extra container", () => {
    stubIntersectionObserver();
    const { container } = render(
      <RevealGroup intervalMs={100}>
        <p>First</p>
        <p>Second</p>
        <p>Third</p>
      </RevealGroup>,
    );
    const wrappers = [...container.children];
    expect(wrappers).toHaveLength(3);
    expect(wrappers[0].getAttribute("style")).toBeNull();
    expect(wrappers[1].getAttribute("style")).toContain("transition-delay: 100ms");
    expect(wrappers[2].getAttribute("style")).toContain("transition-delay: 200ms");
    expect(screen.getByText("Second")).toBeTruthy();
  });

  it("passes the group effect and item class to every wrapper", () => {
    stubIntersectionObserver();
    const { container } = render(
      <RevealGroup effect="zoom" itemClassName="h-full">
        <p>Card</p>
      </RevealGroup>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("scale-95");
    expect(wrapper?.className).toContain("h-full");
  });
});
