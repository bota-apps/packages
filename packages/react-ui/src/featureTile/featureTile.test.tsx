import { cleanup, render, screen } from "@testing-library/react";
import { Rocket } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import { FeatureTile } from "./index";

afterEach(cleanup);

describe("FeatureTile", () => {
  it("renders the icon tile, title, and description", () => {
    const { container } = render(
      <FeatureTile icon={Rocket} title="Reporting" description="Dashboards for every dataset." />,
    );
    expect(screen.getByRole("heading", { name: "Reporting" })).toBeTruthy();
    expect(screen.getByText("Dashboards for every dataset.")).toBeTruthy();
    const tile = container.querySelector("span");
    expect(tile?.querySelector("svg")).toBeTruthy();
    // The icon renders inside the shared tinted tile at the md ramp step.
    expect(tile?.className).toContain("h-10");
    expect(tile?.className).toContain("bg-primary/10");
    expect(tile?.className).toContain("rounded-lg");
  });

  it("is a size container whose header stacks from 16rem of container width", () => {
    const { container } = render(<FeatureTile icon={Rocket} title="Layout" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("@container");
    const header = wrapper.querySelector("h3")?.parentElement as HTMLElement;
    expect(header.className).toContain("@[16rem]:flex-col");
  });

  it("applies the tone to the icon tile and renders body and footer slots", () => {
    const { container } = render(
      <FeatureTile icon={Rocket} title="Tone" tone="success" footer={<a href="/x">More</a>}>
        <span data-testid="body-slot" />
      </FeatureTile>,
    );
    const tile = container.querySelector("span");
    expect(tile?.className).toContain("bg-status-success/10");
    expect(screen.getByTestId("body-slot")).toBeTruthy();
    expect(screen.getByText("More")).toBeTruthy();
  });
});
