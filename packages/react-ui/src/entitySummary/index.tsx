/**
 * EntitySummary — a structured label/value fact surface for detail headers
 * (record overviews, account facts, run metadata …). Semantic `<dl>` markup:
 * each item is a `<dt>` label and a `<dd>` value that accepts arbitrary nodes
 * (badges, links, formatted numbers/dates/money).
 *
 * Domain-neutral: no field names are baked in. Responsive by container query —
 * the grid steps from one column up to `columns` as its own panel widens, so a
 * summary in a narrow sidebar and one in a wide page share the same component.
 */
import type { ReactNode } from "react";
import { Dd, Div, Dl, Dt } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  entitySummaryGridVariants,
  entitySummaryItemVariants,
  entitySummaryVariants,
  type EntitySummaryColumns,
  type EntitySummaryDensity,
} from "./variants";

export * from "./variants";

export type EntitySummaryItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  /** Span the full grid width — for long values or free text. */
  full?: boolean;
};

export type EntitySummaryProps = {
  items: readonly EntitySummaryItem[];
  /** Maximum columns at the widest container. Defaults to 2. */
  columns?: EntitySummaryColumns;
  density?: EntitySummaryDensity;
  ariaLabel?: string;
};

export function EntitySummary({
  items,
  columns = 2,
  density = "comfortable",
  ariaLabel,
}: EntitySummaryProps) {
  return (
    <Div className={cn(entitySummaryVariants())}>
      <Dl aria-label={ariaLabel} className={cn(entitySummaryGridVariants({ columns, density }))}>
        {items.map((item) => (
          <Div
            key={item.id}
            className={cn(entitySummaryItemVariants({ full: item.full ?? false }))}
          >
            <Dt>
              <Text as="span" size="sm" tone="muted">
                {item.label}
              </Text>
            </Dt>
            {/* A div-hosted dd: values may be block-level nodes. */}
            <Dd>
              <Text
                as="div"
                size="sm"
                tone="default"
                weight="medium"
                className="min-w-0 break-words"
              >
                {item.value}
              </Text>
            </Dd>
          </Div>
        ))}
      </Dl>
    </Div>
  );
}
