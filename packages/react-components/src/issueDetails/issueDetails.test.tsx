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

    // Screenshot with a URL renders as a linked thumbnail...
    const thumbnail = screen.getByRole("img", { name: "create-form.png" });
    const link = thumbnail.closest("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("target")).toBe("_blank");
    // ...while one without a URL renders as a file-name chip.
    expect(screen.getByText("console-output.png")).toBeTruthy();

    expect(screen.getByRole("heading", { name: "Reported by" })).toBeTruthy();
    expect(screen.getByText("Alex Doe")).toBeTruthy();
    expect(screen.getByText("alex@example.com")).toBeTruthy();
  });

  it("hides the optional sections when the issue has no data for them", () => {
    render(<IssueDetails issue={sampleIssues[1]} featureLabel={sampleFeatureLabel} />);

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
