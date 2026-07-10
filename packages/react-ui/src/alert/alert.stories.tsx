import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "./index";
import { EmptyState } from "../emptyState";
import { ErrorState } from "../errorState";
import { Button } from "../button";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert & States",
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Everything renders through the shared design tokens.</AlertDescription>
    </Alert>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      title="No results"
      description="Try adjusting the filters."
      action={<Button variant="outline">Clear filters</Button>}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ErrorState
      title="Something went wrong"
      description="The request failed. Try again."
      action={<Button>Retry</Button>}
    />
  ),
};
