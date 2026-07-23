import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Copy, FileUp } from "lucide-react";
import { SplitButton, type SplitButtonItem } from "./index";

afterEach(cleanup);

function makeItems(overrides?: {
  onDuplicate?: () => void;
  duplicate?: Partial<SplitButtonItem>;
  importFile?: Partial<SplitButtonItem>;
}): SplitButtonItem[] {
  return [
    {
      id: "duplicate",
      label: "Duplicate existing",
      description: "Start from a previous entry",
      icon: Copy,
      onSelect: overrides?.onDuplicate ?? (() => {}),
      ...overrides?.duplicate,
    },
    {
      id: "import",
      label: "Import from file",
      icon: FileUp,
      separatorBefore: true,
      onSelect: () => {},
      ...overrides?.importFile,
    },
  ];
}

describe("SplitButton", () => {
  it("fires the primary action without opening the menu", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton onClick={onClick} menuLabel="More options" items={makeItems()}>
        New entry
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "New entry" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens the menu from the labelled chevron trigger and selects an item", async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn();
    render(
      <SplitButton onClick={() => {}} menuLabel="More options" items={makeItems({ onDuplicate })}>
        New entry
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "More options" }));

    expect(await screen.findByRole("menu")).toBeTruthy();
    expect(screen.getByText("Start from a previous entry")).toBeTruthy();

    await user.click(screen.getByRole("menuitem", { name: /Duplicate existing/ }));

    expect(onDuplicate).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("supports keyboard navigation and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <SplitButton onClick={() => {}} menuLabel="More options" items={makeItems()}>
        New entry
      </SplitButton>,
    );

    const trigger = screen.getByRole("button", { name: "More options" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}");

    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: /Import from file/ }));

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("filters hidden items and keeps disabled items inert", async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn();
    render(
      <SplitButton
        onClick={() => {}}
        menuLabel="More options"
        items={makeItems({
          onDuplicate,
          duplicate: { disabled: true },
          importFile: { hidden: true },
        })}
      >
        New entry
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "More options" }));
    await screen.findByRole("menu");

    expect(screen.queryByRole("menuitem", { name: /Import from file/ })).toBeNull();

    const duplicate = screen.getByRole("menuitem", { name: /Duplicate existing/ });
    expect(duplicate.hasAttribute("data-disabled")).toBe(true);

    await user.click(duplicate);
    expect(onDuplicate).not.toHaveBeenCalled();
  });

  it("renders a plain button when every item is hidden", () => {
    render(
      <SplitButton
        onClick={() => {}}
        menuLabel="More options"
        items={makeItems({ duplicate: { hidden: true }, importFile: { hidden: true } })}
      >
        New entry
      </SplitButton>,
    );

    expect(screen.getByRole("button", { name: "New entry" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "More options" })).toBeNull();
  });

  it("disables both segments together and styles the trigger per variant", () => {
    render(
      <SplitButton
        onClick={() => {}}
        menuLabel="More options"
        items={makeItems()}
        variant="secondary"
        disabled
      >
        New entry
      </SplitButton>,
    );

    const primary = screen.getByRole("button", { name: "New entry" });
    const trigger = screen.getByRole("button", { name: "More options" });
    expect(primary.hasAttribute("disabled")).toBe(true);
    expect(trigger.hasAttribute("disabled")).toBe(true);
    expect(trigger.className).toContain("bg-secondary");
    expect(trigger.className).toContain("rounded-l-none");
    expect(primary.className).toContain("rounded-r-none");
  });
});
