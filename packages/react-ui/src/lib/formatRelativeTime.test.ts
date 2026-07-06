import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

const now = new Date("2026-01-15T12:00:00Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("formatRelativeTime", () => {
  it("returns 'now' for anything under a minute (past or future)", () => {
    expect(formatRelativeTime(now.getTime() - 30_000)).toBe("now");
    expect(formatRelativeTime(now.getTime() + 30_000)).toBe("now");
  });

  it("formats past times in minutes, hours, and days (same shape as before: '5m ago')", () => {
    expect(formatRelativeTime(now.getTime() - 5 * 60_000)).toBe("5m ago");
    expect(formatRelativeTime(now.getTime() - 3 * 3_600_000)).toBe("3h ago");
    expect(formatRelativeTime(now.getTime() - 2 * 86_400_000)).toBe("2d ago");
  });

  it("rolls durations of a week or more up to weeks, months, and years", () => {
    expect(formatRelativeTime(now.getTime() - 6 * 86_400_000)).toBe("6d ago");
    expect(formatRelativeTime(now.getTime() - 10 * 86_400_000)).toBe("1w ago");
    expect(formatRelativeTime(now.getTime() - 45 * 86_400_000)).toBe("1mo ago");
    expect(formatRelativeTime(now.getTime() - 400 * 86_400_000)).toBe("1y ago");
  });

  it("handles future timestamps instead of clamping to '0m ago'", () => {
    expect(formatRelativeTime(now.getTime() + 5 * 60_000)).toBe("in 5m");
  });

  it("returns empty string for unparseable input instead of 'NaNd ago'", () => {
    expect(formatRelativeTime("not a date")).toBe("");
  });

  it("localizes via the locale option", () => {
    expect(formatRelativeTime(now.getTime() - 5 * 60_000, { locale: "de" })).toContain("vor");
  });

  it("accepts Date and ISO string inputs", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 90_000))).toBe("1m ago");
    expect(formatRelativeTime(new Date(now.getTime() - 90_000).toISOString())).toBe("1m ago");
  });
});
