import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./index";
import { Label } from "../label";

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="dark-mode" defaultChecked />
      <Label htmlFor="dark-mode">Dark mode</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="locked" disabled />
      <Label htmlFor="locked">Locked setting</Label>
    </div>
  ),
};
