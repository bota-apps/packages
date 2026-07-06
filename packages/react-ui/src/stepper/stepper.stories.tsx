import type { Meta, StoryObj } from "@storybook/react";
import { Check } from "lucide-react";
import { Stepper } from "./index";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
};
export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => (
    <Stepper
      maxWidth="xl"
      steps={[
        { key: "account", state: "done", content: <Check />, label: "Account" },
        { key: "profile", state: "active", content: "2", label: "Profile" },
        { key: "review", state: "upcoming", content: "3", label: "Review" },
      ]}
    />
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Stepper
      size="lg"
      steps={[
        {
          key: "submitted",
          state: "success",
          content: <Check />,
          label: "Submitted",
          description: "Jun 28",
        },
        {
          key: "review",
          state: "warning",
          content: "2",
          label: "In review",
          description: "Awaiting approval",
        },
        {
          key: "paid",
          state: "upcoming",
          content: "3",
          label: "Paid",
          description: "Pending",
        },
      ]}
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <Stepper
      maxWidth="lg"
      onStepClick={(key) => alert(`Clicked step: ${key}`)}
      steps={[
        { key: "one", state: "done", content: "1", label: "Details" },
        { key: "two", state: "active", content: "2", label: "Payment" },
        { key: "three", state: "info", content: "3", label: "Confirm" },
      ]}
    />
  ),
};
