import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ImagePreview } from "./index";

const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>";

describe("ImagePreview", () => {
  it("opens the full-size preview in a dialog instead of navigating", async () => {
    const user = userEvent.setup();
    render(<ImagePreview src={src} alt="diagram.png" />);

    const trigger = screen.getByRole("button", { name: "Preview diagram.png" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "diagram.png" });
    expect(dialog).toBeTruthy();
    expect(screen.getByRole("img", { name: "diagram.png" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("supports localized trigger, title, and close labels", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={src}
        alt="diagram.png"
        title="Diagram"
        previewLabel="ቅድመ እይታ"
        closeLabel="ዝጋ"
      />,
    );

    await user.click(screen.getByRole("button", { name: "ቅድመ እይታ" }));
    expect(screen.getByRole("dialog", { name: "Diagram" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "ዝጋ" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
