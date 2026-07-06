import type { Meta, StoryObj } from "@storybook/react";
import { CreditCard, FileText, Users } from "lucide-react";
import { Badge } from "../badge";
import { QuickLink, QuickLinkGrid } from "./index";

const meta: Meta<typeof QuickLink> = {
  title: "Navigation/QuickLink",
  component: QuickLink,
};
export default meta;

type Story = StoryObj<typeof QuickLink>;

export const Default: Story = {
  render: () => (
    <a href="#projects" className="block w-96">
      <QuickLink
        icon={FileText}
        label="Projects"
        description="Create, organize, and track projects"
      />
    </a>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <a href="#customers" className="block w-96">
      <QuickLink
        icon={Users}
        label="Customers"
        description="Manage your customer list"
        suffix={<Badge>12</Badge>}
      />
    </a>
  ),
};

export const Grid: Story = {
  render: () => (
    <QuickLinkGrid columns={3} className="max-w-3xl">
      <a href="#projects" className="block">
        <QuickLink
          variant="grid"
          icon={FileText}
          label="Projects"
          description="Organize and track"
        />
      </a>
      <a href="#customers" className="block">
        <QuickLink variant="grid" icon={Users} label="Customers" description="Manage contacts" />
      </a>
      <a href="#payments" className="block">
        <QuickLink variant="grid" icon={CreditCard} label="Payments" description="View activity" />
      </a>
    </QuickLinkGrid>
  ),
};
