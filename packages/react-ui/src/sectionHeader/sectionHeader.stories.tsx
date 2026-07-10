import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeader } from "./index";
import { Button } from "../button";

const meta: Meta<typeof SectionHeader> = {
  title: "Layout/SectionHeader",
  component: SectionHeader,
};
export default meta;

type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    title: "Team members",
    description: "People with access to this workspace.",
  },
};

export const WithActions: Story = {
  render: () => (
    <SectionHeader
      title="Pending approvals"
      description="Requests waiting for your review."
      actions={[
        <Button key="dismiss" variant="outline">
          Dismiss all
        </Button>,
        <Button key="approve">Approve all</Button>,
      ]}
    />
  ),
};
