import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationsMenu, type NotificationsMenuItem } from "./index";

const items: NotificationsMenuItem[] = [
  { id: "n1", title: "Document approved", description: "Bill of lading cleared", read: false },
  { id: "n2", title: "Shipment departed", timeLabel: "2h ago", read: true },
];

describe("NotificationsMenu", () => {
  it("announces the unread count on the bell and lists items on open", async () => {
    const onItemSelect = vi.fn();
    render(<NotificationsMenu items={items} onItemSelect={onItemSelect} />);

    const bell = screen.getByRole("button", { name: "Notifications (1 unread)" });
    await userEvent.click(bell);

    expect(await screen.findByRole("menuitem", { name: /Document approved/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Shipment departed/ })).toBeTruthy();

    await userEvent.click(screen.getByRole("menuitem", { name: /Document approved/ }));
    expect(onItemSelect).toHaveBeenCalledWith(items[0]);
  });

  it("offers mark-all-read only while something is unread", async () => {
    const onMarkAllRead = vi.fn();
    const { rerender } = render(<NotificationsMenu items={items} onMarkAllRead={onMarkAllRead} />);

    await userEvent.click(screen.getByRole("button", { name: "Notifications (1 unread)" }));
    await userEvent.click(await screen.findByRole("button", { name: "Mark all as read" }));
    expect(onMarkAllRead).toHaveBeenCalledOnce();

    rerender(
      <NotificationsMenu
        items={items.map((item) => ({ ...item, read: true }))}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    expect(screen.queryByRole("button", { name: "Mark all as read" })).toBeNull();
    // All read — the bell drops the count from its accessible name (close the
    // menu first: Radix aria-hides the trigger while the menu is open).
    await userEvent.keyboard("{Escape}");
    expect(await screen.findByRole("button", { name: "Notifications" })).toBeTruthy();
  });

  it("shows the empty state when there is nothing to list", async () => {
    render(<NotificationsMenu items={[]} />);

    await userEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(await screen.findByText("You're all caught up")).toBeTruthy();
  });
});
