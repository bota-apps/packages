import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, Users, Wallet, type LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./index";
import { Logo } from "../logo";
import { Card } from "../card";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const items: { label: string; icon: LucideIcon; active?: boolean; badge?: string }[] = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Projects", icon: Users },
  { label: "Tasks", icon: Wallet, badge: "3" },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b p-2">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        <div className="p-6">
          <Card
            title="Content area"
            description="Toggle the sidebar with the trigger or Cmd/Ctrl+B."
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
