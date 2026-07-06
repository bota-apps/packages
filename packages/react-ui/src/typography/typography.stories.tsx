import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text } from "./index";

const meta: Meta<typeof Heading> = {
  title: "Display/Typography",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Headings: Story = {
  render: () => (
    <div className="space-y-3">
      <Heading as="h1" size="xl">
        Heading xl
      </Heading>
      <Heading as="h2" size="lg">
        Heading lg
      </Heading>
      <Heading as="h3" size="md">
        Heading md
      </Heading>
      <Heading as="h4" size="sm">
        Heading sm
      </Heading>
      <Heading as="h5" size="xs">
        Heading xs
      </Heading>
      <Heading as="h2" size="md" tone="primary">
        Primary tone heading
      </Heading>
    </div>
  ),
};

export const TextTones: Story = {
  render: () => (
    <div className="space-y-2">
      <Text tone="default">Default body text</Text>
      <Text tone="muted">Muted supporting text</Text>
      <Text tone="primary">Primary text</Text>
      <Text tone="success">Success text</Text>
      <Text tone="destructive">Destructive text</Text>
    </div>
  ),
};

export const TextSizesAndWeights: Story = {
  render: () => (
    <div className="space-y-2">
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text as="span" weight="bold">
        Bold span
      </Text>
    </div>
  ),
};

export const Truncation: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <Text truncate>
        This single line truncates with an ellipsis once it overflows the container width.
      </Text>
      <Text lineClamp={2} tone="muted">
        Line-clamped text keeps at most two lines visible. Anything beyond the second line is
        clipped so long descriptions stay tidy inside cards and lists.
      </Text>
    </div>
  ),
};
