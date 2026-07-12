import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, EntitySummary, ActivityFeed } from "@bota-apps/react-ui";
import { EntityWorkspace, type EntityWorkspaceTab } from "./index";

const meta: Meta<typeof EntityWorkspace> = {
  title: "Composition/EntityWorkspace",
  component: EntityWorkspace,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof EntityWorkspace>;

const tabs: EntityWorkspaceTab[] = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <EntitySummary
        ariaLabel="Overview"
        items={[
          { id: "reference", label: "Reference", value: "REF-10428" },
          { id: "owner", label: "Owner", value: "A. Contact" },
          { id: "created", label: "Created", value: "24 Jun 2026" },
          { id: "updated", label: "Updated", value: "07 Jul 2026" },
        ]}
      />
    ),
  },
  {
    id: "items",
    label: "Items",
    content: <p className="text-sm text-muted-foreground">Line items would render here.</p>,
  },
  {
    id: "activity",
    label: "Activity",
    content: (
      <ActivityFeed
        ariaLabel="Activity"
        items={[
          { id: "a", title: "Record created", timestamp: "Jun 24", tone: "primary" },
          { id: "b", title: "Submitted for review", timestamp: "Jun 24" },
          { id: "c", title: "Approved", timestamp: "Jun 25", tone: "success" },
        ]}
      />
    ),
  },
];

export const Default: Story = {
  args: {
    title: "Record REF-10428",
    subtitle: "Stage A → Stage C",
    status: <Badge variant="success">Active</Badge>,
    actions: <Button>Submit</Button>,
    tabs,
  },
};

function RouteControlledWorkspace() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Selected tab: <code>{activeTab}</code> (bind this to your router)
      </p>
      <EntityWorkspace
        title="Record REF-10428"
        subtitle="Route-controlled tabs"
        status={<Badge variant="success">Active</Badge>}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export const RouteControlled: Story = {
  render: () => <RouteControlledWorkspace />,
};

export const ManyTabs: Story = {
  args: {
    title: "Record REF-10428",
    subtitle: "Overflowing tab set scrolls in narrow containers",
    tabs: [
      ...tabs,
      { id: "documents", label: "Documents", content: <p>Documents</p> },
      { id: "charges", label: "Charges", content: <p>Charges</p> },
      { id: "statement", label: "Statement", content: <p>Statement</p> },
      { id: "audit", label: "Audit", content: <p>Audit</p> },
    ],
  },
};
