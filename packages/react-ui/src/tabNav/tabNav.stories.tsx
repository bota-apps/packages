import type { Meta, StoryObj } from "@storybook/react-vite";
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

/**
 * The bar adapts to its own container: in a narrow panel it becomes a
 * full-width, horizontally scrollable strip with compact links; in a wide
 * panel it is the inline pill row.
 */
export const ContainerScoped: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="w-72 rounded-lg border p-4">
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
          <a href="#settings" className={tabNavLinkClass()}>
            Settings
          </a>
          <a href="#billing" className={tabNavLinkClass()}>
            Billing
          </a>
        </TabNav>
      </div>
      <div className="rounded-lg border p-4">
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
          <a href="#settings" className={tabNavLinkClass()}>
            Settings
          </a>
          <a href="#billing" className={tabNavLinkClass()}>
            Billing
          </a>
        </TabNav>
      </div>
    </div>
  ),
};
