import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaterfallChart, type WaterfallDatum } from "./index";

const data: WaterfallDatum[] = [
  { id: "opening", label: "Opening", value: 1200, kind: "total" },
  { id: "additions", label: "Additions", value: 480 },
  { id: "adjustmentA", label: "Adjustment A", value: -260 },
  { id: "adjustmentB", label: "Adjustment B", value: 150 },
  { id: "deductions", label: "Deductions", value: -320 },
  { id: "closing", label: "Closing", value: 1250, kind: "total" },
];

const negativeEndingData: WaterfallDatum[] = [
  { id: "opening", label: "Opening", value: 400, kind: "total" },
  { id: "adjustmentA", label: "Adjustment A", value: 150 },
  { id: "adjustmentB", label: "Adjustment B", value: -700 },
  { id: "closing", label: "Closing", value: -150, kind: "total" },
];

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const meta: Meta<typeof WaterfallChart> = {
  title: "Charts/WaterfallChart",
  component: WaterfallChart,
};
export default meta;

type Story = StoryObj<typeof WaterfallChart>;

export const Standard: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <WaterfallChart
        data={data}
        valueFormatter={currencyFormatter}
        ariaLabel="Opening to closing value bridge"
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <WaterfallChart data={data} variant="compact" size="sm" />
    </div>
  ),
};

export const WithNegativeEnding: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <WaterfallChart data={negativeEndingData} ariaLabel="Bridge ending below zero" />
    </div>
  ),
};

export const AccessibleTable: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <WaterfallChart
        data={data}
        valueFormatter={currencyFormatter}
        showDataTable
        ariaLabel="Opening to closing value bridge"
      />
    </div>
  ),
};
