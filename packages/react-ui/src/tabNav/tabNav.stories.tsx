import type { Meta, StoryObj } from "@storybook/react";
import { TabNav, tabNavLinkClass } from "./index";

const meta: Meta<typeof TabNav> = {
  title: "Navigation/TabNav",
  component: TabNav,
};
export default meta;

type Story = StoryObj<typeof TabNav>;

export const Default: Story = {
  render: () => (
    <TabNav>
      <a href="#overview" className={tabNavLinkClass(true)}>
        Overview
      </a>
      <a href="#projects" className={tabNavLinkClass()}>
        Projects
      </a>
      <a href="#customers" className={tabNavLinkClass()}>
        Customers
      </a>
      <a href="#settings" className={tabNavLinkClass(false)}>
        Settings
      </a>
    </TabNav>
  ),
};
