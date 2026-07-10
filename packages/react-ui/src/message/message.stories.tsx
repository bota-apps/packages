import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message } from "./index";

const meta: Meta<typeof Message> = {
  title: "Feedback/Message",
  component: Message,
};
export default meta;

type Story = StoryObj<typeof Message>;

export const Default: Story = {
  render: () => (
    <Message className="w-96" title="Profile updated" description="Your changes have been saved." />
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <Message variant="neutral" description="Neutral message." />
      <Message variant="info" description="Informational message." />
      <Message variant="success" description="Success message." />
      <Message variant="warning" description="Warning message." />
      <Message variant="error" description="Error message." />
    </div>
  ),
};

export const TrustedHtml: Story = {
  render: () => (
    <Message
      className="w-96"
      variant="info"
      html="Your session expires in <strong>5 minutes</strong>."
    />
  ),
};
