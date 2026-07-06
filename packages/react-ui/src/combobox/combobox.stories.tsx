import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, type ComboboxGroup, type ComboboxOption } from "./index";

const meta: Meta<typeof Combobox> = {
  title: "Forms/Combobox",
  component: Combobox,
};
export default meta;

type Story = StoryObj<typeof Combobox>;

const fruits: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", description: "Rich in potassium" },
  { value: "cherry", label: "Cherry" },
  { value: "mango", label: "Mango", description: "Seasonal" },
  { value: "papaya", label: "Papaya", disabled: true },
];

const groupedOptions: ComboboxGroup[] = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "spinach", label: "Spinach", description: "Leafy green" },
    ],
  },
];

function ControlledCombobox(props: {
  options: ComboboxOption[] | ComboboxGroup[];
  initialValue?: string;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState<string | undefined>(props.initialValue);
  return (
    <div className="w-72">
      <Combobox
        options={props.options}
        value={value}
        onValueChange={setValue}
        clearable={props.clearable}
        disabled={props.disabled}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledCombobox options={fruits} placeholder="Select a fruit" />,
};

export const Grouped: Story = {
  render: () => <ControlledCombobox options={groupedOptions} placeholder="Select produce" />,
};

export const Clearable: Story = {
  render: () => <ControlledCombobox options={fruits} initialValue="banana" clearable />,
};

export const Disabled: Story = {
  render: () => <ControlledCombobox options={fruits} disabled placeholder="Select a fruit" />,
};
