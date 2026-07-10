import type { Meta, StoryObj } from "@storybook/react-vite";
import type { RegistrationSchema } from "@bota-apps/types";
import { SchemaSelector } from "./schemaSelector";

const meta: Meta<typeof SchemaSelector> = {
  title: "Forms/SchemaSelector",
  component: SchemaSelector,
};
export default meta;

type Story = StoryObj<typeof SchemaSelector>;

const schemas: RegistrationSchema[] = [
  {
    id: "schema-basic",
    key: "basic",
    name: "Basic registration",
    description: "Name and contact details only.",
    isDefault: true,
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "schema-employment",
    key: "employment",
    name: "Employment intake",
    description: "Extended profile with employment details.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "active", label: "Active", type: "switch" },
    ],
  },
  {
    id: "schema-minimal",
    key: "minimal",
    name: "Minimal",
    fields: [{ name: "fullName", label: "Full name", type: "text", required: true }],
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <SchemaSelector schemas={schemas} onSelect={() => {}} />
    </div>
  ),
};
