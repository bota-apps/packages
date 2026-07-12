import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedNumber } from "./index";
import { Grid, Stack } from "../layout";
import { Heading, Text } from "../typography";

const meta: Meta<typeof AnimatedNumber> = {
  title: "Motion/AnimatedNumber",
  component: AnimatedNumber,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof AnimatedNumber>;

function Metric({
  value,
  label,
  format,
}: {
  value: number;
  label: string;
  format?: (v: number) => string;
}) {
  return (
    <Stack gap="xs" align="center">
      <Heading as="p" size="lg">
        <AnimatedNumber value={value} format={format} />
      </Heading>
      <Text size="sm" tone="muted">
        {label}
      </Text>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <AnimatedNumber value={12480} />,
};

export const MetricRow: Story = {
  render: () => (
    <Grid columns={3} gap="lg">
      <Metric value={240} label="Components shipped" format={(v) => `${Math.round(v)}+`} />
      <Metric value={99.98} label="Uptime %" format={(v) => v.toFixed(2)} />
      <Metric value={1250000} label="Records processed" />
    </Grid>
  ),
};

export const BelowTheFold: Story = {
  render: () => (
    <Stack gap="lg">
      <div className="flex h-[80vh] items-center justify-center rounded-lg border border-dashed">
        <Text tone="muted">Scroll down — the counter starts when it enters the viewport.</Text>
      </div>
      <Metric value={86400} label="Seconds in a day" />
    </Stack>
  ),
};
