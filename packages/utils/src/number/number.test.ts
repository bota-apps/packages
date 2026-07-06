import { describe, expect, it } from "vitest";
import { formatNumber } from "./index";

describe("formatNumber", () => {
  it("formats with en-US grouping", () => {
    expect(formatNumber(1234567.89)).toBe("1,234,567.89");
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(-9876)).toBe("-9,876");
  });
});
