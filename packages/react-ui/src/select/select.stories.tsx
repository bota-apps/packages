import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CHF">Swiss Franc</SelectItem>
        <SelectItem value="USD">US Dollar</SelectItem>
        <SelectItem value="EUR">Euro</SelectItem>
      </SelectContent>
    </Select>
  ),
};
