import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { PasswordInput } from "./index";

const meta: Meta<typeof PasswordInput> = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  args: { placeholder: "Enter password" },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <PasswordInput {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="password-input">Password</Label>
      <PasswordInput id="password-input" placeholder="Enter password" />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="w-80">
      <PasswordInput defaultValue="hunter2secret" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <PasswordInput placeholder="Enter password" disabled />
    </div>
  ),
};
