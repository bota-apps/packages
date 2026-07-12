import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepFlow } from "./index";
import { Badge } from "../badge";
import { Stack } from "../layout";
import { Text } from "../typography";

const meta: Meta<typeof StepFlow> = {
  title: "Motion/StepFlow",
  component: StepFlow,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof StepFlow>;

function Spacer({ label }: { label: string }) {
  return (
    <div className="flex h-[70vh] items-center justify-center rounded-lg border border-dashed">
      <Text tone="muted">{label}</Text>
    </div>
  );
}

export const OrderLifecycle: Story = {
  render: () => (
    <Stack gap="lg" className="mx-auto max-w-2xl">
      <Spacer label="Scroll — the rail fills as steps pass the reading line." />
      <StepFlow
        steps={[
          {
            title: "Request received",
            description: "The request is logged with its reference details and assigned an owner.",
            aside: <Badge variant="secondary">Automatic</Badge>,
          },
          {
            title: "Details reviewed",
            description: "Submitted information is checked for completeness and consistency.",
            aside: <Badge variant="warning">Manual</Badge>,
          },
          {
            title: "Quote prepared",
            description: "Pricing is assembled from the reviewed details and sent for approval.",
          },
          {
            title: "Approval recorded",
            description: "The customer's acceptance is captured against the quote.",
          },
          {
            title: "Work scheduled",
            description: "The order is booked into the delivery plan.",
          },
          {
            title: "Progress checkpoints",
            description: "Milestones are recorded as the order moves through each stage.",
          },
          {
            title: "Final checks",
            description: "Outstanding documents are collected and verified.",
            aside: <Badge variant="warning">Manual</Badge>,
          },
          {
            title: "Delivered",
            description: "Completion is confirmed with the recipient.",
          },
          {
            title: "Statement issued",
            description: "The closing statement is generated from the recorded charges.",
            aside: <Badge variant="secondary">Automatic</Badge>,
          },
        ]}
      />
      <Spacer label="End of the walkthrough." />
    </Stack>
  ),
};

export const ThreeSteps: Story = {
  render: () => (
    <Stack gap="lg" className="mx-auto max-w-xl">
      <StepFlow
        steps={[
          { title: "Create a workspace", description: "Name it and pick your defaults." },
          { title: "Invite your team", description: "Everyone lands in the same workspace." },
          { title: "Start your first project", description: "Templates get you moving quickly." },
        ]}
      />
    </Stack>
  ),
};
