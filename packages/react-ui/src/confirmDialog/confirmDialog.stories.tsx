import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

/**
 * Interaction test: opens the dialog from its trigger, confirms, and asserts
 * the `onConfirm` spy fired. Replays in the Interactions panel and runs as an
 * assertion in the Storybook test-runner.
 */
export const ConfirmFlow: Story = {
  args: {
    trigger: <Button variant="destructive">Delete item</Button>,
    title: "Delete item?",
    description: "This action cannot be undone.",
    variant: "destructive",
    // Stories with a play function must spy every callback arg explicitly —
    // the global actions argTypesRegex only covers render-time logging.
    onConfirm: fn(),
    onOpenChange: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Dialog content portals to <body>, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);

    await step("open the dialog from its trigger", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Delete item" }));
      // findByRole (not toBeVisible): the dialog animates in and starts at
      // opacity 0, which visibility checks treat as hidden.
      await expect(await body.findByRole("alertdialog")).toBeInTheDocument();
    });

    await step("confirm closes the dialog and fires onConfirm", async () => {
      await userEvent.click(body.getByRole("button", { name: "Confirm" }));
      await expect(args.onConfirm).toHaveBeenCalledOnce();
    });
  },
};
