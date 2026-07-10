import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./index";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="radio-default" />
        <Label htmlFor="radio-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="radio-comfortable" />
        <Label htmlFor="radio-comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="radio-compact" />
        <Label htmlFor="radio-compact">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="monthly" className="grid-flow-col" onValueChange={() => {}}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="radio-monthly" />
        <Label htmlFor="radio-monthly">Monthly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yearly" id="radio-yearly" />
        <Label htmlFor="radio-yearly">Yearly</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="radio-standard" />
        <Label htmlFor="radio-standard">Standard shipping</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="express" id="radio-express" disabled />
        <Label htmlFor="radio-express" className="opacity-50">
          Express shipping (unavailable)
        </Label>
      </div>
    </RadioGroup>
  ),
};
