import type { Meta, StoryObj } from "@storybook/react";
import { AppearanceProvider } from "../appearanceProvider";
import { ThemeToggle } from "./index";

const meta: Meta<typeof ThemeToggle> = {
  title: "react-components/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <AppearanceProvider>
        <Story />
      </AppearanceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
