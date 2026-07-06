import type { Meta, StoryObj } from "@storybook/react";
import { AppearanceProvider } from "../appearanceProvider";
import { LayoutToggle } from "./index";

const meta: Meta<typeof LayoutToggle> = {
  title: "react-components/LayoutToggle",
  component: LayoutToggle,
  decorators: [
    (Story) => (
      <AppearanceProvider>
        <Story />
      </AppearanceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LayoutToggle>;

export const Default: Story = {};
