import type { Meta, StoryObj } from "@storybook/react-vite";
import { Description, Label } from "./index";
import { Input } from "../input";

const meta: Meta<typeof Label> = {
  title: "Forms/Label",
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="label-email">Email</Label>
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="label-username">Username</Label>
      <Input id="label-username" placeholder="musema" />
      <Description htmlFor="label-username">
        This is your public display name. It can be changed once a month.
      </Description>
    </div>
  ),
};
