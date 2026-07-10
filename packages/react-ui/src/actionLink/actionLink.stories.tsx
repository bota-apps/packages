import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink, PlusCircle } from "lucide-react";
import { ActionLink } from "./index";

const meta: Meta<typeof ActionLink> = {
  title: "Navigation/ActionLink",
  component: ActionLink,
};
export default meta;

type Story = StoryObj<typeof ActionLink>;

export const Default: Story = {
  render: () => (
    <a href="#new">
      <ActionLink icon={PlusCircle} label="Add project" />
    </a>
  ),
};

export const Large: Story = {
  render: () => (
    <a href="#report">
      <ActionLink icon={ExternalLink} label="View full report" size="lg" />
    </a>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <a href="#all">
      <ActionLink label="See all" />
    </a>
  ),
};
