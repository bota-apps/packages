import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProcessTimelineItem, StatusLegendItem } from "@bota-apps/react-ui";
import { ProcessTimeline, StatusLegend } from "@bota-apps/react-ui";
import { LifecyclePageSection } from "./index";

const steps: readonly ProcessTimelineItem[] = [
  { id: "a", label: "Stage A", status: "complete" },
  { id: "b", label: "Stage B", status: "current" },
  { id: "c", label: "Stage C", status: "upcoming" },
];

const legendItems: readonly StatusLegendItem[] = [
  { id: "complete", label: "Complete", tone: "success" },
  { id: "current", label: "In progress", tone: "primary" },
];

function timeline() {
  return <ProcessTimeline items={steps} ariaLabel="Lifecycle stages" />;
}

function legend() {
  return <StatusLegend items={legendItems} ariaLabel="Status key" />;
}

describe("LifecyclePageSection", () => {
  it("renders the title and description", () => {
    render(
      <LifecyclePageSection
        title="Record lifecycle"
        description="From intake to archive"
        timeline={timeline()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Record lifecycle" })).toBeTruthy();
    expect(screen.getByText("From intake to archive")).toBeTruthy();
  });

  it("exposes a section landmark with an accessible name", () => {
    render(<LifecyclePageSection title="Record lifecycle" timeline={timeline()} />);

    expect(screen.getByRole("region", { name: "Record lifecycle" })).toBeTruthy();
  });

  it("prefers an explicit ariaLabel for the landmark name", () => {
    render(
      <LifecyclePageSection
        title="Record lifecycle"
        ariaLabel="Lifecycle overview"
        timeline={timeline()}
      />,
    );

    expect(screen.getByRole("region", { name: "Lifecycle overview" })).toBeTruthy();
  });

  it("renders the timeline, legend, and details slots", () => {
    render(
      <LifecyclePageSection
        title="Record lifecycle"
        legend={legend()}
        timeline={timeline()}
        details={<p>Current run summary</p>}
      />,
    );

    expect(screen.getByRole("list", { name: "Lifecycle stages" })).toBeTruthy();
    expect(screen.getByRole("list", { name: "Status key" })).toBeTruthy();
    expect(screen.getByText("Current run summary")).toBeTruthy();
  });

  it("renders a supporting action in the header", () => {
    render(
      <LifecyclePageSection
        title="Record lifecycle"
        action={<button type="button">View all records</button>}
        timeline={timeline()}
      />,
    );

    expect(screen.getByRole("button", { name: "View all records" })).toBeTruthy();
  });
});
