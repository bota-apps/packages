import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateCompact,
  formatDateShort,
  formatMonthYear,
  formatTenure,
  isPastDate,
  parseDate,
  toISODateString,
} from "./index";

describe("parseDate", () => {
  it("parses ISO strings and passes Dates through; invalid input is undefined", () => {
    expect(parseDate("2025-01-15")?.getFullYear()).toBe(2025);
    const d = new Date(2025, 0, 15);
    expect(parseDate(d)).toBe(d);
    expect(parseDate("not a date")).toBeUndefined();
    expect(parseDate(undefined)).toBeUndefined();
    expect(parseDate(null)).toBeUndefined();
  });
});

describe("formatters", () => {
  const iso = "2025-01-15";

  it("formats the standard presets", () => {
    expect(formatDate(iso)).toBe("January 15, 2025");
    expect(formatDateShort(iso)).toBe("Jan 15, 2025");
    expect(formatDateCompact(iso)).toBe("15/01/2025");
    expect(formatMonthYear(iso)).toBe("January 2025");
    expect(toISODateString(new Date(2025, 0, 15))).toBe("2025-01-15");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate("nope")).toBe("");
    expect(formatDateShort("nope")).toBe("");
    expect(formatDateCompact("nope")).toBe("");
  });

  it("isPastDate is true for past dates and false for invalid/future ones", () => {
    expect(isPastDate("2000-01-01")).toBe(true);
    expect(isPastDate("2999-01-01")).toBe(false);
    expect(isPastDate("nope")).toBe(false);
  });

  it("formatTenure renders years and months since a start date", () => {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    start.setMonth(start.getMonth() - 3);
    expect(formatTenure(start)).toBe("2y 3m");
    expect(formatTenure("nope")).toBe("");
  });
});
