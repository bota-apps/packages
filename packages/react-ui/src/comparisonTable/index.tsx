/**
 * ComparisonTable — a domain-neutral, typed-generic component for comparing a
 * bounded set of candidate options across labeled attributes. Options are the
 * columns; attributes are the rows. It knows nothing about the option type `T`,
 * fetches nothing, and owns no routes — data comes in via `columns`/`rows` and
 * selection goes out via `onSelectColumn` (router-neutral).
 *
 * Each column can carry `states` (recommended / lowest / highest / selected /
 * unavailable). State is never color-only: every state renders a Badge with a
 * text label and an icon, and selection carries `aria-pressed`. Recommended and
 * selected columns are additionally emphasized with a tint + accent border.
 *
 * Accessibility:
 *   - semantic `<table>` with `scope="col"` option headers and `scope="row"`
 *     attribute headers
 *   - selection is a real `<button>` per column (keyboard-operable, `aria-pressed`)
 *   - `unavailable` options disable their select button
 *
 * Responsive: the root is a `@container` scope. From `@xl` up the table shows;
 * below it, the table hides and one stacked card per option is shown instead
 * (label/value description lists), so no component assumes it owns the viewport.
 *
 * Motion: tint/border transitions run on the token duration and collapse to
 * instant under `prefers-reduced-motion`. No JS-driven animation.
 */
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Ban, Check, Sparkles } from "lucide-react";
import { TableEl, TheadEl, TbodyEl, TrEl, ThEl, TdEl } from "../html";
import { Div, Span } from "../html";
import { Dl, Dt, Dd } from "../html/dl";
import { Text } from "../html/typography";
import { focusRingClasses, pressableClasses } from "../html/interaction";
import { Badge } from "../badge";
import { cn } from "../lib/utils";
import {
  comparisonBodyCellVariants,
  comparisonCardVariants,
  comparisonHeadCellVariants,
  comparisonStateBadgeVariant,
  comparisonStateDefaultLabels,
  comparisonTableVariants,
  type ComparisonColumnEmphasis,
  type ComparisonState,
} from "./variants";

export * from "./variants";

export type ComparisonColumn<T> = {
  id: string;
  option: T;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Markers for this option; drives badges and column emphasis. */
  states?: readonly ComparisonState[];
};

export type ComparisonRow<T> = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Renders this attribute's value for a given option. */
  render: (option: T) => ReactNode;
};

export type ComparisonTableProps<T> = {
  columns: readonly ComparisonColumn<T>[];
  rows: readonly ComparisonRow<T>[];
  /** The chosen option; adds the `selected` state + `aria-pressed` semantics. */
  selectedColumnId?: string;
  /** When provided, each column header renders a keyboard-operable select button. */
  onSelectColumn?: (id: string) => void;
  /** Accessible name for the comparison. */
  ariaLabel?: string;
  /** English by default; override to localize the state badge labels. */
  stateLabels?: Partial<Record<ComparisonState, string>>;
  /** Select-button label for an unselected option. Defaults to "Select". */
  selectLabel?: string;
  /** Select-button label for the selected option. Defaults to "Selected". */
  selectedLabel?: string;
};

/** Fixed display order so badges read consistently across columns. */
const stateOrder: readonly ComparisonState[] = [
  "recommended",
  "lowest",
  "highest",
  "selected",
  "unavailable",
];

function stateIcon(state: ComparisonState): ReactNode {
  if (state === "recommended") {
    return <Sparkles aria-hidden className="size-3.5" />;
  }
  if (state === "lowest") {
    return <ArrowDown aria-hidden className="size-3.5" />;
  }
  if (state === "highest") {
    return <ArrowUp aria-hidden className="size-3.5" />;
  }
  if (state === "selected") {
    return <Check aria-hidden className="size-3.5" />;
  }
  return <Ban aria-hidden className="size-3.5" />;
}

type ColumnMeta = {
  states: ComparisonState[];
  emphasis: ComparisonColumnEmphasis;
  selected: boolean;
  unavailable: boolean;
};

function resolveColumnMeta<T>(column: ComparisonColumn<T>, selectedColumnId?: string): ColumnMeta {
  const raw = new Set<ComparisonState>(column.states ?? []);
  const selected = raw.has("selected") || column.id === selectedColumnId;
  if (selected) {
    raw.add("selected");
  }
  const unavailable = raw.has("unavailable");
  const emphasis: ComparisonColumnEmphasis = selected
    ? "selected"
    : raw.has("recommended")
      ? "recommended"
      : "none";
  const states = stateOrder.filter((state) => raw.has(state));
  return { states, emphasis, selected, unavailable };
}

function StateBadges({
  states,
  labels,
}: {
  states: ComparisonState[];
  labels: Record<ComparisonState, string>;
}) {
  if (states.length === 0) {
    return undefined;
  }
  return (
    <Div layout="row" className="flex-wrap gap-1.5">
      {states.map((state) => (
        <Badge key={state} variant={comparisonStateBadgeVariant[state]} className="gap-1">
          {stateIcon(state)}
          {labels[state]}
        </Badge>
      ))}
    </Div>
  );
}

