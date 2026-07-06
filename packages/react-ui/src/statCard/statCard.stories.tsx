import type { Meta, StoryObj } from "@storybook/react";
import { Users, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "./index";

const meta: Meta<typeof StatCard> = {
  title: "Display/StatCard",
  component: StatCard,
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <StatCard label="Projects" value={128} icon={Users} />
    </div>
  ),
};

export const CurrencyValue: Story = {
  render: () => (
    <div className="w-72">
      <StatCard
        label="Total budget"
        value={{ amount: 1145000, currency: "USD" }}
        isCurrency
        icon={Wallet}
        description="April 2026"
      />
    </div>
  ),
};

export const VariantsAndTones: Story = {
  render: () => (
    <div className="grid w-[40rem] grid-cols-2 gap-3">
      <StatCard label="Active" value={112} icon={Users} variant="outlined" tone="success" />
      <StatCard label="On hold" value={9} icon={AlertTriangle} variant="outlined" tone="warning" />
      <StatCard label="Growth" value="12.5%" icon={TrendingUp} variant="filled" tone="info" />
      <StatCard label="Archived" value={7} icon={Users} variant="filled" tone="destructive" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <StatCard label="Compact" value={42} icon={Users} size="sm" />
      <StatCard label="Default" value={42} icon={Users} />
      <StatCard label="Hero" value={42} icon={Users} size="lg" />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div className="w-64">
      <StatCard
        label="Pending approvals"
        value={6}
        icon={AlertTriangle}
        tone="warning"
        onClick={() => {}}
      />
    </div>
  ),
};
