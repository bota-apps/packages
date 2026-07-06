import type { Meta, StoryObj } from "@storybook/react";
import { SearchX } from "lucide-react";
import { EmptyState } from "./index";
import { Button } from "../button";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => <EmptyState title="No results" description="Try adjusting the filters." />,
};

export const WithIconAndAction: Story = {
  render: () => (
    <EmptyState
      icon={<SearchX className="h-10 w-10" />}
      title="No projects found"
      description="Try a different search term or clear the filters."
      action={<Button variant="outline">Clear filters</Button>}
    />
  ),
};
