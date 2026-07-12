/**
 * StatusLegend — a compact key that maps a colored swatch (with optional icon
 * for shape redundancy) to a human label. Explains the tones used by diagrams,
 * timelines, maps, and spatial scenes.
 *
 * Domain-neutral: callers supply the entries and their tones. Rendered as a
 * semantic list; color is never the only signal — every entry has a label, and
 * may carry an icon so it survives a monochrome print or color-blind viewer.
 */
import type { ReactNode } from "react";
import { Li, Span, Ul } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  statusLegendDotVariants,
  statusLegendSwatchVariants,
  statusLegendVariants,
  type StatusLegendOrientation,
  type StatusLegendTone,
} from "./variants";

export * from "./variants";

export type StatusLegendItem = {
  id: string;
  label: ReactNode;
  /** Swatch color. Defaults to `default`. */
  tone?: StatusLegendTone;
  /** Icon shown in the swatch for shape redundancy; a solid dot renders otherwise. */
  icon?: ReactNode;
};

export type StatusLegendProps = {
  items: readonly StatusLegendItem[];
  orientation?: StatusLegendOrientation;
  /** Swatch size. Defaults to `sm`. */
  size?: "sm" | "md";
  ariaLabel?: string;
};

export function StatusLegend({
  items,
  orientation = "horizontal",
  size = "sm",
  ariaLabel,
}: StatusLegendProps) {
  return (
    <Ul aria-label={ariaLabel} className={cn(statusLegendVariants({ orientation }))}>
      {items.map((item) => {
        const tone = item.tone ?? "default";
        return (
          <Li key={item.id} className="flex min-w-0 items-center gap-2">
            <Span aria-hidden="true" className={cn(statusLegendSwatchVariants({ tone, size }))}>
              {item.icon ?? <Span className={cn(statusLegendDotVariants({ tone }))} />}
            </Span>
            <Text as="span" size="sm" tone="default" className="min-w-0">
              {item.label}
            </Text>
          </Li>
        );
      })}
    </Ul>
  );
}
