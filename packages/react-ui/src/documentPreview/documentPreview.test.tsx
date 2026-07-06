import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocumentPreview } from "./index";

const officeDoc = {
  url: "https://files.example.com/report.docx",
  name: "report.docx",
  mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

afterEach(cleanup);

describe("DocumentPreview", () => {
  it("defaults office files to the Microsoft Office Online viewer", () => {
    render(<DocumentPreview {...officeDoc} />);
    const iframe = screen.getByTitle<HTMLIFrameElement>("report.docx");
    expect(iframe.src).toBe(
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(officeDoc.url)}`,
    );
  });

  it("uses an injected office viewer", () => {
    render(
      <DocumentPreview
        {...officeDoc}
        officeViewerUrl={(fileUrl) =>
          `https://viewer.internal/embed?doc=${encodeURIComponent(fileUrl)}`
        }
      />,
    );
    const iframe = screen.getByTitle<HTMLIFrameElement>("report.docx");
    expect(iframe.src).toBe(
      `https://viewer.internal/embed?doc=${encodeURIComponent(officeDoc.url)}`,
    );
  });

  it("falls back to the unsupported state when officeViewerUrl is null", () => {
    render(<DocumentPreview {...officeDoc} officeViewerUrl={null} />);
    expect(screen.queryByTitle("report.docx")).not.toBeTruthy();
    expect(screen.getByText("Preview not available")).toBeTruthy();
  });

  it("applies label overrides to the unsupported-state buttons", () => {
    render(
      <DocumentPreview
        {...officeDoc}
        officeViewerUrl={null}
        labels={{ download: "አውርድ", open: "ክፈት" }}
        unsupportedTitle="ቅድመ እይታ የለም"
      />,
    );
    expect(screen.getByText("ቅድመ እይታ የለም")).toBeTruthy();
    // Toolbar buttons + unsupported-state buttons both carry the override.
    expect(screen.getAllByText("አውርድ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ክፈት").length).toBeGreaterThan(0);
  });

  it("renders images and PDFs directly (no third-party viewer)", () => {
    const { rerender } = render(
      <DocumentPreview url="https://x.example/pic.png" name="pic.png" mimeType="image/png" />,
    );
    expect(screen.getByAltText<HTMLImageElement>("pic.png").src).toBe("https://x.example/pic.png");

    rerender(
      <DocumentPreview url="https://x.example/doc.pdf" name="doc.pdf" mimeType="application/pdf" />,
    );
    expect(screen.getByTitle<HTMLIFrameElement>("doc.pdf").src).toBe("https://x.example/doc.pdf");
  });
});
