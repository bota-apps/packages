/**
 * VarianceHeatmap — a matrix of numeric variance values (rows × columns)
 * rendered as an accessible semantic table with a diverging color scale.
 *
 * Deliberately a `<table>`, not a canvas/SVG chart: a table is smaller, prints
 * cleanly, and is natively navigable by assistive technology (row/column header
 * association via `scope`). Callers supply the axes and a cell accessor; the
 * component knows no domain — cells are just signed numbers.
 *
 * Accessibility:
 *   - semantic `<table>` with `scope="col"` / `scope="row"` headers
 *   - color is never the only signal: every cell shows its value as text and
 *     carries a per-cell `aria-label` ("<row>, <col>: <value>")
 *   - a legend explains the diverging scale (below / near / above baseline)
 *   - empty cells announce "no data"
 *
 * Responsive: the root is a `@container` scope and the table lives in a scroll
 * wrapper, so narrow containers scroll horizontally rather than break layout.
 *
 * Motion: cell color changes transition on the token duration and collapse to
 * instant under `prefers-reduced-motion`.
 */
import type { ReactNode } from "react";
import {
  CaptionEl,
  Div,
  TableEl,
  TableScrollContainerEl,
  TbodyEl,
  TdEl,
  TheadEl,
  ThEl,
  TrEl,
} from "../../html";
import { Text } from "../../html/typography";
import { StatusLegend, type StatusLegendItem } from "../../statusLegend";
import { cn } from "../../lib/utils";
import {
  varianceHeatmapCellVariants,
  varianceHeatmapVariants,
  type VarianceHeatmapCellIntensity,
  type VarianceHeatmapCellSign,
} from "./variants";

export * from "./variants";

/** A single matrix cell. `value` drives both the color scale and the shown text. */
export type HeatmapCell = {
  value: number;
  /** Overrides the shown text (the numeric value is still used for color + aria). */
  label?: ReactNode;
};

/** A row or column axis entry. */
export type VarianceHeatmapHeader = {
  id: string;
  label: ReactNode;
  /** Plain-text name for aria-labels; falls back to `label` when it is a string, else `id`. */
  ariaLabel?: string;
};

export type VarianceHeatmapLegendLabels = {
  negative: ReactNode;
  neutral: ReactNode;
  positive: ReactNode;
};

export type VarianceHeatmapProps = {
  rows: readonly VarianceHeatmapHeader[];
  columns: readonly VarianceHeatmapHeader[];
  /** Returns the cell for a (rowId, colId) pair, or `undefined` for an empty cell. */
  getCell: (rowId: string, colId: string) => HeatmapCell | undefined;
  /** Formats a value for display + aria. Defaults to a signed integer (`+12` / `−4` / `0`). */
  valueFormatter?: (value: number) => string;
  /** Maps a raw value to a 0..1 magnitude for the color scale. Defaults to |value| / max|value|. */
  getIntensity?: (value: number) => number;
  /** Accessible name for the table. */
  ariaLabel?: string;
  /** Visible `<caption>` below the table. */
  caption?: ReactNode;
  /** Corner (top-left) header cell content; visually hidden by default. */
  cornerLabel?: ReactNode;
  /** Shown in cells with no data. Defaults to an em dash. */
  emptyLabel?: ReactNode;
  /** Builds a cell's aria-label. Default: "<row>, <col>: <formatted>". */
  cellAriaLabel?: (args: {
    row: VarianceHeatmapHeader;
    column: VarianceHeatmapHeader;
    rowText: string;
    colText: string;
    value: number;
    formatted: string;
  }) => string;
  /** Render the diverging-scale legend. Defaults to `true`. */
  showLegend?: boolean;
  /** English by default; override to localize the legend entries. */
  legendLabels?: Partial<VarianceHeatmapLegendLabels>;
};

const defaultLegendLabels: VarianceHeatmapLegendLabels = {
  negative: "Below baseline",
  neutral: "Near baseline",
  positive: "Above baseline",
};

/** Signed integer with a real minus glyph; positive values get an explicit `+`. */
function defaultFormatValue(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  if (value < 0) {
    return `−${Math.abs(value)}`;
  }
  return "0";
}

/** Plain-text name for a header, for use inside string aria-labels. */
function headerText(header: VarianceHeatmapHeader): string {
  if (header.ariaLabel !== undefined) {
    return header.ariaLabel;
  }
  if (typeof header.label === "string") {
    return header.label;
  }
  return header.id;
}

