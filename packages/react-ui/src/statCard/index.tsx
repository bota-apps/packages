import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Money } from "@bota-apps/types";
import { Heading } from "../html/typography";
import { Text } from "../html/typography";
import { CurrencyText } from "../currencyText";
import { NumericText } from "../numericText";
import {
  statCardIconVariants,
  statCardVariants,
  type StatCardSize,
  type StatCardTone,
  type StatCardVariant,
} from "./variants";

function isMoney(v: unknown): v is Money {
  return typeof v === "object" && v !== null && "amount" in v && "currency" in v;
}

type StatCardProps = {
  label: string;
  value: string | number | Money;
  isCurrency?: boolean;
  icon?: LucideIcon;
  tone?: StatCardTone;
  /** Visual style. `outlined` = left border accent. `filled` = tinted background. */
  variant?: StatCardVariant;
  /** Card density. `sm` = compact for dense grids. `lg` = hero stats. */
  size?: StatCardSize;
  description?: string;
  /**
   * Optional trailing visual (e.g. a `Sparkline` from the `./charts`
   * subpath). A slot, not a data prop, so the core bundle never pulls the
   * charting runtime.
   */
  chart?: ReactNode;
  onClick?: () => void;
};

// Icon glyph sizing tracks the card density; applied to the SVG itself.
const iconSvgClasses: Record<StatCardSize, string> = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
};

const chevron = (
  <div className="shrink-0 text-muted-foreground/40">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export function StatCard({
  label,
  value,
  isCurrency,
  icon: Icon,
  tone = "default",
  variant = "default",
  size = "default",
  description,
  chart,
  onClick,
}: StatCardProps) {
  const interactive = onClick !== undefined;

  return (
    <div
      className={statCardVariants({ variant, tone, size, interactive })}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {Icon && (
        <div className={statCardIconVariants({ tone, size })}>
          <Icon className={iconSvgClasses[size]} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Text size="sm" tone="muted" truncate>
          {label}
        </Text>
        {isCurrency && isMoney(value) ? (
          <CurrencyText size={size === "lg" ? "xl" : "lg"} value={value} />
        ) : typeof value === "number" ? (
          <NumericText
            variant="count"
            size={size === "sm" ? "lg" : "xl"}
            weight="bold"
            value={value}
          />
        ) : typeof value === "string" ? (
          <Heading as="p" size={size === "sm" ? "sm" : "lg"}>
            {value}
          </Heading>
        ) : null}
        {description && (
          <Text size="sm" tone="muted" truncate>
            {description}
          </Text>
        )}
      </div>
      {chart && <div className="shrink-0">{chart}</div>}
      {interactive && chevron}
    </div>
  );
}

export * from "./variants";
