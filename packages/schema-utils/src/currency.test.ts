import { describe, expect, it } from "vitest";
import {
  createCurrencyFormatter,
  currencies,
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencyShort,
  formatMoney,
  getCurrencyLabel,
  money,
  sumMoney,
} from "./currency";

describe("default formatters (en output locale, stable rendering)", () => {
  it("formats full precision with Intl currency style", () => {
    expect(formatCurrency(1145000, "ETB")).toBe("ETB\u00a01,145,000.00");
    expect(formatCurrency(1145000, "USD")).toBe("$1,145,000.00");
  });

  it("formats compact with the registry symbol", () => {
    expect(formatCurrencyCompact(1145000, "ETB")).toBe("Br 1.1M");
  });

  it("keeps full precision below the compact threshold", () => {
    expect(formatCurrency(999, "ETB", { compact: true })).toBe("ETB\u00a0999.00");
  });

  it("formats short with code suffix and no decimals", () => {
    expect(formatCurrencyShort(1145000, "ETB")).toBe("1,145,000 ETB");
  });

  it("formats Money objects", () => {
    // Intl renders its own display symbol ("KES" in en), not the registry symbol.
    expect(formatMoney(money(2500.5, "KES"))).toBe("KES\u00a02,500.50");
  });

  it("pins the default instance to 'en' regardless of per-currency locales", () => {
    // EUR's registry locale is de-DE; the default instance must not use it.
    expect(formatCurrency(1145000, "EUR")).toBe("€1,145,000.00");
  });
});

describe("createCurrencyFormatter", () => {
  it("honours each currency's own locale when none is forced", () => {
    const fmt = createCurrencyFormatter();
    // de-DE: dot thousands separator, comma decimals, trailing symbol.
    expect(fmt.formatCurrency(1145000, "EUR")).toBe("1.145.000,00\u00a0€");
  });

  it("accepts a custom registry with codes outside the default union", () => {
    const fmt = createCurrencyFormatter({
      currencies: {
        NGN: {
          code: "NGN",
          symbol: "₦",
          label: "Nigerian Naira",
          decimals: 2,
          locale: "en-NG",
        },
      },
    });
    expect(fmt.formatCurrency(1500, "NGN")).toBe("₦1,500.00");
    expect(fmt.getLabel("NGN")).toBe("Nigerian Naira");
  });

  it("formats non-ISO custom codes with the registry symbol instead of crashing Intl", () => {
    // Intl.NumberFormat throws RangeError for currency codes that are not
    // three letters — those must fall back to symbol-prefixed rendering.
    const fmt = createCurrencyFormatter({
      currencies: {
        USDT: { code: "USDT", symbol: "₮", label: "Tether", decimals: 2, locale: "en" },
      },
    });
    expect(fmt.formatCurrency(1500, "USDT")).toBe("₮ 1,500.00");
    expect(fmt.formatCurrency(1500, "USDT", { showCode: true })).toBe("1,500.00 USDT");
  });

  it("throws on codes missing from the registry instead of inventing metadata", () => {
    // C = string models data-driven codes (e.g. an API response that skipped
    // zod) — the registry miss is a violated contract and must fail fast.
    const fmt = createCurrencyFormatter<string>({
      currencies: { ETB: { ...currencies.ETB } },
      locale: "en",
    });
    expect(() => fmt.formatCurrency(10, "XXX")).toThrow("Unknown currency code: XXX");
    expect(() => fmt.getLabel("XXX")).toThrow("Unknown currency code: XXX");
  });

  it("forces a single output locale when configured", () => {
    const fmt = createCurrencyFormatter({ locale: "de-DE" });
    expect(fmt.formatCurrency(1145000, "USD")).toBe("1.145.000,00\u00a0$");
  });
});

describe("getCurrencyLabel", () => {
  it("falls back to the registry label without a translator", () => {
    expect(getCurrencyLabel("ETB")).toBe("Ethiopian Birr");
  });

  it("resolves through an injected translator", () => {
    const t = (key: string) => (key === "currency.ETB" ? "የኢትዮጵያ ብር" : undefined);
    expect(getCurrencyLabel("ETB", t)).toBe("የኢትዮጵያ ብር");
    // Translator misses fall back to the registry label.
    expect(getCurrencyLabel("USD", t)).toBe("US Dollar");
  });
});

describe("sumMoney", () => {
  it("returns a zero amount in the fallback currency for an empty list", () => {
    expect(sumMoney([], "ETB")).toEqual({ amount: 0, currency: "ETB" });
  });

  it("sums amounts and keeps the first value's currency", () => {
    const total = sumMoney([money(1000, "USD"), money(250, "USD"), money(50, "USD")], "ETB");
    expect(total).toEqual({ amount: 1300, currency: "USD" });
  });

  it("ignores the fallback when the list is non-empty", () => {
    expect(sumMoney([money(500, "ETB")], "USD")).toEqual({ amount: 500, currency: "ETB" });
  });
});

describe("registry", () => {
  it("keeps the built-in default currency set intact", () => {
    expect(Object.keys(currencies)).toEqual([
      "ETB",
      "USD",
      "EUR",
      "GBP",
      "AED",
      "SAR",
      "KES",
      "CNY",
    ]);
  });
});
