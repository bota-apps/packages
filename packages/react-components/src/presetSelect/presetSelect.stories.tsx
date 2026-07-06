import type { Meta, StoryObj } from "@storybook/react";
import { AppearanceProvider } from "../appearanceProvider";
import { PresetSelect } from "./index";

// The storybook host imports the shipped brands/*.css files, so picking a
// preset here restyles every token-driven surface (and density) live.
const meta: Meta<typeof PresetSelect> = {
  title: "react-components/PresetSelect",
  component: PresetSelect,
  decorators: [
    (Story) => (
      <AppearanceProvider
        presets={[
          { value: "bota", label: "Bota" },
          {
            value: "emeraldCompact",
            label: "Emerald compact",
            brand: "emerald",
            density: "compact",
          },
          { value: "violetTopnav", label: "Violet topnav", brand: "violet", layout: "topnav" },
        ]}
      >
        <Story />
      </AppearanceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PresetSelect>;

export const Default: Story = {};
