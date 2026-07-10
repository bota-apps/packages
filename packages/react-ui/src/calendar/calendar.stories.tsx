import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./index";

const meta: Meta<typeof Calendar> = {
  title: "Forms/Calendar",
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

function SingleCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={selected} onSelect={setSelected} />;
}

export const Default: Story = {
  render: () => <SingleCalendar />,
};

function RangeCalendar() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  return <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />;
}

export const Range: Story = {
  render: () => <RangeCalendar />,
};

export const DisabledWeekends: Story = {
  render: () => <Calendar mode="single" disabled={{ dayOfWeek: [0, 6] }} />,
};
