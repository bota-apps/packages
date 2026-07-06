import type { Meta, StoryObj } from "@storybook/react";
import { SidebarLayout } from "./index";
import { Logo } from "../logo";
import { Button } from "../button";

const meta: Meta<typeof SidebarLayout> = {
  title: "Layout/SidebarLayout",
  component: SidebarLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SidebarLayout>;

export const Default: Story = {
  render: () => (
    <div className="h-screen w-64 border-r">
      <SidebarLayout
        brand={<Logo />}
        nav={
          <>
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Projects
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Tasks
            </Button>
          </>
        }
      />
    </div>
  ),
};
