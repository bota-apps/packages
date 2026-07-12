import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, Wallet } from "lucide-react";
import { StatCard } from "../../statCard";
import { Sparkline } from "./index";

const meta: Meta<typeof Sparkline> = {
  title: "Charts/Sparkline",
  component: Sparkline,
};
export default meta;

type Story = StoryObj<typeof Sparkline>;

const trend = [12, 18, 14, 22, 19, 27, 24, 31];
const dip = [30, 26, 27, 21, 22, 17, 19, 14];

export const Default: Story = {
  render: () => <Sparkline data={trend} />,
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Sparkline data={trend} color="primary" />
      <Sparkline data={trend} color="success" />
      <Sparkline data={dip} color="rose" />
    </div>
  ),
};

export const InsideStatCard: Story = {
  render: () => (
    <div className="grid w-[560px] grid-cols-2 gap-4">
      <StatCard
        label="Active members"
        value={1284}
        icon={Users}
        chart={<Sparkline data={trend} size="sm" />}
      />
      <StatCard
        label="Monthly spend"
        value={{ amount: 48200, currency: "USD" }}
        isCurrency
        icon={Wallet}
        chart={<Sparkline data={dip} size="sm" color="rose" />}
      />
    </div>
  ),
};
