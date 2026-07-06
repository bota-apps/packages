import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { ConfirmDialog } from "./index";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Destructive: Story = {
  render: () => (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete item</Button>}
      title="Delete item?"
      description="This action cannot be undone."
      variant="destructive"
      onConfirm={() => {}}
    />
  ),
};

export const Confirming: Story = {
  render: () => (
    <ConfirmDialog
      open
      title="Archiving…"
      description="The confirm button is disabled while the mutation is in flight."
      confirming
      onConfirm={() => {}}
    />
  ),
};
