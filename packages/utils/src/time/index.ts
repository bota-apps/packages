/**
 * Date formatting utilities.
 *
 * Wraps date-fns with locale-aware presets for common patterns.
 */
import {
  format,
  formatRelative,
  parseISO,
  isValid,
  formatDistanceToNow,
  isPast,
  differenceInYears,
  differenceInMonths,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";

/* ------------------------------------------------------------------ */
/* Locale resolution                                                   */
/* ------------------------------------------------------------------ */

/** date-fns does not ship an Amharic locale — we fall back to en-US for now. */
const locales = { en: enUS, am: enUS } as const;
type SupportedLocale = keyof typeof locales;

function resolveLocale(lang?: string): SupportedLocale {
  if (lang?.startsWith("am")) {
    return "am";
  }
  return "en";
}

/* ------------------------------------------------------------------ */
/* Parse helper                                                        */
/* ------------------------------------------------------------------ */

/** Safely parse an ISO date string or Date. Returns undefined for invalid. */
export function parseDate(value: string | Date | undefined | null): Date | undefined {
  if (!value) {
    return undefined;
  }
  const d = typeof value === "string" ? parseISO(value) : value;
  return isValid(d) ? d : undefined;
}

/* ------------------------------------------------------------------ */
/* Standard formatters                                                 */
/* ------------------------------------------------------------------ */

type DateFormatOptions = {
  /** BCP 47 language tag, e.g. "en" or "am". */
  lang?: string;
};

/** Full date: "January 15, 2025" */
export function formatDate(value: string | Date, opts: DateFormatOptions = {}): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return format(d, "MMMM d, yyyy", { locale: locales[resolveLocale(opts.lang)] });
}

/** Short date: "Jan 15, 2025" */
export function formatDateShort(value: string | Date, opts: DateFormatOptions = {}): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return format(d, "MMM d, yyyy", { locale: locales[resolveLocale(opts.lang)] });
}

/** Compact date for tables: "15/01/2025" */
export function formatDateCompact(value: string | Date): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return format(d, "dd/MM/yyyy");
}

/** Month and year: "January 2025" */
export function formatMonthYear(value: string | Date, opts: DateFormatOptions = {}): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return format(d, "MMMM yyyy", { locale: locales[resolveLocale(opts.lang)] });
}

/** Relative time: "3 hours ago", "in 2 days" */
export function formatRelativeTime(value: string | Date, opts: DateFormatOptions = {}): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: locales[resolveLocale(opts.lang)],
  });
}

/** Relative to a base date: "yesterday at 3:00 PM" */
export function formatRelativeDate(
  value: string | Date,
  baseDate: Date = new Date(),
  opts: DateFormatOptions = {},
): string {
  const d = parseDate(value);
  if (!d) {
    return "";
  }
  return formatRelative(d, baseDate, { locale: locales[resolveLocale(opts.lang)] });
}

/** ISO date string for API requests: "2025-01-15" */
export function toISODateString(value: Date): string {
  return format(value, "yyyy-MM-dd");
}

/** Check if a date is in the past. */
export function isPastDate(value: string | Date): boolean {
  const d = parseDate(value);
  return d ? isPast(d) : false;
}

/** Human-readable tenure from a start date to today: "2y 3m", "5y", "8m" */
export function formatTenure(startDate: string | Date): string {
  const d = parseDate(startDate);
  if (!d) {
    return "";
  }
  const now = new Date();
  const years = differenceInYears(now, d);
  const months = differenceInMonths(now, d) % 12;
  if (years > 0 && months > 0) {
    return `${years}y ${months}m`;
  }
  if (years > 0) {
    return `${years}y`;
  }
  return `${months}m`;
}
