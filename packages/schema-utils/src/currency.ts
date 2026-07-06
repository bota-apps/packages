import { z } from "zod";
import type { CurrencyCode, CurrencyInfo, FormatCurrencyOptions, Money } from "@bota-apps/types";

// The pure-type contracts (CurrencyCode, Money, CurrencyInfo, FormatCurrencyOptions)
// live in @bota-apps/types; this file is their Zod runtime + formatting. The Equal<>
// assertions in ./_alignment fail the build if the runtime and types ever drift.

export type { CurrencyCode, CurrencyInfo, FormatCurrencyOptions, Money } from "@bota-apps/types";

/* ------------------------------------------------------------------ */
/* Currency codes — default set                                        */
/* ------------------------------------------------------------------ */

/** The default ISO 4217 currency codes (Ethiopian-market defaults). */
export const currencyCodes = ["ETB", "USD", "EUR", "GBP", "AED", "SAR", "KES", "CNY"] as const;

export const currencyCodeSchema = z.enum(currencyCodes);

/* ------------------------------------------------------------------ */
/* Money — amount + currency pair                                      */
/* ------------------------------------------------------------------ */

export const moneySchema = z.object({
  amount: z.number(),
  currency: currencyCodeSchema,
}) satisfies z.ZodType<Money>;

/** Construct a Money value. */
export function money(amount: number, currency: CurrencyCode): Money {
  return { amount, currency };
}

/**
 * Sum a list of Money values into a single total. Assumes a single currency —
 * the currency of the first value is used; an empty list yields a zero amount in
 * {@link fallbackCurrency}. Callers holding mixed currencies must group first.
 */
export function sumMoney(values: readonly Money[], fallbackCurrency: CurrencyCode): Money {
  if (values.length === 0) {
    return { amount: 0, currency: fallbackCurrency };
  }
  const amount = values.reduce((total, value) => total + value.amount, 0);
  return { amount, currency: values[0].currency };
}

/* ------------------------------------------------------------------ */
/* Currency metadata — labels, symbols, decimal places                 */
/* ------------------------------------------------------------------ */

/**
 * A currency entry for a custom registry. Same shape as CurrencyInfo but open
 * to any code, so apps outside the default market can bring their own set via
 * {@link createCurrencyFormatter}. Derived from CurrencyInfo so the shapes
 * cannot drift.
 */
export type CurrencyDefinition = Omit<CurrencyInfo, "code"> & { code: string };

/** Default registry (Ethiopian-market currencies) with metadata. */
export const currencies: Record<CurrencyCode, CurrencyInfo> = {
  ETB: { code: "ETB", symbol: "Br", label: "Ethiopian Birr", decimals: 2, locale: "am-ET" },
  USD: { code: "USD", symbol: "$", label: "US Dollar", decimals: 2, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", label: "Euro", decimals: 2, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", decimals: 2, locale: "en-GB" },
  AED: { code: "AED", symbol: "د.إ", label: "UAE Dirham", decimals: 2, locale: "ar-AE" },
  SAR: { code: "SAR", symbol: "﷼", label: "Saudi Riyal", decimals: 2, locale: "ar-SA" },
  KES: { code: "KES", symbol: "KSh", label: "Kenyan Shilling", decimals: 2, locale: "en-KE" },
  CNY: { code: "CNY", symbol: "¥", label: "Chinese Yuan", decimals: 2, locale: "zh-CN" },
};

/* ------------------------------------------------------------------ */
/* Currency formatting — injectable factory                            */
/* ------------------------------------------------------------------ */

export type CurrencyFormatterConfig<C extends string = CurrencyCode> = {
  /**
   * Currency registry. Defaults to the Ethiopian-market set — a custom code
   * set must bring its own registry (enforced by the factory's overloads).
   */
  currencies?: Record<C, CurrencyDefinition>;
  /**
   * Force a single output locale for all currencies (e.g. "en"). When omitted,
   * each currency formats in its own `locale` from the registry.
   */
  locale?: string;
};

export type CurrencyFormatter<C extends string = CurrencyCode> = {
  formatCurrency: (value: number, code: C, options?: FormatCurrencyOptions) => string;
  formatCurrencyCompact: (value: number, code: C) => string;
  formatCurrencyShort: (value: number, code: C) => string;
  formatMoney: (m: { amount: number; currency: C }) => string;
  formatMoneyCompact: (m: { amount: number; currency: C }) => string;
  formatMoneyShort: (m: { amount: number; currency: C }) => string;
  /** Display label for a code, resolved via an injected translator when given. */
  getLabel: (code: C, t?: (key: string) => string | undefined) => string;
  currencies: Record<C, CurrencyDefinition>;
};

/**
 * Build a currency formatter bound to a registry and locale policy. The
 * module-level `formatCurrency`/`formatMoney` exports are the default instance
 * (default registry, output locale pinned to "en" for stable rendering); apps
 * in other markets create their own:
 *
 * @example
 * const fmt = createCurrencyFormatter({
 *   currencies: { NGN: { code: "NGN", symbol: "₦", label: "Nigerian Naira", decimals: 2, locale: "en-NG" } },
 * });
 * fmt.formatCurrency(1500, "NGN") // "₦1,500.00" (formats in en-NG)
 */
