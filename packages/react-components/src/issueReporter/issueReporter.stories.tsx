import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@bota-apps/react-ui";
import { sampleFeatureTree } from "./fixtures";
import { IssueReporter } from "./index";

const meta: Meta<typeof IssueReporter> = {
  title: "react-components/IssueReporter",
  component: IssueReporter,
};

export default meta;
type Story = StoryObj<typeof IssueReporter>;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Default: Story = {
  render: () => (
    <IssueReporter
      featureTree={sampleFeatureTree}
      trigger="Report an issue"
      onCreateIssue={async (payload) => {
        await delay(900);
        // eslint-disable-next-line no-console
        console.log("create issue", payload);
      }}
    />
  ),
};

export const Preselected: Story = {
  render: () => (
    <IssueReporter
      featureTree={sampleFeatureTree}
      trigger="Report an issue"
      defaultFeatureId="reports.usage"
      onCreateIssue={async () => {
        await delay(900);
      }}
    />
  ),
};

export const SubmitError: Story = {
  render: () => (
    <IssueReporter
      featureTree={sampleFeatureTree}
      trigger="Report an issue"
      onCreateIssue={async () => {
        await delay(900);
        throw new Error("The issue service is unreachable. Please try again.");
      }}
    />
  ),
};

export const WithoutContactFields: Story = {
  render: () => (
    <IssueReporter
      featureTree={sampleFeatureTree}
      trigger="Report an issue"
      collectContact={false}
      onCreateIssue={async () => {
        await delay(900);
      }}
    />
  ),
};

// Controlled mode: the host opens the sheet from its own chrome.
function ControlledReporter() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open from host chrome
      </Button>
      <IssueReporter
        featureTree={sampleFeatureTree}
        open={open}
        onOpenChange={setOpen}
        defaultFeatureId="projects.create"
        onCreateIssue={async () => {
          await delay(900);
        }}
      />
    </>
  );
}

export const Controlled: Story = {
  render: () => <ControlledReporter />,
};
