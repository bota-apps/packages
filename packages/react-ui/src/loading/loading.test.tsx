import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Loading, LoadingBusiness } from "./index";

afterEach(cleanup);

describe("Loading", () => {
  it("renders a spinner with the given text", () => {
    const { container } = render(<Loading text="Loading data…" />);
    expect(screen.getByText("Loading data…")).toBeTruthy();
    expect(container.querySelector("svg.animate-spin")).toBeTruthy();
  });

  it("renders inline without text", () => {
    const { container } = render(<Loading variant="inline" size="sm" />);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeTruthy();
    expect(spinner?.classList.contains("h-4")).toBe(true);
  });
});

describe("LoadingBusiness", () => {
  it("renders a spinner with the given text", () => {
    const { container } = render(<LoadingBusiness text="Loading businesses…" />);
    expect(screen.getByText("Loading businesses…")).toBeTruthy();
    expect(container.querySelector("svg.animate-spin")).toBeTruthy();
  });
});
