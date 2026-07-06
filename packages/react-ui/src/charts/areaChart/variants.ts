import { cva } from "class-variance-authority";

/**
 * Base container classes for the area chart. Thin by design — the chart itself
 * is a Recharts wrapper and styles its internals via theme classes/CSS vars.
 */
export const areaChartVariants = cva("w-full");
