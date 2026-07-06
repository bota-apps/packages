import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../checkbox";
import { Input } from "./index";
import { Label } from "../label";
import { Switch } from "../switch";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
};
export default meta;

type Story = StoryObj<typeof Input>;

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Toggles: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="notify" />
        <Label htmlFor="notify">Notifications</Label>
      </div>
    </div>
  ),
};
