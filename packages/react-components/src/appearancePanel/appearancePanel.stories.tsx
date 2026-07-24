import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Anchor, Leaf, Sun, Sunrise } from "lucide-react";
import { Button } from "@bota-apps/react-ui";
import { AppearanceProvider, type AppearancePreset } from "../appearanceProvider";
import { AppearancePanel } from "./index";

const meta: Meta<typeof AppearancePanel> = {
  title: "App/AppearancePanel",
  component: AppearancePanel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppearancePanel>;

// Preview swatches give each look a visual hint next to its description —
// typically the chrome, primary, and canvas colors of the brand.
const presets: readonly AppearancePreset[] = [
  {
    value: "freightOcean",
    label: "Ocean Blue",
    icon: Anchor,
    description: "Saturated blue chrome over a cool light canvas",
    brand: "freightOcean",
    preview: ["#2563EB", "#0B7F7E", "#F2F6FB"],
  },
  {
    value: "freightSky",
    label: "Bright Sky",
    icon: Sun,
    description: "Airy near-white chrome, light sidebar",
    brand: "freightSky",
    preview: ["#0EA5E9", "#F8FBFE"],
  },
  {
    value: "freightEmerald",
    label: "Emerald Route",
    icon: Leaf,
    description: "Grounded green chrome with warm neutrals",
    brand: "freightEmerald",
    preview: ["#059669", "#F2FAF6"],
  },
  {
    value: "freightSunrise",
    label: "Sunrise Orange",
    icon: Sunrise,
    description: "Vibrant orange chrome over warm sand neutrals",
    brand: "freightSunrise",
    preview: ["#FF6A00", "#FFB02E", "#FBF8F4"],
  },
];

/**
 * The appearance controls with room to breathe: mode, preset cards with
 * color-swatch hints, and a free color picker that tints the active look.
 * The footer slot carries whatever persistence action the app provides.
 */
export const BesideContent: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <AppearanceProvider presets={presets}>
        <div className="flex min-h-screen">
          <main className="min-w-0 flex-1 p-8">
            <Button variant="outline" onClick={() => setOpen((current) => !current)}>
              Toggle appearance panel
            </Button>
          </main>
          <AppearancePanel
            open={open}
            onOpenChange={setOpen}
            footer={
              <div className="flex justify-end">
                <Button size="sm">Save preferences</Button>
              </div>
            }
          />
        </div>
      </AppearanceProvider>
    );
  },
};
