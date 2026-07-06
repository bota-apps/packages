import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { formatRelativeTime } from "../lib/formatRelativeTime";
import { dateTimeVariants, type DateTimeVariant } from "./variants";

export * from "./variants";

type DateTimeProps = VariantProps<typeof dateTimeVariants> & {
  /**
   * ISO date string ("2026-04-04"), ISO datetime ("2026-04-04T14:30:00"),
   * or for date-range two ISO dates joined by "/" ("2026-04-01/2026-04-30").
   */
  value: string;
};

function parseLocalDate(iso: string): Date {
  const dateOnly = iso.includes("T") ? iso.split("T")[0] : iso;
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Display formatters for the DateTime variants below. `fmtDate` and
// `fmtDateRange` are public: apps compose formatted dates into their own
// strings (tooltips, labels) and must match what <DateTime> renders. The rest
// stay private — <DateTime> is the API for those variants.

/** Formats an ISO date as the `date` variant renders it — "Apr 4, 2026". */
export function fmtDate(iso: string): string {
  const d = parseLocalDate(iso);
  return d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });
}

/**
 * Formats two ISO dates as the `date-range` variant renders them — collapses
 * a shared month ("Apr 1 – 30, 2026") or year ("Apr 1 – May 15, 2026").
 */
export function fmtDateRange(startIso: string, endIso: string): string {
  const s = parseLocalDate(startIso);
  const e = parseLocalDate(endIso);
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  const sMonth = s.toLocaleDateString("en", { month: "short" });
  const eMonth = e.toLocaleDateString("en", { month: "short" });

  if (sameMonth) {
    return `${sMonth} ${s.getDate()} – ${e.getDate()}, ${s.getFullYear()}`;
  }
  if (sameYear) {
    return `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${fmtDate(startIso)} – ${fmtDate(endIso)}`;
}

function fmtDateShort(iso: string): string {
  const d = parseLocalDate(iso);
  const currentYear = new Date().getFullYear();
  if (d.getFullYear() === currentYear) {
    return d.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
  return fmtDate(iso);
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  const timePart = d.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

function fmtMonthYear(iso: string): string {
  const d = parseLocalDate(iso);
  return d.toLocaleDateString("en", { month: "long", year: "numeric" });
}

function formatValue(value: string, variant: DateTimeVariant): string {
  switch (variant) {
    case "date":
      return fmtDate(value);
    case "date-short":
      return fmtDateShort(value);
    case "datetime":
      return fmtDateTime(value);
    case "time":
      return fmtTime(value);
    case "date-range": {
      const parts = value.split("/");
      if (parts.length === 2) {
        return fmtDateRange(parts[0].trim(), parts[1].trim());
      }
      return value;
    }
    case "month-year":
      return fmtMonthYear(value);
    case "relative":
      return formatRelativeTime(value);
  }
}

/**
 * Consistent date and time display control.
 *
 * Replaces ad-hoc `.toLocaleDateString()` calls.
 * Renders as a semantic `<time>` element.
 *
 * @example
 * <DateTime value="2026-04-04" />
 * <DateTime value="2026-04-04T14:30:00" variant="datetime" />
 * <DateTime value="2026-04-01/2026-04-30" variant="date-range" />
 * <DateTime value={project.createdAt} variant="relative" tone="muted" />
 */
export function DateTime({
  value,
  variant = "date",
  tone = "default",
  size = "sm",
}: DateTimeProps) {
  const formatted = formatValue(value, variant ?? "date");
  return (
    <time dateTime={value} className={cn(dateTimeVariants({ variant, tone, size }))}>
      {formatted}
    </time>
  );
}
