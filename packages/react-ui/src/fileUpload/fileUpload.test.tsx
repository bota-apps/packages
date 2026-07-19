import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileUpload, FileUploadPreview } from "./index";

afterEach(cleanup);

// jsdom ships no object-URL implementation; the preview owns the
// create/revoke lifecycle, so both ends are observable through these stubs.
const createObjectUrl = vi.fn((source: Blob | MediaSource) =>
  source instanceof File ? `blob:${source.name}` : "blob:unknown",
);
const revokeObjectUrl = vi.fn();

beforeEach(() => {
  createObjectUrl.mockClear();
  revokeObjectUrl.mockClear();
  URL.createObjectURL = createObjectUrl;
  URL.revokeObjectURL = revokeObjectUrl;
});

function makeFile(
  name: string,
  type: string,
  sizeBytes = 16,
  lastModified = 1_700_000_000_000,
): File {
  return new File([new Uint8Array(sizeBytes)], name, { type, lastModified });
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

describe("FileUpload controlled selection", () => {
  it("replaces the selection in single mode", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const onFilesSelected = vi.fn();
    const current = makeFile("first.pdf", "application/pdf");
    const { container } = render(
      <FileUpload
        files={[current]}
        onFilesChange={onFilesChange}
        onFilesSelected={onFilesSelected}
      />,
    );

    const next = makeFile("second.pdf", "application/pdf");
    await user.upload(fileInput(container), next);

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange).toHaveBeenCalledWith([next]);
    expect(onFilesSelected).toHaveBeenCalledWith([next]);
  });

  it("accumulates selections in multiple mode without duplicating identical files", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const current = makeFile("kept.pdf", "application/pdf");
    const { container } = render(
      <FileUpload multiple files={[current]} onFilesChange={onFilesChange} />,
    );

    const duplicate = makeFile("kept.pdf", "application/pdf");
    const fresh = makeFile("added.csv", "text/csv");
    await user.upload(fileInput(container), [duplicate, fresh]);

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange).toHaveBeenCalledWith([current, fresh]);
  });

  it("skips the change callback when every selected file is already listed", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const current = makeFile("kept.pdf", "application/pdf");
    const { container } = render(
      <FileUpload multiple files={[current]} onFilesChange={onFilesChange} />,
    );

    await user.upload(fileInput(container), makeFile("kept.pdf", "application/pdf"));
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("keeps validation rejections working in controlled mode", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onFilesChange = vi.fn();
    const onInvalidFiles = vi.fn();
    const { container } = render(
      <FileUpload
        accept=".pdf"
        files={[]}
        onFilesChange={onFilesChange}
        onInvalidFiles={onInvalidFiles}
      />,
    );

    const file = makeFile("notes.txt", "text/plain");
    await user.upload(fileInput(container), file);

    expect(onFilesChange).not.toHaveBeenCalled();
    expect(onInvalidFiles).toHaveBeenCalledWith([{ file, reason: "type" }]);
  });

  it("previews an image file as an object-URL thumbnail and revokes it on unmount", () => {
    const image = makeFile("photo.png", "image/png");
    const { container, unmount } = render(<FileUpload files={[image]} onFilesChange={vi.fn()} />);

    expect(createObjectUrl).toHaveBeenCalledWith(image);
    const thumb = container.querySelector("img");
    expect(thumb?.getAttribute("src")).toBe("blob:photo.png");

    unmount();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:photo.png");
  });

  it("previews a non-image file with a format icon, name, and readable size", () => {
    const doc = makeFile("agreement.pdf", "application/pdf", 2048);
    const { container } = render(<FileUpload files={[doc]} onFilesChange={vi.fn()} />);

    expect(createObjectUrl).not.toHaveBeenCalled();
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("agreement.pdf")).toBeDefined();
    expect(screen.getByText("2 KB")).toBeDefined();
    expect(screen.getByRole("list", { name: "Selected files" })).toBeDefined();
  });

  it("removes a single file and revokes its thumbnail URL", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const image = makeFile("photo.png", "image/png");
    const doc = makeFile("agreement.pdf", "application/pdf");
    const { rerender } = render(
      <FileUpload multiple files={[image, doc]} onFilesChange={onFilesChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Remove photo.png" }));
    expect(onFilesChange).toHaveBeenCalledWith([doc]);

    rerender(<FileUpload multiple files={[doc]} onFilesChange={onFilesChange} />);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:photo.png");
  });

  it("shows clear-all only for multi-file selections and empties the list", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const files = [makeFile("one.pdf", "application/pdf"), makeFile("two.csv", "text/csv")];
    const { rerender } = render(
      <FileUpload multiple files={files} onFilesChange={onFilesChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onFilesChange).toHaveBeenCalledWith([]);

    rerender(<FileUpload multiple files={[files[0]!]} onFilesChange={onFilesChange} />);
    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
  });

  it("suspends remove and clear-all while busy", () => {
    const files = [makeFile("one.pdf", "application/pdf"), makeFile("two.csv", "text/csv")];
    render(<FileUpload multiple busy files={files} onFilesChange={vi.fn()} />);

    const remove = screen.getByRole("button", { name: "Remove one.pdf" });
    expect(remove.hasAttribute("disabled")).toBe(true);
    const clearAll = screen.getByRole("button", { name: "Clear all" });
    expect(clearAll.hasAttribute("disabled")).toBe(true);
  });

  it("renders the preview under the button variant too", () => {
    const doc = makeFile("agreement.pdf", "application/pdf");
    render(<FileUpload variant="button" files={[doc]} onFilesChange={vi.fn()} />);
    expect(screen.getByRole("list", { name: "Selected files" })).toBeDefined();
    expect(screen.getByText("agreement.pdf")).toBeDefined();
  });
});

