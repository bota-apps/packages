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

  it("shows feature descriptions in the picker", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue);

    await user.click(screen.getByRole("combobox"));
    const option = await screen.findByRole("option", { name: /Create project/ });
    expect(option.textContent).toContain("Start a new project from scratch or a template");
  });

  it("attaches technical context to the payload without rendering it into the form", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    render(
      <IssueReporter
        featureTree={sampleFeatureTree}
        trigger="Report an issue"
        onCreateIssue={onCreateIssue}
        defaultFeatureId="reports.usage"
        defaultTechnicalContext={'{"response":{"errors":[{"message":"boom"}]}}'}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Report an issue" }));

    // The user sees a notice, never the raw payload — and the repro-steps
    // field stays theirs to fill in.
    expect(
      screen.getByText("Technical error details will be attached to this report automatically."),
    ).toBeTruthy();
    expect(screen.queryByText(/"response"/)).toBeNull();
    const repro: HTMLTextAreaElement = screen.getByLabelText("Steps to reproduce (optional)");
    expect(repro.value).toBe("");

    await user.type(screen.getByLabelText("What happened?"), "Page failed to load");
    await user.click(screen.getByRole("button", { name: "Submit issue" }));
    await waitFor(() => expect(onCreateIssue).toHaveBeenCalledOnce());
    expect(onCreateIssue.mock.calls[0][0]).toMatchObject({
      technicalContext: '{"response":{"errors":[{"message":"boom"}]}}',
      reproSteps: undefined,
    });
  });

  it("offers no screen capture where the browser lacks the Screen Capture API", async () => {
    const user = userEvent.setup();
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    await openReporter(user, onCreateIssue);
    // jsdom has no navigator.mediaDevices — the affordance must not render.
    expect(screen.queryByRole("button", { name: "Capture screen" })).toBeNull();
  });

  it("captures a screen frame into the screenshot list when supported", async () => {
    const user = userEvent.setup();
    const track = { stop: vi.fn() };
    const getDisplayMedia = vi.fn().mockResolvedValue({ getTracks: () => [track] });
    // jsdom has no mediaDevices at all — install a minimal one for the test.
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getDisplayMedia },
      configurable: true,
    });
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.resolve());
    const toBlob = vi
      .spyOn(HTMLCanvasElement.prototype, "toBlob")
      .mockImplementation(function (this: HTMLCanvasElement, callback: BlobCallback) {
        callback(new Blob(["frame"], { type: "image/png" }));
      });
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);

    try {
      const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
      await openReporter(user, onCreateIssue);

      await user.click(screen.getByRole("button", { name: "Capture screen" }));
      // The captured frame lands in the FileUpload list and the stream stops.
      expect(await screen.findByText("screen-capture-1.png")).toBeTruthy();
      expect(getDisplayMedia).toHaveBeenCalledOnce();
      expect(track.stop).toHaveBeenCalled();
    } finally {
      play.mockRestore();
      toBlob.mockRestore();
      getContext.mockRestore();
      Reflect.deleteProperty(navigator, "mediaDevices");
    }
  });

  it("treats a dismissed capture picker as a non-event", async () => {
    const user = userEvent.setup();
    const getDisplayMedia = vi
      .fn()
      .mockRejectedValue(new DOMException("denied", "NotAllowedError"));
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getDisplayMedia },
      configurable: true,
    });
    try {
      const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
      await openReporter(user, onCreateIssue);
      await user.click(screen.getByRole("button", { name: "Capture screen" }));
      expect(getDisplayMedia).toHaveBeenCalledOnce();
      // No hint, no file — cancelling the picker is a normal outcome.
      expect(screen.queryByText(/Screen capture didn't work/)).toBeNull();
    } finally {
      Reflect.deleteProperty(navigator, "mediaDevices");
    }
  });
});

describe("IssueReporter panel variant", () => {
  function renderPanel(extraProps?: Partial<Parameters<typeof IssueReporter>[0]>) {
    const onCreateIssue = vi.fn<CreateIssueHandler>().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    const view = render(
      <IssueReporter
        featureTree={sampleFeatureTree}
        variant="panel"
        open
        onOpenChange={onOpenChange}
        onCreateIssue={onCreateIssue}
        {...extraProps}
      />,
    );
    return { onCreateIssue, onOpenChange, view };
  }

  it("renders as a non-modal complementary panel, not a dialog", () => {
    renderPanel();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("complementary", { name: "Report an issue" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Widen panel" })).toBeTruthy();
  });

  it("keeps the draft across close and reopen", async () => {
    const user = userEvent.setup();
    const { view } = renderPanel();

    await user.type(screen.getByLabelText("What happened?"), "Half-written report");
    view.rerender(
      <IssueReporter
        featureTree={sampleFeatureTree}
        variant="panel"
        open={false}
        onCreateIssue={vi.fn<CreateIssueHandler>().mockResolvedValue(undefined)}
      />,
    );
    view.rerender(
      <IssueReporter
        featureTree={sampleFeatureTree}
        variant="panel"
        open
        onCreateIssue={vi.fn<CreateIssueHandler>().mockResolvedValue(undefined)}
      />,
    );
    const description: HTMLTextAreaElement = screen.getByLabelText("What happened?");
    expect(description.value).toBe("Half-written report");
  });

  it("submits from the pinned footer action outside the form element", async () => {
    const user = userEvent.setup();
    const { onCreateIssue } = renderPanel({ defaultFeatureId: "reports.usage" });

    await user.type(screen.getByLabelText("What happened?"), "Numbers are shifted");
    const submit = screen.getByRole("button", { name: "Submit issue" });
    // The footer button is form-associated, not nested in the form.
    expect(submit.closest("form")).toBeNull();
    await user.click(submit);
    await waitFor(() => expect(onCreateIssue).toHaveBeenCalledOnce());
  });

  it("replaces the draft when the prefill key changes", async () => {
    const user = userEvent.setup();
    const { view, onCreateIssue } = renderPanel({ prefillKey: 1 });

    await user.type(screen.getByLabelText("What happened?"), "Old draft");
    view.rerender(
      <IssueReporter
        featureTree={sampleFeatureTree}
        variant="panel"
        open
        onCreateIssue={onCreateIssue}
        prefillKey={2}
        defaultDescription="A page failed to load."
        defaultTechnicalContext="raw diagnostics"
      />,
    );
    const description: HTMLTextAreaElement = screen.getByLabelText("What happened?");
    expect(description.value).toBe("A page failed to load.");
    expect(
      screen.getByText("Technical error details will be attached to this report automatically."),
    ).toBeTruthy();
  });
});
