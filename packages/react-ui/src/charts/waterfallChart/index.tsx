import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ReferenceLine,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Stack } from "../../html/layout";
import { Text } from "../../html/typography";
import { Div, TableEl, TheadEl, TbodyEl, TrEl, ThEl, TdEl, CaptionEl } from "../../html";
import {
  chartColor,
  chartColors,
  formatChartValue,
  type ChartColorToken,
  type ChartSize,
} from "../chartConfig";
import { useChartHeight } from "../useChartSize";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { waterfallChartVariants } from "./variants";

export * from "./variants";

/** A single step in the waterfall. `value` is signed: positive rises, negative falls. */
export type WaterfallDatum = {
  id: string;
  label: string;
  /** Signed step magnitude. For a `"total"` step this is the absolute pillar height. */
  value: number;
  /** `"delta"` (default) is a signed step; `"total"` is an absolute pillar from zero. */
  kind?: "delta" | "total";
};

export type WaterfallChartProps = {
  data: readonly WaterfallDatum[];
  /** Inject a value formatter (money, units …). Defaults to `formatChartValue`. */
  valueFormatter?: (value: number) => string;
  /** Size preset — controls chart height (mirrors the sibling charts' convention). */
  size?: ChartSize;
  /** `"standard"` shows per-bar value labels; `"compact"` drops them for tight panels. */
  variant?: "standard" | "compact";
  /** Accessible name for the chart image and the data-table caption. */
  ariaLabel?: string;
  /** Render the accessible data table visibly instead of screen-reader-only. */
  showDataTable?: boolean;
};

type WaterfallDirection = "increase" | "decrease" | "total";

/** A computed row: the signed step plus its resolved geometry, color, and running total. */
type WaterfallRow = {
  id: string;
  label: string;
  kind: "delta" | "total";
  direction: WaterfallDirection;
  /** Signed original value. */
  value: number;
  /** Cumulative total after this step. */
  runningTotal: number;
  /** `[start, end]` y-range the floating bar spans — Recharts renders the tuple. */
  span: [number, number];
  /** Resolved theme color for this bar. */
  fill: string;
  /** Pre-formatted, signed value shown on the bar label, tooltip, and table. */
  labelText: string;
};

const directionColorToken: Record<WaterfallDirection, ChartColorToken> = {
  increase: chartColors.success,
  decrease: chartColors.rose,
  total: chartColors.primary,
};

const directionLabels: Record<WaterfallDirection, string> = {
  increase: "Increase",
  decrease: "Decrease",
  total: "Total",
};

/** Format a signed value with an explicit leading sign for deltas. */
function formatSignedValue(
  value: number,
  direction: WaterfallDirection,
  format: (value: number) => string,
): string {
  if (direction === "total") {
    return format(value);
  }
  const magnitude = format(Math.abs(value));
  return direction === "increase" ? `+${magnitude}` : `-${magnitude}`;
}

/**
 * Fold the signed steps into positioned rows. `"total"` steps reset the running
 * total to their own value (a pillar from zero); `"delta"` steps float from the
 * current running total to the next.
 */
function computeWaterfallRows(
  data: readonly WaterfallDatum[],
  format: (value: number) => string,
): WaterfallRow[] {
  const rows: WaterfallRow[] = [];
  let running = 0;

  for (const datum of data) {
    const kind = datum.kind ?? "delta";
    let start: number;
    let end: number;
    let direction: WaterfallDirection;

    if (kind === "total") {
      start = 0;
      end = datum.value;
      running = datum.value;
      direction = "total";
    } else {
      start = running;
      end = running + datum.value;
      running = end;
      direction = datum.value >= 0 ? "increase" : "decrease";
    }

    rows.push({
      id: datum.id,
      label: datum.label,
      kind,
      direction,
      value: datum.value,
      runningTotal: running,
      span: [start, end],
      fill: chartColor(directionColorToken[direction]),
      labelText: formatSignedValue(datum.value, direction, format),
    });
  }

  return rows;
}

function isWaterfallRow(value: unknown): value is WaterfallRow {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "label" in value &&
    "direction" in value &&
    "runningTotal" in value &&
    "labelText" in value &&
    "fill" in value
  );
}

type WaterfallTooltipProps = TooltipProps<ValueType, NameType> & {
  valueFormatter: (value: number) => string;
};

/**
 * Themed tooltip mirroring `ChartTooltipContent`'s popover, but surfaced per
 * step: it names the direction and shows the signed value so increases and
 * decreases stay distinguishable without relying on color alone.
 */
