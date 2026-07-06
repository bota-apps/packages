import type { Meta, StoryObj } from "@storybook/react";
import type { RegistrationSchema } from "@bota-apps/types";
import { DynamicForm } from "./index";

const meta: Meta<typeof DynamicForm> = {
  title: "Forms/DynamicForm",
  component: DynamicForm,
};
export default meta;

type Story = StoryObj<typeof DynamicForm>;

const schema: RegistrationSchema = {
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, section: "profile" },
    { name: "email", label: "Email", type: "email", required: true, section: "profile" },
    {
      name: "role",
      label: "Role",
      type: "select",
      section: "profile",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Member", value: "member" },
      ],
    },
    {
      name: "budget",
      label: "Budget",
      type: "currency",
      required: true,
      section: "budget",
      validation: { min: 0 },
    },
    { name: "active", label: "Active", type: "switch", section: "budget" },
  ],
  sections: [
    { key: "profile", title: "Profile" },
    { key: "budget", title: "Budget" },
  ],
} as RegistrationSchema;

export const Default: Story = {
  render: () => <DynamicForm schema={schema} onSubmit={() => {}} />,
};

export const TranslatedValidation: Story = {
  render: () => (
    <DynamicForm
      schema={schema}
      onSubmit={() => {}}
      submitLabel="Enviar"
      validationMessages={{
        required: (label) => `${label} es obligatorio`,
        invalidEmail: () => "Correo electrónico no válido",
      }}
    />
  ),
};
