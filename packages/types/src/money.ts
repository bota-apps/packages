/** All supported ISO 4217 currency codes. The matching Zod enum + the `currencies`
 *  metadata registry live in @bota-apps/schema-utils. */
export type CurrencyCode = "ETB" | "USD" | "EUR" | "GBP" | "AED" | "SAR" | "KES" | "CNY";

/** An amount paired with its currency. */
export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Number of decimal places (typically 2). */
  decimals: number;
  /** BCP 47 locale for Intl.NumberFormat. */
  locale: string;
};

export type FormatCurrencyOptions = {
  /** Abbreviate large numbers: 1,145,000 → "1.1M". */
  compact?: boolean;
  /** Show the currency code as suffix instead of symbol. */
  showCode?: boolean;
  /** Override decimal places. */
  decimals?: number;
};
