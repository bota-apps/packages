import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Mail } from "lucide-react";
import { DetailField, InfoRow, detailFieldIconVariants, infoRowVariants } from "./index";
import { TooltipProvider } from "../tooltip";

afterEach(cleanup);

describe("DetailField", () => {
  it("renders the label and value", () => {
    render(<DetailField label="Email" value="user@example.com" />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("user@example.com")).toBeTruthy();
  });

  it("styles the leading icon with the icon variant classes", () => {
    render(<DetailField icon={<Mail data-testid="icon" />} label="Email" value="a@b.c" />);
    const wrapper = screen.getByTestId("icon").parentElement;
    expect(wrapper?.className).toContain(detailFieldIconVariants());
  });

  it("copies the copy value and flips to the copied state", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <DetailField label="Email" value="user@example.com" copyable copyValue="user@example.com" />
      </TooltipProvider>,
    );
    await user.click(screen.getByRole("button"));
    await waitFor(() => expect(document.querySelector(".lucide-check")).toBeTruthy());
    await expect(navigator.clipboard.readText()).resolves.toBe("user@example.com");
  });

  it("does not render a copy button without copyValue", () => {
    render(<DetailField label="Email" value="user@example.com" copyable />);
    expect(screen.queryByRole("button")).not.toBeTruthy();
  });
});

describe("InfoRow", () => {
  it("renders the icon and content with muted styling", () => {
    render(<InfoRow icon={<Mail data-testid="row-icon" />}>Addis Ababa</InfoRow>);
    expect(screen.getByText("Addis Ababa")).toBeTruthy();
    const row = screen.getByTestId("row-icon").parentElement?.parentElement;
    expect(row?.className).toContain(infoRowVariants());
  });
});
