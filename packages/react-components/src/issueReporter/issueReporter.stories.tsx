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

// Panel variant: non-modal, docked beside the content — the app stays
// navigable while the report is being written, and closing keeps the draft.
function PanelReporter() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-screen">
      <main className="min-w-0 flex-1 space-y-3 p-8">
        <p className="text-sm text-muted-foreground">
          The page stays interactive while the panel is open. Close and reopen — the draft
          survives. The header chevrons resize the panel.
        </p>
        <Button type="button" onClick={() => setOpen(true)} disabled={open}>
          Report an issue
        </Button>
      </main>
      <IssueReporter
        variant="panel"
        featureTree={sampleFeatureTree}
        open={open}
        onOpenChange={setOpen}
        defaultFeatureId="projects.create"
        defaultTechnicalContext='{"status":500,"path":"/reports"}'
        onCreateIssue={async () => {
          await delay(900);
        }}
      />
    </div>
  );
}

export const DockedPanel: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <PanelReporter />,
};
