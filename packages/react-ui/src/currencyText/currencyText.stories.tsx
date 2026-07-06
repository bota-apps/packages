import type { Meta, StoryObj } from "@storybook/react";
import type { Money } from "@bota-apps/types";
import { CurrencyText } from "./index";

const budget: Money = { amount: 45250.75, currency: "USD" };
const totalBudget: Money = { amount: 1145000, currency: "USD" };

const meta: Meta<typeof CurrencyText> = {
  title: "Display/CurrencyText",
  component: CurrencyText,
};
export default meta;

type Story = StoryObj<typeof CurrencyText>;

export const Default: Story = {
  render: () => <CurrencyText value={budget} />,
};

export const Formats: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <CurrencyText value={totalBudget} format="short" />
      <CurrencyText value={totalBudget} format="compact" />
      <CurrencyText value={totalBudget} format="full" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <CurrencyText value={budget} size="sm" />
      <CurrencyText value={budget} size="md" />
      <CurrencyText value={budget} size="lg" />
      <CurrencyText value={budget} size="xl" />
      <CurrencyText value={budget} size="2xl" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <CurrencyText value={budget} tone="default" />
      <CurrencyText value={budget} tone="muted" />
      <CurrencyText value={budget} tone="primary" />
      <CurrencyText value={budget} tone="success" />
      <CurrencyText value={budget} tone="destructive" />
    </div>
  ),
};
