import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DateTime, fmtDate, fmtDateRange } from "./index";

afterEach(cleanup);

describe("DateTime", () => {
  it("renders a formatted date inside a semantic <time> element", () => {
    render(<DateTime value="2026-04-04" />);
    const el = screen.getByText("Apr 4, 2026");
    expect(el.tagName).toBe("TIME");
    expect(el.getAttribute("datetime")).toBe("2026-04-04");
  });

  it("formats a datetime value with the datetime variant", () => {
    render(<DateTime value="2026-04-04T14:30:00" variant="datetime" />);
    expect(screen.getByText("Apr 4, 2026 · 2:30 PM")).toBeTruthy();
  });

  it("formats a same-month range with the date-range variant", () => {
    render(<DateTime value="2026-04-01/2026-04-30" variant="date-range" />);
    expect(screen.getByText("Apr 1 – 30, 2026")).toBeTruthy();
  });

  it("formats a month-year value", () => {
    render(<DateTime value="2026-04-01" variant="month-year" />);
    expect(screen.getByText("April 2026")).toBeTruthy();
  });

  it("applies variant, tone, and size classes", () => {
    render(<DateTime value="2026-04-04" tone="muted" size="lg" />);
    const el = screen.getByText("Apr 4, 2026");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).toContain("text-lg");
  });

  it("switches to the sans face for the relative variant", () => {
    render(<DateTime value={new Date().toISOString()} variant="relative" />);
    const el = document.querySelector("time");
    expect(el?.className).toContain("font-sans");
  });
});

describe("fmtDate", () => {
  it("formats an ISO date exactly as the date variant renders it", () => {
    expect(fmtDate("2026-04-04")).toBe("Apr 4, 2026");
    expect(fmtDate("2026-04-04T14:30:00")).toBe("Apr 4, 2026");
  });
});

describe("fmtDateRange", () => {
  it("collapses a same-month range", () => {
    expect(fmtDateRange("2026-04-01", "2026-04-30")).toBe("Apr 1 – 30, 2026");
  });

  it("collapses a same-year range", () => {
    expect(fmtDateRange("2026-04-01", "2026-05-15")).toBe("Apr 1 – May 15, 2026");
  });

  it("spells out both dates across years", () => {
    expect(fmtDateRange("2025-12-20", "2026-01-05")).toBe("Dec 20, 2025 – Jan 5, 2026");
  });
});
