import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Money } from "@bota-apps/types";
import { formatMoney, formatMoneyShort } from "@bota-apps/schema-utils";
import { CurrencyText } from "./index";

const budget: Money = { amount: 45000, currency: "USD" };

afterEach(cleanup);

describe("CurrencyText", () => {
  it("renders the short format by default", () => {
    render(<CurrencyText value={budget} />);
    expect(screen.getByText(formatMoneyShort(budget))).toBeTruthy();
  });

  it("renders the full format when requested", () => {
    const { container } = render(<CurrencyText value={budget} format="full" />);
    // Compare textContent directly: the formatter emits non-breaking spaces,
    // which getByText's whitespace normalization would collapse.
    expect(container.textContent).toBe(formatMoney(budget));
  });

  it("applies size and tone variant classes plus custom className", () => {
    render(<CurrencyText value={budget} size="xl" tone="muted" className="custom-class" />);
    const el = screen.getByText(formatMoneyShort(budget));
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("text-2xl");
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).toContain("custom-class");
  });
});
