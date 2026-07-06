const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

export type FormatRelativeTimeOptions = {
  /** BCP 47 locale passed to Intl.RelativeTimeFormat. Defaults to "en". */
  locale?: string;
  /** Intl style: "narrow" keeps the compact "5m ago" feel; "long" spells units out. */
  style?: Intl.RelativeTimeFormatStyle;
};

// Intl constructors are expensive (locale-data resolution) and this runs per
// rendered timestamp; instances are pure functions of (locale, style).
const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function relativeTimeFormat(locale: string, style: Intl.RelativeTimeFormatStyle) {
  const key = `${locale}|${style}`;
  let rtf = rtfCache.get(key);
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always", style });
    rtfCache.set(key, rtf);
  }
  return rtf;
}

/**
 * Format a timestamp relative to now ("5m ago", "in 2 hr", …), localized via
 * Intl.RelativeTimeFormat; durations of a week or more roll up to
 * weeks/months/years ("3w ago", "1mo ago"). Handles future timestamps;
 * returns "" for unparseable input.
 *
 * Distinct from `@bota-apps/utils/time`' `formatRelativeTime`, which
 * is date-fns-based and long-form ("3 hours ago"): this one is the compact
 * display-layer variant used by `DateTime mode="relative"`.
 */
export function formatRelativeTime(
  timestamp: string | number | Date,
  options: FormatRelativeTimeOptions = {},
): string {
  const { locale = "en", style = "narrow" } = options;
  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) {
    return "";
  }

  let duration = (then - Date.now()) / 1000;
  if (Math.abs(duration) < 60) {
    return "now";
  }

  const rtf = relativeTimeFormat(locale, style);
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.trunc(duration), division.unit);
    }
    duration /= division.amount;
  }
  return "";
}
