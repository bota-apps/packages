import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRangeInput } from "./index";

const meta: Meta<typeof DateRangeInput> = {
  title: "Forms/DateRangeInput",
  component: DateRangeInput,
};
export default meta;

type Story = StoryObj<typeof DateRangeInput>;

function ControlledDateRangeInput(props: { start?: string; end?: string; placeholder?: string }) {
  const [start, setStart] = useState(props.start ?? "");
  const [end, setEnd] = useState(props.end ?? "");
  return (
    <div className="w-80">
      <DateRangeInput
        startValue={start}
        endValue={end}
        onChange={(nextStart, nextEnd) => {
          setStart(nextStart);
          setEnd(nextEnd);
        }}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledDateRangeInput />,
};

export const WithValue: Story = {
  render: () => <ControlledDateRangeInput start="2026-07-01" end="2026-07-15" />,
};

export const CustomPlaceholder: Story = {
  render: () => <ControlledDateRangeInput placeholder="Filter by period" />,
};
