import type { Meta, StoryObj } from "@storybook/react";
import { HeaderBar } from "./index";
import { Logo } from "../logo";
import { Button } from "../button";
import { SidebarLayout } from "../sidebarLayout";

const meta: Meta<typeof HeaderBar> = {
  title: "Layout/HeaderBar",
  component: HeaderBar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeaderBar>;

const nav = (
  <>
    <Button variant="ghost">Dashboard</Button>
    <Button variant="ghost">Projects</Button>
    <Button variant="ghost">Tasks</Button>
  </>
);

export const Default: Story = {
  render: () => (
    <HeaderBar brand={<Logo />} nav={nav} actions={<Button variant="outline">Sign out</Button>} />
  ),
};

export const WithMobileNav: Story = {
  render: () => (
    <HeaderBar
      brand={<Logo />}
      nav={nav}
      actions={<Button variant="outline">Sign out</Button>}
      mobileNav={<SidebarLayout brand={<Logo />} nav={nav} />}
    />
  ),
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
