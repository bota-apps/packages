import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleFeatureTree } from "./fixtures";
import { IssueReporter } from "./index";
import type { CreateIssuePayload } from "./types";

// jsdom ships no object-URL implementation; the FileUpload preview needs one.
beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:screenshot");
  URL.revokeObjectURL = vi.fn();
});

type CreateIssueHandler = (payload: CreateIssuePayload) => Promise<void>;

function deferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function openReporter(
  user: ReturnType<typeof userEvent.setup>,
  onCreateIssue: CreateIssueHandler,
  defaultFeatureId?: string,
) {
  render(
    <IssueReporter
      featureTree={sampleFeatureTree}
      trigger="Report an issue"
      onCreateIssue={onCreateIssue}
      defaultFeatureId={defaultFeatureId}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Report an issue" }));
  expect(await screen.findByRole("dialog")).toBeTruthy();
}

async function pickFeature(user: ReturnType<typeof userEvent.setup>, optionName: RegExp) {
  await user.click(screen.getByRole("combobox"));
  await user.click(await screen.findByRole("option", { name: optionName }));
}

describe("IssueReporter", () => {
  it("validates the required fields before calling the handler", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue);

    await user.click(screen.getByRole("button", { name: "Submit issue" }));

    expect(screen.getByText("Select the feature the issue relates to.")).toBeTruthy();
    expect(screen.getByText("Describe the problem before submitting.")).toBeTruthy();
    expect(onCreateIssue).not.toHaveBeenCalled();
  });

  it("collects the feature, texts, screenshot, and contact into the payload", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue);

    await pickFeature(user, /Create project/);
    await user.type(screen.getByLabelText("What happened?"), "The button stays disabled");
    await user.type(
      screen.getByLabelText("Steps to reproduce (optional)"),
      "Open the form and submit twice",
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    const screenshot = new File(["png-bytes"], "shot.png", { type: "image/png" });
    await user.upload(fileInput as HTMLInputElement, screenshot);

    await user.type(screen.getByLabelText("Your name (optional)"), "Alex Doe");
    await user.type(screen.getByLabelText("Your email (optional)"), "alex@example.com");
    await user.click(screen.getByRole("button", { name: "Submit issue" }));

    await waitFor(() => expect(onCreateIssue).toHaveBeenCalledOnce());
    const payload = onCreateIssue.mock.calls[0][0];
    expect(payload).toMatchObject({
      featureId: "projects.create",
      description: "The button stays disabled",
      reproSteps: "Open the form and submit twice",
      contactName: "Alex Doe",
      contactEmail: "alex@example.com",
    });
    expect(payload.screenshots).toHaveLength(1);
    expect(payload.screenshots[0].name).toBe("shot.png");
  });

  it("preselects the default feature", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue, "reports.usage");

    expect(screen.getByRole("combobox").textContent).toContain("Usage report");
  });

  it("disables submit while pending, then confirms and closes on success", async () => {
    const user = userEvent.setup();
    const submission = deferred();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockReturnValue(submission.promise);
    await openReporter(user, onCreateIssue);

    await pickFeature(user, /Usage report/);
    await user.type(screen.getByLabelText("What happened?"), "Numbers are shifted");
    await user.click(screen.getByRole("button", { name: "Submit issue" }));

    const pendingButton = await screen.findByRole("button", { name: "Submitting..." });
    expect((pendingButton as HTMLButtonElement).disabled).toBe(true);

    submission.resolve();
    expect(await screen.findByText("Issue reported — thank you!")).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), { timeout: 3000 });
  });

  it("surfaces a submit error, preserves the values, and allows a retry", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi
      .fn<CreateIssueHandler>()
      .mockRejectedValueOnce(new Error("The issue service is unreachable."))
      .mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue);

    await pickFeature(user, /Members/);
    await user.type(screen.getByLabelText("What happened?"), "Avatar sticks around");
    await user.click(screen.getByRole("button", { name: "Submit issue" }));

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText("The issue service is unreachable.")).toBeTruthy();
    // The form keeps its values so the user can retry as-is.
    expect((screen.getByLabelText("What happened?") as HTMLTextAreaElement).value).toBe(
      "Avatar sticks around",
    );

    await user.click(screen.getByRole("button", { name: "Submit issue" }));
    expect(await screen.findByText("Issue reported — thank you!")).toBeTruthy();
    expect(onCreateIssue).toHaveBeenCalledTimes(2);
  });
});
