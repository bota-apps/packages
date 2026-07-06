import type { Meta, StoryObj } from "@storybook/react";
import { AppearanceProvider } from "../appearanceProvider";
import { DensityToggle } from "./index";

const meta: Meta<typeof DensityToggle> = {
  title: "react-components/DensityToggle",
  component: DensityToggle,
  decorators: [
    (Story) => (
      <AppearanceProvider>
        <Story />
      </AppearanceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DensityToggle>;

export const Default: Story = {};
