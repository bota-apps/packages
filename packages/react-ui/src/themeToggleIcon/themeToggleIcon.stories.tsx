import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggleIcon } from "./index";

const meta: Meta<typeof ThemeToggleIcon> = {
  title: "Display/ThemeToggleIcon",
  component: ThemeToggleIcon,
};
export default meta;

type Story = StoryObj<typeof ThemeToggleIcon>;

export const Default: Story = {
  render: () => (
    // The moon icon is absolutely positioned, so the icon pair needs a relative wrapper —
    // typically an icon button. Toggle the `dark` class to swap sun/moon.
    <button
      type="button"
      aria-label="Toggle theme"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border"
    >
      <ThemeToggleIcon />
    </button>
  ),
};
