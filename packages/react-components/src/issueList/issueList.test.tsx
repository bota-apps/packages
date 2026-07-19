import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { sampleFeatureLabel, sampleIssues } from "../issueReporter/fixtures";
import { IssueList } from "./index";

// A host-owned issue type richer than the structural constraint — the list
// must accept it and hand the same type back from onSelect.
type HostIssue = (typeof sampleIssues)[number] & { assignee?: string };

const issues: HostIssue[] = sampleIssues.map((issue, index) => ({
  ...issue,
  assignee: index === 0 ? "triage-team" : undefined,
}));

describe("IssueList", () => {
  it("renders a row per issue with status, feature label, and description", () => {
    render(<IssueList issues={issues} featureLabel={sampleFeatureLabel} />);

    // Raw enum-style statuses fall back to the default appearance mapping.
    expect(screen.getByText("In progress")).toBeTruthy();
    expect(screen.getByText("Open")).toBeTruthy();
    expect(screen.getByText("Resolved")).toBeTruthy();
    expect(screen.getByText("Create project")).toBeTruthy();
    expect(screen.getByText(/create button stays disabled/)).toBeTruthy();
    // Non-interactive without onSelect.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("reports the clicked issue through onSelect and marks the selected row", async () => {
    const onSelect = vi.fn<(issue: HostIssue) => void>();
    render(
      <IssueList
        issues={issues}
        featureLabel={sampleFeatureLabel}
        onSelect={onSelect}
        selectedIssueId={issues[1].id}
      />,
    );

    const rows = screen.getAllByRole("button");
    expect(rows).toHaveLength(issues.length);
    expect(rows[1].getAttribute("aria-current")).toBe("true");
    expect(rows[0].getAttribute("aria-current")).toBeNull();

    await userEvent.click(rows[0]);
    expect(onSelect).toHaveBeenCalledWith(issues[0]);
    expect(onSelect.mock.calls[0][0].assignee).toBe("triage-team");
  });

  it("shows the empty state when there are no issues", () => {
    render(<IssueList issues={[]} />);
    expect(screen.getByText("No issues reported")).toBeTruthy();
  });

  it("shows skeleton rows while loading", () => {
    const { container } = render(<IssueList issues={[]} loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(screen.queryByText("No issues reported")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
