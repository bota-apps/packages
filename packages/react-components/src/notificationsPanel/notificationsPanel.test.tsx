import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { NotificationsMenuItem } from "../notificationsMenu";
import { NotificationsPanel, NotificationsTrigger } from "./index";

const items: readonly NotificationsMenuItem[] = [
  { id: "n1", title: "Fresh arrival", description: "Something new happened", read: false },
  { id: "n2", title: "Older news", timeLabel: "2d ago", read: true },
];

describe("NotificationsTrigger", () => {
  it("badges the unread count and reflects the panel state as pressed", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <NotificationsTrigger unreadCount={12} active={false} onClick={onClick} />,
    );
    const trigger = screen.getByRole("button", { name: "Notifications (12 unread)" });
    expect(trigger.textContent).toContain("9+");
    expect(trigger.getAttribute("aria-pressed")).toBe("false");
    rerender(<NotificationsTrigger unreadCount={0} active onClick={onClick} />);
    expect(screen.getByRole("button", { name: "Notifications" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });
});

describe("NotificationsPanel", () => {
  it("lists the items and reports selections", async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();
    render(<NotificationsPanel open items={items} onItemSelect={onItemSelect} />);
    expect(screen.getByRole("complementary", { name: "Notifications" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Fresh arrival/ }));
    expect(onItemSelect).toHaveBeenCalledWith(items[0]);
    expect(screen.getByText("2d ago")).toBeTruthy();
  });

  it("offers mark-all-read only while something is unread", async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();
    const { rerender } = render(
      <NotificationsPanel open items={items} onMarkAllRead={onMarkAllRead} />,
    );
    await user.click(screen.getByRole("button", { name: "Mark all as read" }));
    expect(onMarkAllRead).toHaveBeenCalledOnce();
    rerender(
      <NotificationsPanel
        open
        items={items.map((item) => ({ ...item, read: true }))}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    expect(screen.queryByRole("button", { name: "Mark all as read" })).toBeNull();
  });

  it("shows the empty state when there is nothing to list", () => {
    render(<NotificationsPanel open items={[]} emptyLabel="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });
});
