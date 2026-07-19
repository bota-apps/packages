import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BookOpenText,
  DraftingCompass,
  Droplet,
  IceCreamCone,
  Layers,
  Package,
  SquareTerminal,
  Stamp,
} from "lucide-react";
import { AppearanceProvider, type AppearancePreset } from "../appearanceProvider";
import { PresetSelect } from "./index";

// The storybook host imports the shipped brands/*.css files, so picking a
// preset here restyles every token-driven surface (plus layout and density)
// live. Each shipped look bundles its own surfaces, chrome, typeface, corner
// radius, layout, and density — switching presets reads as switching products.
const shippedPresets: readonly AppearancePreset[] = [
  {
    value: "bota",
    label: "Bota",
    icon: Droplet,
    description: "The signature look — cool blue, roomy",
  },
  {
    value: "ledger",
    label: "Ledger",
    icon: Stamp,
    description: "Manila paper, ink rail, typewriter headings",
    brand: "ledger",
  },
  {
    value: "kraft",
    label: "Kraft",
    icon: Package,
    description: "Brown paper, stamp green, slab headings",
    brand: "kraft",
  },
  {
    value: "blueprint",
    label: "Blueprint",
    icon: DraftingCompass,
    description: "Drafting paper, square corners, dense",
    brand: "blueprint",
    density: "compact",
  },
  {
    value: "manuscript",
    label: "Manuscript",
    icon: BookOpenText,
    description: "Warm paper, serif voice, masthead nav",
    brand: "manuscript",
    layout: "topnav",
  },
  {
    value: "terminal",
    label: "Terminal",
    icon: SquareTerminal,
    description: "Monospace, square corners, dense",
    brand: "terminal",
    layout: "topnav",
    density: "compact",
  },
  {
    value: "sorbet",
    label: "Sorbet",
    icon: IceCreamCone,
    description: "Soft rounded corners, berry brights",
    brand: "sorbet",
  },
  {
    value: "graphite",
    label: "Graphite",
    icon: Layers,
    description: "Charcoal chrome, crisp and dense",
    brand: "graphite",
    density: "compact",
  },
];

const meta: Meta<typeof PresetSelect> = {
  title: "react-components/PresetSelect",
  component: PresetSelect,
  decorators: [
    (Story) => (
      <AppearanceProvider presets={shippedPresets}>
        <Story />
      </AppearanceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PresetSelect>;

export const Default: Story = {};
