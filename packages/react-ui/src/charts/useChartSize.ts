import { useBreakpoint } from "../lib/useBreakpoint";
import { chartHeights, type ChartSize } from "./chartConfig";

/** Resolve a ChartSize to a pixel height. The `"responsive"` size returns sm on mobile, md on desktop. */
export function useChartHeight(size: ChartSize): number {
  const bp = useBreakpoint();

  if (size === "responsive") {
    return bp.below("md") ? chartHeights.sm : chartHeights.md;
  }

  return chartHeights[size];
}
