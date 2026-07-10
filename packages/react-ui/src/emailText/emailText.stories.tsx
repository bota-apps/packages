import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmailText } from "./index";

const meta: Meta<typeof EmailText> = {
  title: "Display/EmailText",
  component: EmailText,
  args: { email: "jane.doe@example.com" },
};
export default meta;

type Story = StoryObj<typeof EmailText>;

export const Default: Story = {};

export const Linked: Story = {
  args: { linked: true },
};

export const SizesAndTones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <EmailText email="jane.doe@example.com" size="md" tone="default" />
      <EmailText email="jane.doe@example.com" size="sm" tone="muted" />
      <EmailText email="jane.doe@example.com" size="md" tone="primary" linked />
    </div>
  ),
};
