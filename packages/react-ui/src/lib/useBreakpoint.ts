import { useEffect, useMemo, useState } from "react";

/**
 * Named breakpoints matching Tailwind's default scale.
 *
 * - `xs`:  0–639 px  (phones)
 * - `sm`:  640–767 px (large phones / small tablets)
 * - `md`:  768–1023 px (tablets)
 * - `lg`:  1024–1279 px (desktops)
 * - `xl`:  1280 px+ (large desktops)
 */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

type ThresholdBreakpoint = Exclude<Breakpoint, "xs">;

const thresholds: [ThresholdBreakpoint, number][] = [
  ["sm", 640],
  ["md", 768],
  ["lg", 1024],
  ["xl", 1280],
];

const ordered: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

function resolveFromWidth(width: number): Breakpoint {
  let bp: Breakpoint = "xs";
  for (const [name, px] of thresholds) {
    if (width >= px) {
      bp = name;
    }
  }
  return bp;
}

function getWidth(): number {
  if (typeof document === "undefined") {
    return 1024;
  }
  return document.documentElement.clientWidth;
}

export type BreakpointResult = {
  /** Current breakpoint name. */
  current: Breakpoint;
  /** True when the viewport is narrower than the given breakpoint. */
  below(bp: ThresholdBreakpoint): boolean;
  /** True when the viewport is at or wider than the given breakpoint (same as Tailwind `md:`, `lg:`, etc.). */
  above(bp: ThresholdBreakpoint): boolean;
};

/**
 * Reactive breakpoint hook — updates when the viewport crosses a Tailwind breakpoint boundary.
 *
 * Uses ResizeObserver on `<html>` so it responds to DevTools responsive mode,
 * iframe resizing, and regular window resize.
 *
 * ```ts
 * const bp = useBreakpoint();
 * bp.current    // "md"
 * bp.below("md") // true when viewport < 768px
 * bp.above("lg") // true when viewport >= 1024px
 * ```
 */
export function useBreakpoint(): BreakpointResult {
  const [current, setCurrent] = useState<Breakpoint>(() => resolveFromWidth(getWidth()));

  useEffect(() => {
    const update = () => setCurrent(resolveFromWidth(getWidth()));

    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);

    // Also listen to window resize as a fallback
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const currentIndex = ordered.indexOf(current);

  return useMemo(
    (): BreakpointResult => ({
      current,
      below: (bp) => currentIndex < ordered.indexOf(bp),
      above: (bp) => currentIndex >= ordered.indexOf(bp),
    }),
    [current, currentIndex],
  );
}
