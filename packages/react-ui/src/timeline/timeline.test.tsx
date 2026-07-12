import { cleanup, render, screen, within } from "@testing-library/react";
import { Check } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Timeline,
  TimelineItem,
  timelineDotVariants,
  timelineItemVariants,
  timelineMarkerVariants,
} from "./index";

afterEach(cleanup);

function renderTimeline() {
  return render(
    <Timeline>
      <TimelineItem title="Order placed" meta="Jun 24" description="Queued for processing." />
      <TimelineItem title="Comment added" meta="Jun 25" />
      <TimelineItem
        title="Order shipped"
        meta="Jun 26"
        tone="success"
        icon={<Check aria-hidden />}
      />
    </Timeline>,
  );
}

describe("Timeline", () => {
  it("renders entries as list items in order", () => {
    renderTimeline();

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain("Order placed");
    expect(items[1].textContent).toContain("Comment added");
    expect(items[2].textContent).toContain("Order shipped");
  });

  it("renders title, meta, and description content", () => {
    renderTimeline();

    expect(screen.getByText("Order placed")).toBeTruthy();
    expect(screen.getByText("Jun 24")).toBeTruthy();
    expect(screen.getByText("Queued for processing.")).toBeTruthy();
  });

  it("lets the meta wrap under the title in narrow containers", () => {
    renderTimeline();

    const row = screen.getByText("Jun 24").parentElement;
    expect(row?.className).toContain("flex-wrap");
    expect(screen.getByText("Order placed").className).toContain("min-w-0");
  });

  it("applies the tone classes to the marker chip and dot", () => {
    renderTimeline();

    const marker = screen.getByText("Order placed").closest("li")?.firstElementChild;
    expect(marker?.className).toContain("bg-muted");

    const toned = screen.getByText("Order shipped").closest("li")?.firstElementChild;
    expect(toned?.className).toContain("bg-emerald-500/15");

    expect(timelineMarkerVariants({ tone: "primary" })).toContain("bg-selected");
    expect(timelineMarkerVariants({ tone: "destructive" })).toContain("bg-destructive/15");
    expect(timelineDotVariants({ tone: "warning" })).toContain("bg-amber-500");
  });

  it("renders a solid dot when no icon is given and the icon when provided", () => {
    renderTimeline();

    const dotMarker = screen.getByText("Order placed").closest("li")?.firstElementChild;
    expect(dotMarker?.querySelector('[class*="rounded-full"]')).toBeTruthy();

    const iconMarker = screen.getByText("Order shipped").closest("li")?.firstElementChild;
    expect(iconMarker?.querySelector("svg")).toBeTruthy();
  });

  it("hides the connector line on the last item via the last: variant", () => {
    renderTimeline();

    const items = screen.getAllByRole("listitem");
    for (const item of items) {
      expect(item.className).toContain("before:bg-border");
      expect(item.className).toContain("last:before:hidden");
    }
    expect(timelineItemVariants()).toContain("last:before:hidden");
  });
});
