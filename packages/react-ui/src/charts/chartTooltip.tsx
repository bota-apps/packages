/**
 * Shared tooltip component for all chart types.
 * Uses the same layout primitives and theme tokens as the rest of react-ui.
 */
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Stack } from "../html/layout";
import { Text } from "../html/typography";

export function ChartTooltipContent({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Stack
      gap="xs"
      as="div"
      className="rounded-[var(--radius)] border border-border bg-popover px-3 py-2 text-popover-foreground shadow-overlay"
    >
      {label !== undefined && (
        <Text size="sm" weight="medium">
          {label}
        </Text>
      )}
      {payload.map((entry) => (
        <span key={String(entry.name)} className="inline-flex items-center gap-1.5 text-xs">
          <span
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <Text as="span" size="sm" tone="muted">
            {entry.name}:
          </Text>
          <Text as="span" size="sm" weight="semibold">
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </Text>
        </span>
      ))}
    </Stack>
  );
}
