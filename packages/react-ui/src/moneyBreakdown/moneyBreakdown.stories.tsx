import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoneyBreakdown, type MoneyBreakdownLine, type MoneyBreakdownSection } from "./index";

const meta: Meta<typeof MoneyBreakdown> = {
  title: "Display/MoneyBreakdown",
  component: MoneyBreakdown,
};
export default meta;

type Story = StoryObj<typeof MoneyBreakdown>;

// Amounts are passed as already-formatted strings — the component never formats
// money itself. Neutral sample data: generic charges and adjustments.
const lines: MoneyBreakdownLine[] = [
  { id: "base", label: "Base charge", value: "$1,200.00" },
  { id: "handling", label: "Handling", value: "$85.00", description: "Standard processing." },
  { id: "adjustment", label: "Promotional adjustment", value: "$60.00", negative: true },
];

const total: MoneyBreakdownLine = { id: "total", label: "Total due", value: "$1,225.00" };

export const Default: Story = {
  args: { lines, total, ariaLabel: "Charge summary" },
};

const sections: MoneyBreakdownSection[] = [
  {
    id: "charges",
    title: "Charges",
    lines: [
      { id: "base", label: "Base charge", value: "$1,200.00" },
      { id: "line-a", label: "Line item A", value: "$150.00" },
      { id: "line-b", label: "Line item B", value: "$75.00" },
    ],
    subtotal: { id: "charges-sub", label: "Charges subtotal", value: "$1,425.00" },
  },
  {
    id: "adjustments",
    title: "Adjustments",
    lines: [
      { id: "credit", label: "Account credit", value: "$100.00", negative: true },
      { id: "rebate", label: "Volume rebate", value: "$40.00", negative: true },
    ],
    subtotal: {
      id: "adjustments-sub",
      label: "Adjustments subtotal",
      value: "$140.00",
      negative: true,
    },
  },
];

export const Grouped: Story = {
  args: {
    sections,
    total: { id: "total", label: "Net total", value: "$1,285.00" },
    ariaLabel: "Statement summary",
  },
};

export const WithNegatives: Story = {
  args: {
    ariaLabel: "Settlement summary",
    lines: [
      { id: "base", label: "Base amount", value: "$3,000.00" },
      { id: "discount", label: "Discount", value: "$450.00", negative: true },
      { id: "fee", label: "Service fee", value: "$75.00", negative: true },
      { id: "credit", label: "Applied credit", value: "$120.00", negative: true },
    ],
    total: { id: "total", label: "Net total", value: "$2,355.00" },
  },
};

export const Document: Story = {
  args: {
    variant: "document",
    sections,
    total: { id: "total", label: "Net total", value: "$1,285.00" },
    ariaLabel: "Statement summary",
  },
};

export const NarrowContainer: Story = {
  args: { lines, total, ariaLabel: "Charge summary" },
  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <MoneyBreakdown {...args} />
    </div>
  ),
};

export const TotalOnly: Story = {
  args: {
    total: { id: "total", label: "Balance", value: "$0.00" },
    ariaLabel: "Balance summary",
  },
};