function WaterfallTooltipContent({ active, payload, valueFormatter }: WaterfallTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const row = payload[0]?.payload;
  if (!isWaterfallRow(row)) {
    return null;
  }

  return (
    <Stack
      gap="xs"
      as="div"
      className="rounded-[var(--radius)] border border-border bg-popover px-3 py-2 text-popover-foreground shadow-overlay"
    >
      <Text size="sm" weight="medium">
        {row.label}
      </Text>
      <span className="inline-flex items-center gap-1.5 text-xs">
        <span className="inline-block size-2 rounded-full" style={{ backgroundColor: row.fill }} />
        <Text as="span" size="sm" tone="muted">
          {directionLabels[row.direction]}:
        </Text>
        <Text as="span" size="sm" weight="semibold">
          {row.labelText}
        </Text>
      </span>
      <Text as="span" size="sm" tone="muted">
        Running total: {valueFormatter(row.runningTotal)}
      </Text>
    </Stack>
  );
}

type WaterfallDataTableProps = {
  rows: WaterfallRow[];
  valueFormatter: (value: number) => string;
  caption: string;
  visible: boolean;
};

/**
 * The required accessible alternative: every step listed with its direction,
 * signed value, and running total. Screen-reader-only by default; the `visible`
 * flag renders it inline for sighted users who prefer the tabular view.
 */
function WaterfallDataTable({ rows, valueFormatter, caption, visible }: WaterfallDataTableProps) {
  return (
    <Div className={visible ? undefined : "sr-only"}>
      <TableEl>
        <CaptionEl>{caption}</CaptionEl>
        <TheadEl>
          <TrEl>
            <ThEl scope="col">Step</ThEl>
            <ThEl scope="col">Change</ThEl>
            <ThEl scope="col" align="right">
              Running total
            </ThEl>
          </TrEl>
        </TheadEl>
        <TbodyEl>
          {rows.map((row) => (
            <TrEl key={row.id}>
              <TdEl>{row.label}</TdEl>
              <TdEl>{`${directionLabels[row.direction]} ${row.labelText}`}</TdEl>
              <TdEl align="right">{valueFormatter(row.runningTotal)}</TdEl>
            </TrEl>
          ))}
        </TbodyEl>
      </TableEl>
    </Div>
  );
}

/**
 * Waterfall chart — explains how a starting value becomes an ending value via a
 * sequence of signed steps. Each floating bar spans from the prior running total
 * to the next; `"total"` steps are absolute pillars from zero. Increases and
 * decreases are colored from theme tokens but are always disambiguated by the
 * per-bar value sign, the tooltip direction label, and the accessible table.
 */
export function WaterfallChart({
  data,
  valueFormatter = formatChartValue,
  size = "md",
  variant = "standard",
  ariaLabel,
  showDataTable = false,
}: WaterfallChartProps) {
  const { ref: sizeRef, height } = useChartHeight(size);
  const reducedMotion = usePrefersReducedMotion();
  const rows = computeWaterfallRows(data, valueFormatter);
  const isCompact = variant === "compact";
  const label = ariaLabel ?? "Waterfall chart";

  const spanValues = rows.flatMap((row) => row.span);
  const domainMin = Math.min(0, ...spanValues);
  const domainMax = Math.max(0, ...spanValues);

  return (
    <Stack gap="sm" className={waterfallChartVariants({ variant })}>
      <Div ref={sizeRef} role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={rows}
            margin={{ top: isCompact ? 8 : 24, right: 8, bottom: 8, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="label"
              interval={0}
              tick={{ fontSize: isCompact ? 10 : 12 }}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[domainMin, domainMax]}
              width={isCompact ? 44 : 56}
              tick={{ fontSize: isCompact ? 10 : 12 }}
              tickFormatter={valueFormatter}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={0} className="stroke-border" />
            <Tooltip content={<WaterfallTooltipContent valueFormatter={valueFormatter} />} />
            <Bar dataKey="span" isAnimationActive={!reducedMotion} radius={[3, 3, 3, 3]}>
              {rows.map((row) => (
                <Cell key={row.id} fill={row.fill} />
              ))}
              {!isCompact && (
                <LabelList
                  dataKey="labelText"
                  position="top"
                  className="fill-muted-foreground text-xs"
                />
              )}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </Div>
      <WaterfallDataTable
        rows={rows}
        valueFormatter={valueFormatter}
        caption={label}
        visible={showDataTable}
      />
    </Stack>
  );
}
