/**
 * Chart legend — replaces Recharts' default legend with themed primitives.
 * Used automatically by chart components when `showLegend` is true.
 */
import { Inline } from "../html/layout";
import { Text } from "../html/typography";
import { chartColorByIndex, type ChartDataEntry } from "./chartConfig";

type ChartLegendProps = {
  items: Pick<ChartDataEntry, "label" | "color">[];
};

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <Inline gap="md" justify="center" wrap>
      {items.map((item, i) => (
        <Inline key={item.label} gap="xs">
          <span
            className="mt-0.5 inline-block size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: chartColorByIndex(item.color ? item.color - 1 : i) }}
          />
          <Text as="span" size="sm" tone="muted">
            {item.label}
          </Text>
        </Inline>
      ))}
    </Inline>
  );
}
