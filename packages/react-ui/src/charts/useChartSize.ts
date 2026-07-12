import type { RefCallback } from "react";
import { useContainerWidth } from "../lib/useContainerWidth";
import { chartHeights, type ChartSize } from "./chartConfig";

/** Container width (px) below which a `"responsive"` chart uses the compact height. */
const compactChartContainerWidth = 480;

export type ChartHeightResult = {
  /** Attach to the chart's measuring wrapper (the element hosting ResponsiveContainer). */
  ref: RefCallback<HTMLDivElement>;
  /** Resolved chart height in px. */
  height: number;
};

/**
 * Resolve a ChartSize to a pixel height. The `"responsive"` size reacts to the
 * chart's own container width — compact in narrow panels, default otherwise —
 * never to the viewport, so a chart in a slim card stays compact on any screen.
 */
export function useChartHeight(size: ChartSize): ChartHeightResult {
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  if (size === "responsive") {
    const compact = width !== undefined && width < compactChartContainerWidth;
    return { ref, height: compact ? chartHeights.sm : chartHeights.md };
  }

  return { ref, height: chartHeights[size] };
}
