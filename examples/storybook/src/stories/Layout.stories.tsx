import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Inline, Grid, Card, Badge } from "@bota-apps/react-ui";

const meta = {
  title: "Layout/Primitives",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StackExample: Story = {
  name: "Stack (vertical)",
  render: () => (
    <Stack gap="md">
      <Card title="First" />
      <Card title="Second" />
      <Card title="Third" />
    </Stack>
  ),
};

export const InlineExample: Story = {
  name: "Inline (horizontal)",
  render: () => (
    <Inline gap="sm" wrap>
      <Badge>One</Badge>
      <Badge variant="secondary">Two</Badge>
      <Badge variant="success">Three</Badge>
    </Inline>
  ),
};

export const GridExample: Story = {
  name: "Grid (responsive columns)",
  render: () => (
    <Grid columns={3} gap="md">
      <Card title="Col 1" description="Resizes responsively" />
      <Card title="Col 2" description="md:2 / lg:3 columns" />
      <Card title="Col 3" description="From the package preset" />
    </Grid>
  ),
};
