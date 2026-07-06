import type { Meta, StoryObj } from "@storybook/react";
import { BackLink } from "./index";

const meta: Meta<typeof BackLink> = {
  title: "Navigation/BackLink",
  component: BackLink,
};
export default meta;

type Story = StoryObj<typeof BackLink>;

export const Default: Story = {
  render: () => (
    <BackLink>
      <a href="#projects">Back to projects</a>
    </BackLink>
  ),
};