export function createCurrencyFormatter(
  config?: CurrencyFormatterConfig,
): CurrencyFormatter<CurrencyCode>;
export function createCurrencyFormatter<C extends string>(
  config: CurrencyFormatterConfig<C> & { currencies: Record<C, CurrencyDefinition> },
): CurrencyFormatter<C>;
export function createCurrencyFormatter(
  config: CurrencyFormatterConfig<string> = {},
): CurrencyFormatter<string> {
  // The overloads guarantee this: without a custom registry the code set is
  // the default CurrencyCode union, which the default registry fully covers.
  const registry: Record<string, CurrencyDefinition> = config.currencies ?? currencies;

  // Intl constructors are expensive (locale-data resolution) and these run
  // per table cell / chart tick; instances are pure functions of their options.
  const formatterCache = new Map<string, Intl.NumberFormat>();

  function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
    const key = `${locale}|${options.notation ?? ""}|${options.currency ?? ""}|${
      options.minimumFractionDigits ?? ""
    }|${options.maximumFractionDigits ?? ""}`;
    let formatter = formatterCache.get(key);
    if (!formatter) {
      formatter = new Intl.NumberFormat(locale, options);
      formatterCache.set(key, formatter);
    }
    return formatter;
  }

  function infoFor(code: string): CurrencyDefinition {
    const info: CurrencyDefinition | undefined = registry[code];
    if (!info) {
      // A code outside the registry is a violated contract at a runtime
      // boundary — fail fast instead of inventing placeholder metadata.
      throw new Error(`Unknown currency code: ${code}`);
    }
    return info;
  }

  function formatCurrency(
    value: number,
    code: string,
    options: FormatCurrencyOptions = {},
  ): string {
    const { compact = false, showCode = false, decimals } = options;
    const info = infoFor(code);
    const locale = config.locale ?? info.locale;
    const fractionDigits = decimals ?? info.decimals;

    if (compact && Math.abs(value) >= 1000) {
      const compactStr = numberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
      return showCode ? `${compactStr} ${code}` : `${info.symbol} ${compactStr}`;
    }

    // Intl's currency style only accepts well-formed ISO 4217 codes (three
    // letters) — custom registry codes like "USDT" render symbol-prefixed.
    if (showCode || !/^[A-Za-z]{3}$/.test(code)) {
      const numStr = numberFormat(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value);
      return showCode ? `${numStr} ${code}` : `${info.symbol} ${numStr}`;
    }

    return numberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  }

  return {
    formatCurrency,
    formatCurrencyCompact: (value, code) => formatCurrency(value, code, { compact: true }),
    formatCurrencyShort: (value, code) =>
      formatCurrency(value, code, { showCode: true, decimals: 0 }),
    formatMoney: (m) => formatCurrency(m.amount, m.currency),
    formatMoneyCompact: (m) => formatCurrency(m.amount, m.currency, { compact: true }),
    formatMoneyShort: (m) => formatCurrency(m.amount, m.currency, { showCode: true, decimals: 0 }),
    getLabel: (code, t) => t?.(`currency.${code}`) ?? infoFor(code).label,
    currencies: registry,
  };
}

/* ------------------------------------------------------------------ */
/* Default instance — module-level formatters (back-compat surface)    */
/* ------------------------------------------------------------------ */

// Output locale pinned to "en" so existing apps render exactly as before;
// per-currency locales apply only in formatters built via the factory.
const defaultFormatter = createCurrencyFormatter({ locale: "en" });

/**
 * Format a monetary value (default registry, "en" output locale).
 *
 * @example
 * formatCurrency(1145000, "ETB")                     // "ETB 1,145,000.00"
 * formatCurrency(1145000, "ETB", { compact: true })  // "Br 1.1M"
 * formatCurrency(1145000, "ETB", { showCode: true }) // "1,145,000.00 ETB"
 */
export function formatCurrency(
  value: number,
  code: CurrencyCode,
  options: FormatCurrencyOptions = {},
): string {
  return defaultFormatter.formatCurrency(value, code, options);
}

/** Compact currency format for chart labels and tight spaces. */
export function formatCurrencyCompact(value: number, code: CurrencyCode): string {
  return defaultFormatter.formatCurrencyCompact(value, code);
}

/** Short currency format with code suffix — for tables and stat cards. */
export function formatCurrencyShort(value: number, code: CurrencyCode): string {
  return defaultFormatter.formatCurrencyShort(value, code);
}

/** Display label for a currency code, translated when a `t` is injected. */
export function getCurrencyLabel(
  code: CurrencyCode,
  t?: (key: string) => string | undefined,
): string {
  return defaultFormatter.getLabel(code, t);
}

/* ------------------------------------------------------------------ */
/* Money formatting — data-driven (reads currency from the object)     */
/* ------------------------------------------------------------------ */

/** Format a Money value with full precision. */
export function formatMoney(m: Money): string {
  return defaultFormatter.formatMoney(m);
}

/** Compact Money format for chart labels and tight spaces. */
export function formatMoneyCompact(m: Money): string {
  return defaultFormatter.formatMoneyCompact(m);
}

/** Short Money format with code suffix — for tables and stat cards. */
export function formatMoneyShort(m: Money): string {
  return defaultFormatter.formatMoneyShort(m);
}
