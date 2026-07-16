import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUpload } from "./index";

afterEach(cleanup);

function makeFile(name: string, type: string, sizeBytes = 16): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

function fileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    throw new Error("file input not rendered");
  }
  return input;
}

describe("FileUpload", () => {
  it("renders the default label and a description derived from accept and maxSizeBytes", () => {
    const { container } = render(
      <FileUpload onFilesSelected={vi.fn()} accept=".pdf,image/*" maxSizeBytes={5 * 1024 * 1024} />,
    );
    expect(screen.getByRole("button", { name: "Upload a file" })).toBeDefined();
    expect(screen.getByText("Accepted: .pdf, image/* · Max 5 MB")).toBeDefined();
    expect(fileInput(container).getAttribute("accept")).toBe(".pdf,image/*");
  });

  it("adapts the default label when multiple", () => {
    render(<FileUpload onFilesSelected={vi.fn()} multiple />);
    expect(screen.getByRole("button", { name: "Upload files" })).toBeDefined();
  });

  it("opens the hidden input from the visible trigger (keyboard included)", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload onFilesSelected={vi.fn()} />);
    const click = vi.spyOn(fileInput(container), "click");

    // The trigger is a real button: it is reachable by keyboard (the hidden
    // input is not) and Enter activates it.
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Upload a file" }));
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Upload a file" }));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it("fires onFilesSelected from the input change event", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const { container } = render(<FileUpload onFilesSelected={onFilesSelected} />);

    const file = makeFile("statement.pdf", "application/pdf");
    await user.upload(fileInput(container), file);

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("routes files that fail the accept filter to onInvalidFiles with reason type", async () => {
    // applyAccept: false lets the mismatched file through the simulated
    // native picker so the component's own validation is what rejects it.
    const user = userEvent.setup({ applyAccept: false });
    const onFilesSelected = vi.fn();
    const onInvalidFiles = vi.fn();
    const { container } = render(
      <FileUpload
        accept=".pdf"
        onFilesSelected={onFilesSelected}
        onInvalidFiles={onInvalidFiles}
      />,
    );

    const file = makeFile("notes.txt", "text/plain");
    await user.upload(fileInput(container), file);

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(onInvalidFiles).toHaveBeenCalledWith([{ file, reason: "type" }]);
  });

  it("routes files over maxSizeBytes to onInvalidFiles with reason size", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const onInvalidFiles = vi.fn();
    const { container } = render(
      <FileUpload
        maxSizeBytes={8}
        onFilesSelected={onFilesSelected}
        onInvalidFiles={onInvalidFiles}
      />,
    );

    const file = makeFile("photo.png", "image/png", 32);
    await user.upload(fileInput(container), file);

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(onInvalidFiles).toHaveBeenCalledWith([{ file, reason: "size" }]);
  });

  it("toggles the drag-over state while dragging and accepts dropped files", () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const dropzone = screen.getByRole("button", { name: "Upload a file" });

    expect(dropzone.getAttribute("data-drag-over")).toBeNull();
    fireEvent.dragOver(dropzone);
    expect(dropzone.getAttribute("data-drag-over")).toBe("true");
    expect(dropzone.className).toContain("border-solid");
    fireEvent.dragLeave(dropzone);
    expect(dropzone.getAttribute("data-drag-over")).toBeNull();

    const file = makeFile("report.csv", "text/csv");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
    expect(dropzone.getAttribute("data-drag-over")).toBeNull();
  });

  it("takes only the first dropped file unless multiple is set", () => {
    const onFilesSelected = vi.fn();
    const first = makeFile("a.txt", "text/plain");
    const second = makeFile("b.txt", "text/plain");

    const { unmount } = render(<FileUpload onFilesSelected={onFilesSelected} />);
    fireEvent.drop(screen.getByRole("button", { name: "Upload a file" }), {
      dataTransfer: { files: [first, second] },
    });
    expect(onFilesSelected).toHaveBeenCalledWith([first]);
    unmount();

    const onMultipleSelected = vi.fn();
    render(<FileUpload onFilesSelected={onMultipleSelected} multiple />);
    fireEvent.drop(screen.getByRole("button", { name: "Upload files" }), {
      dataTransfer: { files: [first, second] },
    });
    expect(onMultipleSelected).toHaveBeenCalledWith([first, second]);
  });

  it("ignores activation and drops while disabled, and announces the state", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const { container } = render(<FileUpload onFilesSelected={onFilesSelected} disabled />);
    const dropzone = screen.getByRole("button", { name: "Upload a file" });
    const click = vi.spyOn(fileInput(container), "click");

    expect(dropzone.getAttribute("aria-disabled")).toBe("true");
    await user.click(dropzone);
    expect(click).not.toHaveBeenCalled();

    fireEvent.dragOver(dropzone);
    expect(dropzone.getAttribute("data-drag-over")).toBeNull();
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("a.txt", "text/plain")] } });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("announces busy and suspends the input", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload onFilesSelected={vi.fn()} busy />);
    const dropzone = screen.getByRole("button", { name: "Upload a file" });
    const click = vi.spyOn(fileInput(container), "click");

    expect(dropzone.getAttribute("aria-busy")).toBe("true");
    expect(fileInput(container).disabled).toBe(true);
    await user.click(dropzone);
    expect(click).not.toHaveBeenCalled();
  });

  it("renders the compact button variant with the same hidden-input wiring", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload onFilesSelected={vi.fn()} variant="button" />);
    const trigger = screen.getByRole("button", { name: "Upload a file" });
    const click = vi.spyOn(fileInput(container), "click");

    await user.click(trigger);
    expect(click).toHaveBeenCalledTimes(1);
  });
});
