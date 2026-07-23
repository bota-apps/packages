import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { sampleFeatureLabel, sampleIssues } from "../issueReporter/fixtures";
import { IssueDetails } from "./index";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

describe("IssueDetails", () => {
  it("renders every populated section", () => {
    render(<IssueDetails issue={sampleIssues[0]} featureLabel={sampleFeatureLabel} />);

    expect(screen.getByRole("heading", { name: "Create project" })).toBeTruthy();
    expect(screen.getByText("In progress")).toBeTruthy();
    expect(screen.getByText(/create button stays disabled/)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Steps to reproduce" })).toBeTruthy();
    expect(screen.getByText(/Open create project/)).toBeTruthy();

    // Screenshot with a URL renders as an in-app preview trigger — no new-tab
    // link anywhere...
    const trigger = screen.getByRole("button", { name: "Preview create-form.png" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(document.querySelector("a[target='_blank']")).toBeNull();
    // ...while one without a URL renders as a file-name chip.
    expect(screen.getByText("console-output.png")).toBeTruthy();

    expect(screen.getByRole("heading", { name: "Reported by" })).toBeTruthy();
    expect(screen.getByText("Alex Doe")).toBeTruthy();
    expect(screen.getByText("alex@example.com")).toBeTruthy();
  });

  it("previews a lone screenshot in an image dialog", async () => {
    const user = userEvent.setup();
    render(<IssueDetails issue={sampleIssues[0]} featureLabel={sampleFeatureLabel} />);

    await user.click(screen.getByRole("button", { name: "Preview create-form.png" }));
    const dialog = screen.getByRole("dialog", { name: "create-form.png" });
    expect(dialog).toBeTruthy();
    // A single previewable screenshot needs no pager.
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("pages multiple screenshots in one carousel dialog", async () => {
    const user = userEvent.setup();
    const screenshots = [
      {
        id: "shot-a",
        fileName: "step-1.png",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>",
      },
      {
        id: "shot-b",
        fileName: "step-2.png",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>",
      },
      {
        id: "shot-c",
        fileName: "step-3.png",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>",
      },
    ];
    render(
      <IssueDetails
        issue={{ ...sampleIssues[0], screenshots }}
        featureLabel={sampleFeatureLabel}
      />,
    );

    // Opens at the clicked screenshot, not the first.
    await user.click(screen.getByRole("button", { name: "Preview step-2.png" }));
    expect(screen.getByRole("dialog", { name: "step-2.png" })).toBeTruthy();
    expect(screen.getByText("2 of 3")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("dialog", { name: "step-3.png" })).toBeTruthy();
    expect(screen.getByText("3 of 3")).toBeTruthy();

    // Arrow keys page from anywhere inside the modal.
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("2 of 3")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders attached technical context in its own triage section", () => {
    render(
      <IssueDetails
        issue={{ ...sampleIssues[1], technicalContext: '{"errors":[{"message":"boom"}]}' }}
        featureLabel={sampleFeatureLabel}
      />,
    );

    expect(screen.getByRole("heading", { name: "Technical details" })).toBeTruthy();
    expect(screen.getByText('{"errors":[{"message":"boom"}]}')).toBeTruthy();
  });

  it("hides the optional sections when the issue has no data for them", () => {
    render(<IssueDetails issue={sampleIssues[1]} featureLabel={sampleFeatureLabel} />);

    expect(screen.queryByRole("heading", { name: "Technical details" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Steps to reproduce" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Screenshots" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Reported by" })).toBeNull();
    // No status editing without statusOptions + onUpdateStatus.
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("updates the status through the handler and reflects the pending state", async () => {
    const user = userEvent.setup();
    let resolveUpdate!: () => void;
    const onUpdateStatus = vi.fn<(status: string) => Promise<void>>().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveUpdate = resolve;
        }),
    );
    render(
      <IssueDetails
        issue={sampleIssues[1]}
        featureLabel={sampleFeatureLabel}
        statusOptions={statusOptions}
        onUpdateStatus={onUpdateStatus}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Resolved" }));

    expect(onUpdateStatus).toHaveBeenCalledWith("resolved");
    expect(await screen.findByText("Updating status...")).toBeTruthy();
    expect((screen.getByRole("combobox") as HTMLButtonElement).disabled).toBe(true);

    resolveUpdate();
    await waitFor(() => expect(screen.queryByText("Updating status...")).toBeNull());
    expect((screen.getByRole("combobox") as HTMLButtonElement).disabled).toBe(false);
  });
});
