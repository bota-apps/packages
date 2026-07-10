import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { Textarea } from "./index";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  args: { placeholder: "Type your message here." },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-96 gap-2">
      <Label htmlFor="textarea-message">Message</Label>
      <Textarea id="textarea-message" placeholder="Type your message here." rows={4} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const WithValue: Story = {
  args: { defaultValue: "A short note that was already saved.", rows: 3 },
};
