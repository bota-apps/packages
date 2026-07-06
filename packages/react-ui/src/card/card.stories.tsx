import type { Meta, StoryObj } from "@storybook/react";
import { Rocket } from "lucide-react";
import { Button } from "../button";
import { Card } from "./index";

const meta: Meta<typeof Card> = {
  title: "Display/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card
      className="w-96"
      title="Team settings"
      description="Manage who has access to this workspace."
      headerRight={<Button variant="outline">Invite</Button>}
      footer={<Button>Save changes</Button>}
    >
      <p className="text-sm text-muted-foreground">
        Three members currently have access to this workspace.
      </p>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid w-[28rem] gap-4">
      <Card variant="compact" title="Compact" description="Tighter padding for dense contexts." />
      <Card
        variant="interactive"
        title="Interactive"
        description="Hover-lift card for grid listings."
      />
      <Card
        variant="surface"
        title="Surface"
        description="Content surface with subtle background."
      />
      <Card
        variant="feature"
        icon={<Rocket />}
        title="Feature"
        description="Icon-above-title feature card."
      />
    </div>
  ),
};

export const Anatomy: Story = {
  render: () => (
    <Card
      className="w-96"
      title="Card title"
      description="Title, description, body, and footer via the props-driven API."
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button className="ml-2">Confirm</Button>
        </>
      }
    >
      <p className="text-sm">The content area holds the card body.</p>
    </Card>
  ),
};
