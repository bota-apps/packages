import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./index";

const meta: Meta<typeof Logo> = {
  title: "Display/Logo",
  component: Logo,
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};
