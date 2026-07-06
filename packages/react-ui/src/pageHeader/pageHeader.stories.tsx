import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./index";
import { Badge } from "../badge";
import { Button } from "../button";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Active projects",
    description: "Review and approve this month's projects.",
  },
};

export const WithMetadataAndAction: Story = {
  render: () => (
    <PageHeader
      title="June 2026 projects"
      description="Draft run awaiting approval."
      metadata={<Badge variant="secondary">Draft</Badge>}
      action={<Button>Approve run</Button>}
    />
  ),
};