function signOf(value: number): VarianceHeatmapCellSign {
  if (value > 0) {
    return "positive";
  }
  if (value < 0) {
    return "negative";
  }
  return "neutral";
}

function bucketOf(magnitude: number): VarianceHeatmapCellIntensity {
  const clamped = Math.min(1, Math.max(0, magnitude));
  if (clamped <= 0.25) {
    return "1";
  }
  if (clamped <= 0.5) {
    return "2";
  }
  if (clamped <= 0.75) {
    return "3";
  }
  return "4";
}

export function VarianceHeatmap({
  rows,
  columns,
  getCell,
  valueFormatter = defaultFormatValue,
  getIntensity,
  ariaLabel,
  caption,
  cornerLabel,
  emptyLabel = "—",
  cellAriaLabel,
  showLegend = true,
  legendLabels,
}: VarianceHeatmapProps) {
  // Max absolute value across the matrix — the default normalizer's denominator.
  const magnitudes: number[] = [];
  for (const row of rows) {
    for (const column of columns) {
      const cell = getCell(row.id, column.id);
      if (cell !== undefined) {
        magnitudes.push(Math.abs(cell.value));
      }
    }
  }
  const maxAbs = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;
  const intensityOf =
    getIntensity ?? ((value: number) => (maxAbs > 0 ? Math.abs(value) / maxAbs : 0));

  const buildCellAria =
    cellAriaLabel ?? (({ rowText, colText, formatted }) => `${rowText}, ${colText}: ${formatted}`);

  const emptyText = typeof emptyLabel === "string" ? emptyLabel : "No data";

  const labels: VarianceHeatmapLegendLabels = {
    negative: legendLabels?.negative ?? defaultLegendLabels.negative,
    neutral: legendLabels?.neutral ?? defaultLegendLabels.neutral,
    positive: legendLabels?.positive ?? defaultLegendLabels.positive,
  };

  const legendItems: StatusLegendItem[] = [
    { id: "below", label: labels.negative, tone: "destructive" },
    { id: "near", label: labels.neutral, tone: "muted" },
    { id: "above", label: labels.positive, tone: "success" },
  ];

  return (
    <Div className={cn(varianceHeatmapVariants(), "flex flex-col gap-3")}>
      {showLegend && (
        <StatusLegend items={legendItems} size="sm" ariaLabel="Variance color scale" />
      )}
      <TableScrollContainerEl>
        <TableEl aria-label={ariaLabel}>
          {caption !== undefined && <CaptionEl>{caption}</CaptionEl>}
          <TheadEl>
            <TrEl className="hover:bg-transparent">
              <ThEl scope="col" align="left">
                {cornerLabel !== undefined ? cornerLabel : <span className="sr-only">Row</span>}
              </ThEl>
              {columns.map((column) => (
                <ThEl key={column.id} scope="col" align="center" className="whitespace-nowrap">
                  {column.label}
                </ThEl>
              ))}
            </TrEl>
          </TheadEl>
          <TbodyEl>
            {rows.map((row) => {
              const rowText = headerText(row);
              return (
                <TrEl key={row.id} className="hover:bg-transparent">
                  <ThEl scope="row" align="left" className="whitespace-nowrap font-medium">
                    {row.label}
                  </ThEl>
                  {columns.map((column) => {
                    const colText = headerText(column);
                    const cell = getCell(row.id, column.id);
                    if (cell === undefined) {
                      return (
                        <TdEl
                          key={column.id}
                          align="center"
                          aria-label={`${rowText}, ${colText}: ${emptyText}`}
                          className="text-muted-foreground"
                        >
                          <span aria-hidden="true">{emptyLabel}</span>
                        </TdEl>
                      );
                    }
                    const formatted = valueFormatter(cell.value);
                    return (
                      <TdEl
                        key={column.id}
                        align="center"
                        aria-label={buildCellAria({
                          row,
                          column,
                          rowText,
                          colText,
                          value: cell.value,
                          formatted,
                        })}
                        className={cn(
                          varianceHeatmapCellVariants({
                            sign: signOf(cell.value),
                            intensity: bucketOf(intensityOf(cell.value)),
                          }),
                        )}
                      >
                        <Text as="span" size="sm" weight="medium" tabular aria-hidden="true">
                          {cell.label ?? formatted}
                        </Text>
                      </TdEl>
                    );
                  })}
                </TrEl>
              );
            })}
          </TbodyEl>
        </TableEl>
      </TableScrollContainerEl>
    </Div>
  );
}
