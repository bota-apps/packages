import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { sampleFeatureLabel, sampleIssues } from "../issueReporter/fixtures";
import type { Issue } from "../issueReporter/types";
import { IssueDetails } from "./index";

const meta: Meta<typeof IssueDetails> = {
  title: "react-components/IssueDetails",
  component: IssueDetails,
};

export default meta;
type Story = StoryObj<typeof IssueDetails>;

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const Full: Story = {
  render: () => <IssueDetails issue={sampleIssues[0]} featureLabel={sampleFeatureLabel} />,
};

export const Minimal: Story = {
  render: () => <IssueDetails issue={sampleIssues[1]} featureLabel={sampleFeatureLabel} />,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function EditableDetails() {
  const [issue, setIssue] = useState<Issue>(sampleIssues[0]);
  return (
    <IssueDetails
      issue={issue}
      featureLabel={sampleFeatureLabel}
      statusOptions={statusOptions}
      onUpdateStatus={async (status) => {
        await delay(900);
        setIssue((current) => ({ ...current, status, updatedAt: new Date() }));
      }}
    />
  );
}

export const WithStatusEditing: Story = {
  render: () => <EditableDetails />,
};
