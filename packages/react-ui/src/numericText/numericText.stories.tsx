import type { Meta, StoryObj } from "@storybook/react";
import { NumericText } from "./index";

const meta: Meta<typeof NumericText> = {
  title: "Display/NumericText",
  component: NumericText,
};
export default meta;

type Story = StoryObj<typeof NumericText>;

export const Default: Story = {
  render: () => <NumericText value={12847} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <NumericText value={12847} variant="count" />
      <NumericText value={12.5} variant="percent" />
      <NumericText value={87.25} variant="percent" decimals={2} />
      <NumericText value={3} variant="ordinal" />
      <NumericText value={22} variant="ordinal" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <NumericText value={4.2} variant="percent" tone="success" />
      <NumericText value={-1.8} variant="percent" tone="destructive" />
      <NumericText value={0.5} variant="percent" tone="warning" />
      <NumericText value={120} tone="muted" />
    </div>
  ),
};

export const SizesAndWeights: Story = {
  render: () => (
    <div className="flex items-baseline gap-4">
      <NumericText value={27} size="sm" />
      <NumericText value={27} size="md" weight="medium" />
      <NumericText value={27} size="lg" weight="semibold" />
      <NumericText value={27} size="xl" weight="bold" />
    </div>
  ),
};
