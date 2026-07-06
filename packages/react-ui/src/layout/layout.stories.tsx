import type { Meta, StoryObj } from "@storybook/react";
import { Box, Center, Container, Grid, Inline, Stack } from "./index";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";

const meta: Meta<typeof Stack> = {
  title: "Layout/Layout Primitives",
  component: Stack,
};
export default meta;

type Story = StoryObj<typeof Stack>;

const Swatch = ({ children }: { children: string }) => (
  <div className="rounded-md bg-muted px-4 py-2 text-sm">{children}</div>
);

export const StackExample: Story = {
  render: () => (
    <Stack gap="md">
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
      <Swatch>Three</Swatch>
    </Stack>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <Inline gap="sm" align="center" justify="between" className="w-96">
      <Badge>Active</Badge>
      <Button size="sm" variant="outline">
        Manage
      </Button>
    </Inline>
  ),
};

export const GridExample: Story = {
  render: () => (
    <Grid columns={3} gap="md">
      <Card title="Alpha" />
      <Card title="Beta" />
      <Card title="Gamma" />
    </Grid>
  ),
};

export const CenterAndContainer: Story = {
  render: () => (
    <Container padding="md">
      <Center maxWidth="sm">
        <Card title="Centered" description="Center constrains and centers its content." />
      </Center>
    </Container>
  ),
};

export const BoxExample: Story = {
  render: () => (
    <Box position="relative" className="h-24 w-64 rounded-md bg-muted">
      <Box as="span" position="absolute" inset="topRight" className="p-2">
        <Badge variant="destructive">3</Badge>
      </Box>
    </Box>
  ),
};
