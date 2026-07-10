import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox } from "lucide-react";
import { Button, Text } from "@bota-apps/react-ui";
import { PageContainer } from "./index";

const meta: Meta<typeof PageContainer> = {
  title: "react-components/PageContainer",
  component: PageContainer,
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

export const Ready: Story = {
  args: {
    title: "Projects — Bota Console",
    heading: "Projects",
    description: "Everyone in your organization",
    menuActions: [{ label: "Export CSV" }, { label: "Archive all", variant: "destructive" }],
    state: { kind: "ready" },
    children: <Text>The project list renders here.</Text>,
  },
};

export const ReadyWithStaleWarning: Story = {
  args: {
    ...Ready.args,
    state: { kind: "ready", warning: "Unable to refresh data. Showing previously loaded results." },
  },
};

export const LoadingState: Story = {
  args: {
    title: "Projects — Bota Console",
    heading: "Projects",
    state: { kind: "loading" },
  },
};

export const ErrorState: Story = {
  args: {
    title: "Projects — Bota Console",
    heading: "Projects",
    state: {
      kind: "error",
      title: "Failed to load projects",
      description: "The server did not respond.",
      onRetry: () => {},
    },
  },
};

export const EmptyState: Story = {
  args: {
    title: "Projects — Bota Console",
    heading: "Projects",
    state: {
      kind: "empty",
      title: "No projects yet",
      description: "Add your first project to get started.",
      icon: <Inbox />,
      action: <Button>Add project</Button>,
    },
  },
};
