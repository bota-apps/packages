import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { sampleFeatureLabel, sampleIssues } from "../issueReporter/fixtures";
import { IssueList } from "./index";

const meta: Meta<typeof IssueList> = {
  title: "react-components/IssueList",
  component: IssueList,
};

export default meta;
type Story = StoryObj<typeof IssueList>;

export const Default: Story = {
  render: () => (
    <IssueList issues={sampleIssues} featureLabel={sampleFeatureLabel} onSelect={() => {}} />
  ),
};

export const Empty: Story = {
  render: () => <IssueList issues={[]} />,
};

export const Loading: Story = {
  render: () => <IssueList issues={[]} loading />,
};

function SelectableList() {
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(sampleIssues[0].id);
  return (
    <IssueList
      issues={sampleIssues}
      featureLabel={sampleFeatureLabel}
      selectedIssueId={selectedIssueId}
      onSelect={(issue) => setSelectedIssueId(issue.id)}
    />
  );
}

export const Selected: Story = {
  render: () => <SelectableList />,
};

export const ReadOnly: Story = {
  render: () => <IssueList issues={sampleIssues} featureLabel={sampleFeatureLabel} />,
};
