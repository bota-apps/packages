import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Money } from "@bota-apps/types";
import { Heading } from "../html/typography";
import { Text } from "../html/typography";
import { IconBadgeEl, type IconBadgeSize, type IconBadgeTone } from "../html";
import { CurrencyText } from "../currencyText";
import { NumericText } from "../numericText";
import {
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

// The icon tile tracks the card density along the shared icon-badge ramp.
const iconBadgeSizes: Record<StatCardSize, IconBadgeSize> = {
  sm: "sm",
  default: "md",
  lg: "lg",
};

const iconBadgeTones: Record<StatCardTone, IconBadgeTone> = {
  default: "primary",
  success: "success",
  warning: "warning",
  info: "info",
  destructive: "destructive",
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
        <IconBadgeEl size={iconBadgeSizes[size]} tone={iconBadgeTones[tone]}>
          <Icon />
        </IconBadgeEl>
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
      {/* Below ~19rem the fixed-width chart would starve the text column. */}
      {chart && <div className="hidden shrink-0 @[19rem]:block">{chart}</div>}
      {interactive && chevron}
    </div>
  );
}

export * from "./variants";
