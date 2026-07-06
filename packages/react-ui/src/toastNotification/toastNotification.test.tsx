import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastContainer, ToastNotification } from "./index";

afterEach(cleanup);

describe("ToastNotification", () => {
  it("renders title and description", () => {
    render(
      <ToastNotification
        variant="success"
        title="Project updated"
        description="Project #1042 was marked complete."
      />,
    );

    expect(screen.getByText("Project updated")).toBeTruthy();
    expect(screen.getByText("Project #1042 was marked complete.")).toBeTruthy();
  });

  it("applies the variant styling from html/notification", () => {
    const { container } = render(<ToastNotification variant="error" title="Error" />);

    const root = container.firstElementChild;
    expect(root?.className).toContain("bg-red-500");
    expect(root?.className).toContain("rounded-lg");
  });

  it("calls onDismiss from the dismiss button and hides it otherwise", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(
      <ToastNotification variant="info" title="Heads up" onDismiss={onDismiss} />,
    );

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    rerender(<ToastNotification variant="info" title="Heads up" />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeTruthy();
  });

  it("renders children inside the toast container", () => {
    render(
      <ToastContainer>
        <ToastNotification variant="notification" title="You have 3 unread messages" />
      </ToastContainer>,
    );

    expect(screen.getByText("You have 3 unread messages")).toBeTruthy();
  });
});
