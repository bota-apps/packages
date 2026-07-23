import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Carousel } from "./index";

function renderSlides(count: number, props: Partial<Parameters<typeof Carousel>[0]> = {}) {
  return render(
    <Carousel {...props}>
      {Array.from({ length: count }, (_, slide) => (
        <span key={slide}>Slide {slide + 1}</span>
      ))}
    </Carousel>,
  );
}

describe("Carousel", () => {
  it("shows one slide at a time and pages with the buttons", async () => {
    const user = userEvent.setup();
    renderSlides(3);

    expect(screen.getByText("Slide 1")).toBeTruthy();
    expect(screen.queryByText("Slide 2")).toBeNull();
    expect(screen.getByText("1 of 3")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Slide 2")).toBeTruthy();
    expect(screen.queryByText("Slide 1")).toBeNull();
    expect(screen.getByText("2 of 3")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Slide 1")).toBeTruthy();
  });

  it("keeps end-of-range pager buttons focusable but inert", async () => {
    const user = userEvent.setup();
    renderSlides(2);

    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous.getAttribute("aria-disabled")).toBe("true");
    previous.focus();
    // Keyboard activation still lands on the aria-disabled button; it no-ops.
    await user.keyboard("{Enter}");
    expect(screen.getByText("Slide 1")).toBeTruthy();
    expect(document.activeElement).toBe(previous);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Next" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("renders no pager for a single slide", () => {
    renderSlides(1);

    expect(screen.getByText("Slide 1")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
    expect(screen.queryByText("1 of 1")).toBeNull();
  });

  it("pages with arrow keys while focus is within the carousel", async () => {
    const user = userEvent.setup();
    renderSlides(3);

    screen.getByRole("button", { name: "Next" }).focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByText("Slide 3")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Slide 2")).toBeTruthy();
  });

  it("pages with document-level arrow keys when configured for dialog hosts", async () => {
    const user = userEvent.setup();
    renderSlides(2, { arrowKeys: "document" });

    // No focus inside the carousel — the document listener still pages.
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Slide 2")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Slide 1")).toBeTruthy();
  });

  it("supports the controlled mode", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderSlides(3, { index: 1, onIndexChange });

    expect(screen.getByText("Slide 2")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    // Controlled: the slide only moves when the owner updates `index`.
    expect(screen.getByText("Slide 2")).toBeTruthy();
  });

  it("announces carousel and slide semantics", () => {
    renderSlides(2, { label: "Attachments" });

    const region = screen.getByRole("group", { name: "Attachments" });
    expect(region.getAttribute("aria-roledescription")).toBe("carousel");
    const slide = screen.getByRole("group", { name: "1 of 2" });
    expect(slide.getAttribute("aria-roledescription")).toBe("slide");
  });
});
