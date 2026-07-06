import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneDisplay } from "./index";

afterEach(cleanup);

describe("PhoneDisplay", () => {
  it("displays the number as given when no country code is set", () => {
    render(<PhoneDisplay phone="+14155550123" />);
    expect(screen.getByText("+14155550123")).toBeTruthy();
  });

  it("groups the national part for a configured country code", () => {
    render(<PhoneDisplay phone="+14155550123" countryCode="1" groups={[3, 3, 4]} />);
    expect(screen.getByText("+1-415-555-0123")).toBeTruthy();
  });

  it("applies the country code to a national number, dropping a trunk 0", () => {
    render(<PhoneDisplay phone="04155550123" countryCode="1" groups={[3, 3, 4]} />);
    expect(screen.getByText("+1-415-555-0123")).toBeTruthy();
  });

  it("renders a tel: call button when showCallButton is set", () => {
    render(<PhoneDisplay phone="+14155550123" countryCode="1" groups={[3, 3, 4]} showCallButton />);
    const link = screen.getByRole("link", { name: "Call +1-415-555-0123" });
    expect(link.getAttribute("href")).toBe("tel:14155550123");
    expect(link.className).toContain("print:hidden");
  });

  it("applies size and tone variant classes", () => {
    render(<PhoneDisplay phone="+14155550123" size="sm" tone="muted" />);
    const el = screen.getByText("+14155550123");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-muted-foreground");
  });
});
