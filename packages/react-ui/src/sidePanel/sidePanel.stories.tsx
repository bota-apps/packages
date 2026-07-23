import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidePanel } from "./index";
import { Button } from "../button";
import { Text } from "../html/typography";

const meta: Meta<typeof SidePanel> = {
  title: "Layout/SidePanel",
  component: SidePanel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SidePanel>;

/**
 * The panel docks beside the content instead of covering it — the page stays
 * readable and interactive while it is open, and the width controls step
 * through the presets.
 */
export const BesideContent: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex min-h-screen">
        <main className="min-w-0 flex-1 space-y-3 p-8">
          <Text as="h1" size="lg" weight="semibold">
            Page content
          </Text>
          <Text as="p" tone="muted">
            Everything here stays interactive while the panel is open. Closing the panel keeps its
            children mounted, so a half-written form survives close and reopen.
          </Text>
          <Button variant="outline" onClick={() => setOpen(true)} disabled={open}>
            Open panel
          </Button>
        </main>
        <SidePanel
          open={open}
          onOpenChange={setOpen}
          title="Companion panel"
          description="Non-modal: no focus trap, no backdrop"
        >
          <div className="space-y-3">
            <Text as="p" size="sm">
              Use the chevrons in the header to widen or narrow the panel. Below the md breakpoint
              it becomes a viewport-wide overlay and the width controls disappear.
            </Text>
            <input
              aria-label="Draft note"
              placeholder="Type something, close, reopen…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </SidePanel>
      </div>
    );
  },
};
