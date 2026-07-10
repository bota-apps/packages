import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastNotification } from "./index";

const meta: Meta<typeof ToastNotification> = {
  title: "Feedback/ToastNotification",
  component: ToastNotification,
};
export default meta;

type Story = StoryObj<typeof ToastNotification>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <ToastNotification
        variant="success"
        title="Project updated"
        description="Project #1042 was marked complete."
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <ToastNotification variant="success" title="Success" description="Everything went fine." />
      <ToastNotification variant="error" title="Error" description="Something went wrong." />
      <ToastNotification variant="warning" title="Warning" description="Double-check the input." />
      <ToastNotification variant="info" title="Info" description="A new version is available." />
      <ToastNotification
        variant="notification"
        title="Notification"
        description="You have 3 unread messages."
        onDismiss={() => {}}
      />
    </div>
  ),
};
