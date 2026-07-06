import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./index";

function renderAccordion(props: { defaultValue?: string; collapsible?: boolean } = {}) {
  return render(
    <Accordion type="single" {...props}>
      <AccordionItem value="a">
        <AccordionTrigger value="a">Section A</AccordionTrigger>
        <AccordionContent value="a">Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger value="b">Section B</AccordionTrigger>
        <AccordionContent value="b">Content B</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

afterEach(cleanup);

describe("Accordion", () => {
  it("renders all triggers with content hidden by default", () => {
    renderAccordion();
    expect(screen.getByText("Section A")).toBeTruthy();
    expect(screen.getByText("Section B")).toBeTruthy();
    expect(screen.queryByText("Content A")).not.toBeTruthy();
    expect(screen.queryByText("Content B")).not.toBeTruthy();
  });

  it("opens the section for a clicked trigger and switches between sections", async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByText("Section A"));
    expect(screen.getByText("Content A")).toBeTruthy();
    await user.click(screen.getByText("Section B"));
    expect(screen.getByText("Content B")).toBeTruthy();
    expect(screen.queryByText("Content A")).not.toBeTruthy();
  });

  it("shows the defaultValue section initially", () => {
    renderAccordion({ defaultValue: "b" });
    expect(screen.getByText("Content B")).toBeTruthy();
    expect(screen.queryByText("Content A")).not.toBeTruthy();
  });

  it("closes an open section again when collapsible", async () => {
    const user = userEvent.setup();
    renderAccordion({ collapsible: true });
    await user.click(screen.getByText("Section A"));
    expect(screen.getByText("Content A")).toBeTruthy();
    await user.click(screen.getByText("Section A"));
    expect(screen.queryByText("Content A")).not.toBeTruthy();
  });

  it("reflects open state on the trigger via data-state", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByText("Section A").closest("button") as HTMLButtonElement;
    expect(trigger.getAttribute("data-state")).toBe("closed");
    await user.click(trigger);
    expect(trigger.getAttribute("data-state")).toBe("open");
  });
});
