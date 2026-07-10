import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Home, Settings } from "lucide-react";
import { Badge } from "../badge";
import { SidebarNavLink, sidebarNavLinkClass } from "./index";

const meta: Meta<typeof SidebarNavLink> = {
  title: "Navigation/SidebarNavLink",
  component: SidebarNavLink,
};
export default meta;

type Story = StoryObj<typeof SidebarNavLink>;

const linkClass = (active = false) =>
  `${sidebarNavLinkClass("sidebar", active)} flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted [&>svg]:size-4 ${
    active ? "bg-selected text-selected-foreground font-medium" : ""
  }`;

export const Default: Story = {
  render: () => (
    <nav className="w-56 space-y-1">
      <a href="#home" className={linkClass(true)}>
        <SidebarNavLink icon={Home} label="Dashboard" />
      </a>
      <a href="#projects" className={linkClass()}>
        <SidebarNavLink icon={FileText} label="Projects" suffix={<Badge>3</Badge>} />
      </a>
      <a href="#settings" className={linkClass()}>
        <SidebarNavLink icon={Settings} label="Settings" />
      </a>
    </nav>
  ),
};

export const NestedLevels: Story = {
  render: () => (
    <nav className="w-56 space-y-1">
      <a href="#settings" className={linkClass()}>
        <SidebarNavLink icon={Settings} label="Settings" />
      </a>
      <a href="#profile" className={`${linkClass()} pl-8`}>
        <SidebarNavLink label="Profile" treeLevel={1} />
      </a>
      <a href="#notifications" className={`${linkClass()} pl-12`}>
        <SidebarNavLink label="Notifications" treeLevel={2} />
      </a>
    </nav>
  ),
};
