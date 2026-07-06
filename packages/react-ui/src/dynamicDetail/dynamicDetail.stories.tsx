import type { Meta, StoryObj } from "@storybook/react";
import type { Money, TypedDetailSchema } from "@bota-apps/types";
import { DynamicDetail } from "./index";
import { TooltipProvider } from "../tooltip";

type Project = {
  fullName: string;
  email: string;
  phone: string;
  status: string;
  baseBudget: Money;
  dependents: number;
  remote: boolean;
};

const project: Project = {
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+14155550123",
  status: "active",
  baseBudget: { amount: 45000, currency: "USD" },
  dependents: 2,
  remote: true,
};

const schema: TypedDetailSchema<Project> = {
  id: "project-detail",
  name: "Project detail",
  sections: [
    { key: "profile", title: "Profile" },
    { key: "budget", title: "Budget" },
  ],
  fields: [
    { name: "fullName", label: "Full name", type: "text", section: "profile" },
    { name: "email", label: "Email", type: "email", section: "profile", copyable: true },
    { name: "phone", label: "Phone", type: "phone", section: "profile" },
    {
      name: "status",
      label: "Status",
      type: "select",
      section: "profile",
      options: [
        { label: "Active", value: "active" },
        { label: "On hold", value: "on-hold" },
      ],
    },
    { name: "baseBudget", label: "Base budget", type: "currency", section: "budget" },
    { name: "dependents", label: "Dependents", type: "number", section: "budget" },
    { name: "remote", label: "Remote", type: "switch", section: "budget" },
  ],
};

const meta: Meta<typeof DynamicDetail<Project>> = {
  title: "Display/DynamicDetail",
  component: DynamicDetail,
};
export default meta;

type Story = StoryObj<typeof DynamicDetail<Project>>;

/** Card variant (default): each section rendered in its own card. */
export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <DynamicDetail schema={schema} data={project} />
    </TooltipProvider>
  ),
};

/** Flat variant: section headings with a field grid, no card chrome. */
export const Flat: Story = {
  render: () => (
    <TooltipProvider>
      <DynamicDetail schema={schema} data={project} variant="flat" />
    </TooltipProvider>
  ),
};

/** Inline variant: compact horizontal key-value summary strip. */
export const Inline: Story = {
  render: () => <DynamicDetail schema={schema} data={project} variant="inline" />,
};
