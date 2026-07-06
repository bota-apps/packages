import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./index";

afterEach(cleanup);

describe("Collapsible", () => {
  it("hides content until the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Show more</CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole("button", { name: "Show more" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Hidden details")).not.toBeTruthy();

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Hidden details")).toBeTruthy();

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Show more</CollapsibleTrigger>
        <CollapsibleContent>Already visible</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Already visible")).toBeTruthy();
  });
});
