import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CheckItem, Hero, Section, SectionTitle, StepIndicator, sectionVariants } from "./index";

afterEach(cleanup);

describe("Section", () => {
  it("renders a section element with marketing padding and background variant", () => {
    const { container } = render(
      <Section background="muted">
        <p>Feature content</p>
      </Section>,
    );
    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section!.className).toContain("py-20");
    expect(section!.className).toContain("bg-muted/50");
    expect(screen.getByText("Feature content")).toBeTruthy();
    expect(sectionVariants({ background: "primary" })).toContain("bg-primary");
  });

  it("renders SectionTitle with heading and description", () => {
    render(<SectionTitle title="How it works" description="Three simple steps." />);
    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeTruthy();
    expect(screen.getByText("Three simple steps.")).toBeTruthy();
  });

  it("renders StepIndicator with step number, title, and description", () => {
    render(<StepIndicator step="1" title="Sign up" description="Create your account." />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Sign up" })).toBeTruthy();
    expect(screen.getByText("Create your account.")).toBeTruthy();
  });

  it("renders CheckItem content and Hero with h1 title and actions", () => {
    render(
      <div>
        <CheckItem icon={<svg data-testid="check-icon" />}>Free forever</CheckItem>
        <Hero
          title="Ship projects in minutes"
          description="Everything you need."
          actions={<button type="button">Get started</button>}
        />
      </div>,
    );
    expect(screen.getByText("Free forever")).toBeTruthy();
    expect(screen.getByTestId("check-icon")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Ship projects in minutes" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Get started" })).toBeTruthy();
  });
});