/** Owns the file list so lightbox interactions that mutate it can play out. */
function ControlledUpload({ initial }: { initial: File[] }) {
  const [files, setFiles] = useState(initial);
  return <FileUpload multiple files={files} onFilesChange={setFiles} />;
}

describe("FileUpload preview lightbox", () => {
  it("opens a full-size preview from a row trigger and closes on Escape", async () => {
    const user = userEvent.setup();
    const image = makeFile("photo.png", "image/png");
    render(<FileUpload files={[image]} onFilesChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Preview photo.png" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("photo.png")).toBeDefined();
    // Thumbnail and stage each own an object URL for the same file.
    expect(createObjectUrl).toHaveBeenCalledTimes(2);
    expect(within(dialog).getByAltText("photo.png").getAttribute("src")).toBe("blob:photo.png");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    // Closing unmounts the stage and revokes its URL; the thumbnail keeps its own.
    expect(revokeObjectUrl).toHaveBeenCalledTimes(1);
  });

  it("pages through the selection with buttons and arrow keys, clamping at the ends", async () => {
    const user = userEvent.setup();
    const files = [
      makeFile("a.png", "image/png"),
      makeFile("b.pdf", "application/pdf"),
      makeFile("c.txt", "text/plain"),
    ];
    render(<FileUpload multiple files={files} onFilesChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Preview a.png" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("1 of 3")).toBeDefined();
    const previous = within(dialog).getByRole("button", { name: "Previous file" });
    expect(previous.hasAttribute("disabled")).toBe(true);

    await user.click(within(dialog).getByRole("button", { name: "Next file" }));
    expect(within(dialog).getByText("2 of 3")).toBeDefined();
    const frame = dialog.querySelector("iframe");
    expect(frame?.getAttribute("title")).toBe("b.pdf");
    expect(frame?.getAttribute("src")).toBe("blob:b.pdf");

    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByText("3 of 3")).toBeDefined();
    expect(within(dialog).getByText("Preview not available")).toBeDefined();
    const next = within(dialog).getByRole("button", { name: "Next file" });
    expect(next.hasAttribute("disabled")).toBe(true);
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByText("3 of 3")).toBeDefined();

    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByText("2 of 3")).toBeDefined();
  });

  it("removes the staged file from the lightbox, staging the next and closing on the last", async () => {
    const user = userEvent.setup();
    render(
      <ControlledUpload
        initial={[makeFile("a.png", "image/png"), makeFile("b.pdf", "application/pdf")]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Preview a.png" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Remove a.png" }));

    // The next file takes the stage; with one file left the pager disappears.
    expect(within(dialog).getByText("b.pdf")).toBeDefined();
    expect(within(dialog).queryByRole("button", { name: "Next file" })).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Remove b.pdf" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("keeps the lightbox open for viewing while busy but suspends its remove action", async () => {
    const user = userEvent.setup();
    const doc = makeFile("agreement.pdf", "application/pdf");
    render(<FileUpload busy files={[doc]} onFilesChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Preview agreement.pdf" }));
    const dialog = screen.getByRole("dialog");
    const remove = within(dialog).getByRole("button", { name: "Remove agreement.pdf" });
    expect(remove.hasAttribute("disabled")).toBe(true);
  });

  it("supports overriding every lightbox label", async () => {
    const user = userEvent.setup();
    const files = [makeFile("one.txt", "text/plain"), makeFile("two.txt", "text/plain")];
    render(
      <FileUploadPreview
        files={files}
        onRemove={vi.fn()}
        previewLabel={(fileName) => `Open ${fileName}`}
        closeLabel="Dismiss"
        previousLabel="Back"
        nextLabel="Forward"
        positionLabel={(position, total) => `${position}/${total}`}
        previewUnavailableLabel="No inline view"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Open one.txt" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("No inline view")).toBeDefined();
    expect(within(dialog).getByText("1/2")).toBeDefined();
    expect(within(dialog).getByRole("button", { name: "Back" })).toBeDefined();
    await user.click(within(dialog).getByRole("button", { name: "Forward" }));
    expect(within(dialog).getByText("2/2")).toBeDefined();
    await user.click(within(dialog).getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("passes the lightbox labels through the FileUpload surface", async () => {
    const user = userEvent.setup();
    const doc = makeFile("agreement.pdf", "application/pdf");
    render(
      <FileUpload
        files={[doc]}
        onFilesChange={vi.fn()}
        previewFileLabel={(fileName) => `Inspect ${fileName}`}
        previewCloseLabel="Done"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Inspect agreement.pdf" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Done" })).toBeDefined();
  });
});

describe("FileUploadPreview", () => {
  it("renders nothing for an empty list", () => {
    const { container } = render(<FileUploadPreview files={[]} onRemove={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("works standalone with overridable labels", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    const files = [makeFile("one.pdf", "application/pdf"), makeFile("two.csv", "text/csv")];
    render(
      <FileUploadPreview
        files={files}
        onRemove={onRemove}
        onClearAll={onClearAll}
        listLabel="Attachments"
        removeLabel={(fileName) => `Drop ${fileName}`}
        clearAllLabel="Remove everything"
      />,
    );

    expect(screen.getByRole("list", { name: "Attachments" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Drop one.pdf" }));
    expect(onRemove).toHaveBeenCalledWith(files[0]);
    await user.click(screen.getByRole("button", { name: "Remove everything" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