function SelectButton({
  columnId,
  meta,
  onSelectColumn,
  selectLabel,
  selectedLabel,
}: {
  columnId: string;
  meta: ColumnMeta;
  onSelectColumn: (id: string) => void;
  selectLabel: string;
  selectedLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectColumn(columnId)}
      aria-pressed={meta.selected}
      disabled={meta.unavailable}
      className={cn(
        "inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium",
        focusRingClasses,
        pressableClasses,
        meta.selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {meta.selected ? <Check aria-hidden className="size-4" /> : undefined}
      {meta.selected ? selectedLabel : selectLabel}
    </button>
  );
}

function ColumnHeading<T>({
  column,
  meta,
  labels,
  onSelectColumn,
  selectLabel,
  selectedLabel,
}: {
  column: ComparisonColumn<T>;
  meta: ColumnMeta;
  labels: Record<ComparisonState, string>;
  onSelectColumn?: (id: string) => void;
  selectLabel: string;
  selectedLabel: string;
}) {
  return (
    <Div layout="col" className="min-w-0 items-start gap-1.5">
      <Text as="div" size="md" weight="semibold" tone="default" className="min-w-0">
        {column.title}
      </Text>
      {column.subtitle !== undefined && (
        <Text as="div" size="sm" tone="muted">
          {column.subtitle}
        </Text>
      )}
      <StateBadges states={meta.states} labels={labels} />
      {onSelectColumn !== undefined && (
        <SelectButton
          columnId={column.id}
          meta={meta}
          onSelectColumn={onSelectColumn}
          selectLabel={selectLabel}
          selectedLabel={selectedLabel}
        />
      )}
    </Div>
  );
}

export function ComparisonTable<T>({
  columns,
  rows,
  selectedColumnId,
  onSelectColumn,
  ariaLabel,
  stateLabels,
  selectLabel = "Select",
  selectedLabel = "Selected",
}: ComparisonTableProps<T>) {
  const labels = {
    recommended: stateLabels?.recommended ?? comparisonStateDefaultLabels.recommended,
    lowest: stateLabels?.lowest ?? comparisonStateDefaultLabels.lowest,
    highest: stateLabels?.highest ?? comparisonStateDefaultLabels.highest,
    selected: stateLabels?.selected ?? comparisonStateDefaultLabels.selected,
    unavailable: stateLabels?.unavailable ?? comparisonStateDefaultLabels.unavailable,
  } satisfies Record<ComparisonState, string>;

  const metaById = new Map<string, ColumnMeta>(
    columns.map((column) => [column.id, resolveColumnMeta(column, selectedColumnId)]),
  );

  const metaOf = (id: string): ColumnMeta => {
    const meta = metaById.get(id);
    if (meta === undefined) {
      throw new Error(`ComparisonTable: missing column meta for "${id}"`);
    }
    return meta;
  };

  return (
    <Div className={cn(comparisonTableVariants())}>
      {/* Wide layout: side-by-side table (from @xl up). */}
      <Div className="hidden overflow-x-auto @xl:block">
        <TableEl aria-label={ariaLabel}>
          <TheadEl>
            <TrEl className="hover:bg-transparent">
              <ThEl scope="col" className="align-bottom">
                <Span className="sr-only">Attribute</Span>
              </ThEl>
              {columns.map((column) => {
                const meta = metaOf(column.id);
                return (
                  <ThEl
                    key={column.id}
                    scope="col"
                    className={cn(
                      "min-w-40",
                      comparisonHeadCellVariants({
                        emphasis: meta.emphasis,
                        unavailable: meta.unavailable,
                      }),
                    )}
                  >
                    <ColumnHeading
                      column={column}
                      meta={meta}
                      labels={labels}
                      onSelectColumn={onSelectColumn}
                      selectLabel={selectLabel}
                      selectedLabel={selectedLabel}
                    />
                  </ThEl>
                );
              })}
            </TrEl>
          </TheadEl>
          <TbodyEl>
            {rows.map((row) => (
              <TrEl key={row.id} className="hover:bg-transparent">
                <ThEl scope="row" className="align-top text-foreground">
                  <Text as="div" size="sm" weight="medium" tone="default">
                    {row.label}
                  </Text>
                  {row.description !== undefined && (
                    <Text as="div" size="sm" tone="muted">
                      {row.description}
                    </Text>
                  )}
                </ThEl>
                {columns.map((column) => {
                  const meta = metaOf(column.id);
                  return (
                    <TdEl
                      key={column.id}
                      className={cn(
                        comparisonBodyCellVariants({
                          emphasis: meta.emphasis,
                          unavailable: meta.unavailable,
                        }),
                      )}
                    >
                      {row.render(column.option)}
                    </TdEl>
                  );
                })}
              </TrEl>
            ))}
          </TbodyEl>
        </TableEl>
      </Div>

      {/* Narrow layout: one stacked card per option (below @xl). */}
      <Div role="group" aria-label={ariaLabel} className="grid gap-3 @xl:hidden">
        {columns.map((column) => {
          const meta = metaOf(column.id);
          return (
            <Div
              key={column.id}
              className={cn(
                comparisonCardVariants({
                  emphasis: meta.emphasis,
                  unavailable: meta.unavailable,
                }),
              )}
            >
              <ColumnHeading
                column={column}
                meta={meta}
                labels={labels}
                onSelectColumn={onSelectColumn}
                selectLabel={selectLabel}
                selectedLabel={selectedLabel}
              />
              <Dl className="mt-3 flex flex-col gap-2">
                {rows.map((row) => (
                  <Div key={row.id} layout="col" className="gap-0.5">
                    <Dt className="text-sm font-medium text-foreground">{row.label}</Dt>
                    <Dd className="text-sm text-muted-foreground">{row.render(column.option)}</Dd>
                  </Div>
                ))}
              </Dl>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}
