import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./index";
import { toastVariants } from "./variants";

function renderToast(props: { variant?: "default" | "destructive" } = {}, onOpenChange = vi.fn()) {
  return render(
    <ToastProvider>
      <Toast data-testid="toast-root" open onOpenChange={onOpenChange} {...props}>
        <div>
          <ToastTitle>Scheduled</ToastTitle>
          <ToastDescription>Your report is scheduled for Friday.</ToastDescription>
        </div>
        <ToastClose aria-label="Close" />
      </Toast>
      <ToastViewport />
    </ToastProvider>,
  );
}

describe("Toast", () => {
  it("renders title and description inside the viewport", () => {
    renderToast();

    const root = screen.getByTestId("toast-root");
    expect(root.textContent).toContain("Scheduled");
    expect(root.textContent).toContain("Your report is scheduled for Friday.");
    // The viewport region is labelled for assistive tech.
    expect(screen.getByRole("region", { name: /notifications/i })).toBeTruthy();
  });

  it("applies the default variant classes", () => {
    renderToast();

    const root = screen.getByTestId("toast-root");
    expect(root.className).toContain("bg-background");
    expect(root.className).toContain("rounded-md");
  });

  it("applies the destructive variant classes", () => {
    renderToast({ variant: "destructive" });

    const root = screen.getByTestId("toast-root");
    expect(root.className).toContain("bg-destructive");
    expect(toastVariants({ variant: "destructive" })).toContain("border-destructive");
  });

  it("requests close via the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderToast({}, onOpenChange);

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
