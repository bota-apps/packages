/**
 * MoneyBreakdown — a financial summary surface for quotations, statements, and
 * settlements: an ordered set of label/amount rows resolving to a single grand
 * total. Optionally grouped into sections that each close with their own
 * subtotal. Amounts are supplied as preformatted nodes — the caller owns money
 * formatting (currency, locale, precision); this component never formats.
 *
 * Domain-neutral: rows carry only a label, a value node, and presentational
 * hints (emphasis, negative). It knows no currencies, entities, or business
 * rules.
 *
 * Accessibility:
 *   - semantic `<dl>` with `<dt>` labels and `<dd>` amounts, so each amount is
 *     programmatically associated with its label
 *   - the surface is a labeled `role="group"` (via `ariaLabel`)
 *   - the grand total is a distinct row (heavier rule + weight) and, being a
 *     `<dt>`/`<dd>` pair, keeps its accessible label
 *   - negative amounts are prefixed with a real minus sign (U+2212), so the
 *     sign — not color alone — signals a deduction
 *
 * Responsive: the root is a `@container` scope. Rows stack (label over value)
 * in very narrow containers and sit side by side from `@xs` up — no viewport
 * assumptions.
 *
 * Print: the `document` variant frames the surface like a printed statement and
 * reads cleanly under the `print/` utilities.
 */
import type { ReactNode } from "react";
import { Dd, Div, Dl, Dt, Span } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  moneyBreakdownLabelVariants,
  moneyBreakdownRowVariants,
  moneyBreakdownSectionTitleVariants,
  moneyBreakdownValueVariants,
  moneyBreakdownVariants,
  type MoneyBreakdownEmphasis,
  type MoneyBreakdownVariant,
} from "./variants";

export * from "./variants";

export type MoneyBreakdownLine = {
  id: string;
  label: ReactNode;
  /** Preformatted amount — the caller formats money (currency, locale, sign). */
  value: ReactNode;
  emphasis?: MoneyBreakdownEmphasis;
  /** Marks the amount as a deduction: renders a leading minus sign + tint. */
  negative?: boolean;
  /** Secondary context under the label (a note, a rate, a reference). */
  description?: ReactNode;
};

export type MoneyBreakdownSection = {
  id: string;
  title?: ReactNode;
  lines: readonly MoneyBreakdownLine[];
  /** Row closing the group; rendered with `subtotal` emphasis. */
  subtotal?: MoneyBreakdownLine;
};

export type MoneyBreakdownProps = {
  /** Flat form — a single ungrouped list of lines. */
  lines?: readonly MoneyBreakdownLine[];
  /** Grouped form — sections each optionally closing with a subtotal. */
  sections?: readonly MoneyBreakdownSection[];
  /** The grand total, rendered as the emphasized final row. */
  total: MoneyBreakdownLine;
  variant?: MoneyBreakdownVariant;
  /** Accessible name for the summary group. */
  ariaLabel?: string;
};

/** U+2212 MINUS SIGN — a true minus glyph, not a hyphen, for deducted amounts. */
const minusSign = "−";

function Row({ line, emphasis }: { line: MoneyBreakdownLine; emphasis?: MoneyBreakdownEmphasis }) {
  const resolved = emphasis ?? line.emphasis ?? "default";
  const negative = line.negative ?? false;
  return (
    <Div data-emphasis={resolved} className={cn(moneyBreakdownRowVariants({ emphasis: resolved }))}>
      <Dt className={cn(moneyBreakdownLabelVariants({ emphasis: resolved }))}>
        <Span>{line.label}</Span>
        {line.description !== undefined && (
          <Text as="span" size="sm" weight="normal" tone="muted" className="block">
            {line.description}
          </Text>
        )}
      </Dt>
      <Dd className={cn(moneyBreakdownValueVariants({ emphasis: resolved, negative }))}>
        {negative ? `${minusSign} ` : undefined}
        {line.value}
      </Dd>
    </Div>
  );
}

export function MoneyBreakdown({
  lines,
  sections,
  total,
  variant = "default",
  ariaLabel,
}: MoneyBreakdownProps) {
  return (
    <Div role="group" aria-label={ariaLabel} className={cn(moneyBreakdownVariants({ variant }))}>
      {sections !== undefined ? (
        <>
          {sections.map((section) => (
            <Div key={section.id} className="mb-3 last:mb-0">
              {section.title !== undefined && (
                <Text as="p" className={cn(moneyBreakdownSectionTitleVariants())}>
                  {section.title}
                </Text>
              )}
              <Dl className="flex flex-col">
                {section.lines.map((line) => (
                  <Row key={line.id} line={line} />
                ))}
                {section.subtotal !== undefined && (
                  <Row line={section.subtotal} emphasis="subtotal" />
                )}
              </Dl>
            </Div>
          ))}
          <Dl className="flex flex-col">
            <Row line={total} emphasis="total" />
          </Dl>
        </>
      ) : (
        <Dl className="flex flex-col">
          {(lines ?? []).map((line) => (
            <Row key={line.id} line={line} />
          ))}
          <Row line={total} emphasis="total" />
        </Dl>
      )}
    </Div>
  );
}
