import { cva, type VariantProps } from "class-variance-authority";

/**
 * VarianceHeatmap root — a `@container` scope so the matrix adapts to its panel
 * width, not the viewport. When the columns exceed the available width the
 * inner scroll wrapper takes over (overflow-x) instead of the layout breaking.
 */
export const varianceHeatmapVariants = cva("@container w-full min-w-0");

/**
 * A single matrix cell's diverging color scale. Two orthogonal axes:
 *   - `sign`      — direction of the value (`negative` / `neutral` / `positive`)
 *   - `intensity` — magnitude bucket 1..4, normalized across the matrix
 *
 * Negative values tint toward `destructive`, positive toward emerald, and
 * near-zero toward `muted`. Color is never the sole signal: every cell also
 * renders its value as text and carries a per-cell accessible label — the tints
 * stay light so the foreground digits keep contrast in light and dark themes.
 */
export const varianceHeatmapCellVariants = cva(
  "transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      sign: {
        negative: "text-foreground",
        neutral: "bg-muted/40 text-muted-foreground",
        positive: "text-foreground",
      },
      intensity: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
      },
    },
    compoundVariants: [
      { sign: "negative", intensity: "1", class: "bg-destructive/10" },
      { sign: "negative", intensity: "2", class: "bg-destructive/20" },
      { sign: "negative", intensity: "3", class: "bg-destructive/35" },
      { sign: "negative", intensity: "4", class: "bg-destructive/50" },
      { sign: "positive", intensity: "1", class: "bg-emerald-500/10" },
      { sign: "positive", intensity: "2", class: "bg-emerald-500/20" },
      { sign: "positive", intensity: "3", class: "bg-emerald-500/35" },
      { sign: "positive", intensity: "4", class: "bg-emerald-500/50" },
    ],
    defaultVariants: {
      sign: "neutral",
      intensity: "1",
    },
  },
);

/** Direction of a cell's value on the diverging scale. */
export type VarianceHeatmapCellSign = NonNullable<
  VariantProps<typeof varianceHeatmapCellVariants>["sign"]
>;

/** Magnitude bucket (1..4) of a cell on the diverging scale. */
export type VarianceHeatmapCellIntensity = NonNullable<
  VariantProps<typeof varianceHeatmapCellVariants>["intensity"]
>;
