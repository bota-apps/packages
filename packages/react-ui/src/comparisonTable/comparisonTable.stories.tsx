import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Minus } from "lucide-react";
import {
  ComparisonTable,
  type ComparisonColumn,
  type ComparisonRow,
  type ComparisonTableProps,
} from "./index";

// The stories fix the generic to `Plan` so args keep their concrete type
// (Meta<typeof ComparisonTable> would erase the generic to `unknown`).
const meta: Meta<ComparisonTableProps<Plan>> = {
  title: "Display/ComparisonTable",
  component: ComparisonTable,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<ComparisonTableProps<Plan>>;

// Domain-neutral sample: three subscription plans compared across attributes.
type Plan = {
  price: string;
  seats: string;
  storage: string;
  support: string;
  hasApi: boolean;
};

const plans: Record<string, Plan> = {
  starter: {
    price: "$0 / mo",
    seats: "1",
    storage: "5 GB",
    support: "Community",
    hasApi: false,
  },
  standard: {
    price: "$12 / mo",
    seats: "Up to 5",
    storage: "100 GB",
    support: "Email",
    hasApi: true,
  },
  premium: {
    price: "$29 / mo",
    seats: "Unlimited",
    storage: "1 TB",
    support: "Priority",
    hasApi: true,
  },
};

const columns: ComparisonColumn<Plan>[] = [
  { id: "starter", option: plans.starter, title: "Starter", subtitle: "For getting started" },
  { id: "standard", option: plans.standard, title: "Standard", subtitle: "For small teams" },
  { id: "premium", option: plans.premium, title: "Premium", subtitle: "For scaling teams" },
];

const yesNo = (value: boolean) =>
  value ? (
    <Check aria-label="Included" className="size-4 text-primary" />
  ) : (
    <Minus aria-label="Not included" className="size-4 text-muted-foreground" />
  );

const rows: ComparisonRow<Plan>[] = [
  { id: "price", label: "Monthly price", render: (plan) => plan.price },
  { id: "seats", label: "Seats", render: (plan) => plan.seats },
  { id: "storage", label: "Storage", render: (plan) => plan.storage },
  { id: "support", label: "Support", render: (plan) => plan.support },
  { id: "api", label: "Programmatic access", render: (plan) => yesNo(plan.hasApi) },
];

export const Default: Story = {
  args: { columns, rows, ariaLabel: "Plan comparison" },
};

export const RecommendedAndSelected: Story = {
  args: {
    ariaLabel: "Plan comparison",
    columns: [
      { ...columns[0], states: ["lowest"] },
      { ...columns[1], states: ["recommended"] },
      { ...columns[2], states: ["highest"] },
    ],
    rows,
    selectedColumnId: "standard",
  },
};

export const WithUnavailable: Story = {
  args: {
    ariaLabel: "Plan comparison",
    columns: [
      columns[0],
      { ...columns[1], states: ["recommended"] },
      { ...columns[2], states: ["unavailable"] },
    ],
    rows,
  },
};

function SelectablePlans() {
  const [selectedColumnId, setSelectedColumnId] = useState<string>("standard");
  return (
    <ComparisonTable
      columns={[
        { ...columns[0], states: ["lowest"] },
        { ...columns[1], states: ["recommended"] },
        columns[2],
      ]}
      rows={rows}
      ariaLabel="Plan comparison"
      selectedColumnId={selectedColumnId}
      onSelectColumn={setSelectedColumnId}
    />
  );
}

export const Selectable: Story = {
  render: () => <SelectablePlans />,
};

export const NarrowContainer: Story = {
  args: {
    ariaLabel: "Plan comparison",
    columns: [columns[0], { ...columns[1], states: ["recommended"] }, columns[2]],
    rows,
    selectedColumnId: "standard",
    onSelectColumn: () => undefined,
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ComparisonTable {...args} />
    </div>
  ),
};

export const LongLabels: Story = {
  args: {
    ariaLabel: "Option comparison",
    columns: [
      {
        id: "a",
        option: plans.starter,
        title: "Community edition with self-hosted deployment",
        subtitle: "Best when you manage your own infrastructure end to end",
        states: ["lowest"],
      },
      {
        id: "b",
        option: plans.standard,
        title: "Managed collaboration tier for growing teams",
        subtitle: "Balances hands-off operations with predictable monthly cost",
        states: ["recommended"],
      },
      {
        id: "c",
        option: plans.premium,
        title: "Enterprise tier with dedicated onboarding support",
        subtitle: "For organizations with advanced compliance requirements",
        states: ["highest"],
      },
    ],
    rows: [
      {
        id: "price",
        label: "Total estimated cost per billing period, before discounts",
        description: "Excludes usage-based add-ons that vary month to month.",
        render: (plan: Plan) => plan.price,
      },
      { id: "seats", label: "Included seats", render: (plan: Plan) => plan.seats },
      { id: "storage", label: "Storage allowance", render: (plan: Plan) => plan.storage },
    ],
  },
};
