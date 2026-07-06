import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle } from "lucide-react";
import { ErrorState } from "./index";
import { Button } from "../button";

const meta: Meta<typeof ErrorState> = {
  title: "Feedback/ErrorState",
  component: ErrorState,
};
export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  render: () => (
    <ErrorState title="Something went wrong" description="We could not load this page." />
  ),
};

export const WithIconAndAction: Story = {
  render: () => (
    <ErrorState
      icon={<AlertTriangle className="h-10 w-10" />}
      title="Failed to load projects"
      description="Check your connection and try again."
      action={<Button variant="outline">Retry</Button>}
    />
  ),
};
