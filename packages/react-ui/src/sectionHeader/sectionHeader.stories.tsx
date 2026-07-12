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

/**
 * The title/actions row reacts to the header's own container: in a narrow
 * panel the actions stack below the title; in a wide panel they sit inline.
 */
export const ContainerScoped: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="w-72 rounded-lg border p-4">
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
      </div>
      <div className="rounded-lg border p-4">
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
      </div>
    </div>
  ),
};
