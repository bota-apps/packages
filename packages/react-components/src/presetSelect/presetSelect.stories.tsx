import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Anchor,
  BookOpenText,
  Container,
  DraftingCompass,
  Droplet,
  IceCreamCone,
  Layers,
  Leaf,
  Package,
  Sparkles,
  SquareTerminal,
  Stamp,
  Sun,
  Sunrise,
  Waves,
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
  {
    value: "freight",
    label: "Freight",
    icon: Container,
    description: "Corridor blue, signage headings, signal orange",
    brand: "freight",
  },
  // The bright logistics collection — five high-key looks sharing one
  // structure (bright canvas, white cards, crisp borders) with distinct
  // identity hues.
  {
    value: "freightOcean",
    label: "Ocean Blue",
    icon: Anchor,
    description: "Professional blue, saturated sidebar",
    brand: "freightOcean",
  },
  {
    value: "freightSky",
    label: "Bright Sky",
    icon: Sun,
    description: "Airy near-white chrome, light sidebar",
    brand: "freightSky",
  },
  {
    value: "freightTeal",
    label: "Teal Horizon",
    icon: Waves,
    description: "Calm operational teal",
    brand: "freightTeal",
  },
  {
    value: "freightEmerald",
    label: "Emerald Route",
    icon: Leaf,
    description: "Grounded emerald green",
    brand: "freightEmerald",
  },
  {
    value: "freightViolet",
    label: "Violet Focus",
    icon: Sparkles,
    description: "Bold premium violet",
    brand: "freightViolet",
  },
  {
    value: "freightSunrise",
    label: "Sunrise Orange",
    icon: Sunrise,
    description: "Vibrant orange, warm sand neutrals",
    brand: "freightSunrise",
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
