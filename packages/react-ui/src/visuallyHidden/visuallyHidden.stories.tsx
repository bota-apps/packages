import type { Meta, StoryObj } from "@storybook/react";
import { Download } from "lucide-react";
import { VisuallyHidden } from "./index";
import { Button } from "../button";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Display/VisuallyHidden",
  component: VisuallyHidden,
};
export default meta;

type Story = StoryObj<typeof VisuallyHidden>;

export const IconButtonLabel: Story = {
  render: () => (
    <Button variant="outline" size="icon">
      <Download />
      <VisuallyHidden>Download report</VisuallyHidden>
    </Button>
  ),
};

export const InlineContext: Story = {
  render: () => (
    <p>
      Revenue is up 12%
      <VisuallyHidden> compared to the previous quarter</VisuallyHidden>.
    </p>
  ),
};
