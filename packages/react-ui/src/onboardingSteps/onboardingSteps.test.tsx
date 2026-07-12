import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Building2, CreditCard, User } from "lucide-react";
import { OnboardingSteps, type OnboardingStepConfig } from "./index";

afterEach(cleanup);

const steps: OnboardingStepConfig[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "business", label: "Business", icon: Building2 },
  { key: "billing", label: "Billing", icon: CreditCard },
];

describe("OnboardingSteps", () => {
  it("renders every step label with separators between them", () => {
    render(<OnboardingSteps steps={steps} current="business" />);

    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Business")).toBeTruthy();
    expect(screen.getByText("Billing")).toBeTruthy();
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("emphasises the current step label", () => {
    render(<OnboardingSteps steps={steps} current="business" />);

    const current = screen.getByText("Business");
    const upcoming = screen.getByText("Billing");
    expect(current.className).toContain("font-semibold");
    expect(upcoming.className).not.toContain("font-semibold");
  });

  it("collapses inactive labels in narrow containers while the active label stays visible", () => {
    render(<OnboardingSteps steps={steps} current="business" />);

    // Inactive labels and separators only show from the @2xl container width.
    expect(screen.getByText("Profile").className).toContain("hidden @2xl:block");
    expect(screen.getByText("Billing").className).toContain("hidden @2xl:block");
    for (const separator of screen.getAllByText("\u2014")) {
      expect(separator.className).toContain("hidden @2xl:block");
    }
    expect(screen.getByText("Business").className).not.toContain("hidden");
  });
});
