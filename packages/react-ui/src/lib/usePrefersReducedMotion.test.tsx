import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ChangeListener = (event: MediaQueryListEvent) => void;

function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeListener>();
  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_type: string, listener: ChangeListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: ChangeListener) => {
      listeners.delete(listener);
    },
    dispatchEvent: () => false,
  };
  vi.stubGlobal("matchMedia", () => mql);
  return {
    setMatches(matches: boolean) {
      mql.matches = matches;
      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("usePrefersReducedMotion", () => {
  it("returns false when the media query does not match", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when reduce is preferred at mount", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("tracks preference changes", () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    act(() => {
      media.setMatches(true);
    });
    expect(result.current).toBe(true);
  });
});
