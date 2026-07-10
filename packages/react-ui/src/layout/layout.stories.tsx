import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const LabeledRow: Story = {
  render: () => (
    <Inline gap="lg" className="w-96">
      <Stack width="md" shrink="0">
        <Swatch>Date</Swatch>
      </Stack>
      <Stack grow gap="sm">
        <Swatch>Flexible content column (grows, min-w-0)</Swatch>
      </Stack>
    </Inline>
  ),
};

export const SelectableRows: Story = {
  render: () => (
    <Stack className="w-96 rounded-md border">
      <Inline justify="between" paddingX="md" paddingY="lg" borderBottom>
        <Badge variant="secondary">Header row</Badge>
      </Inline>
      <Inline gap="sm" paddingX="md" paddingY="md" background="muted">
        <Badge variant="muted">Group header</Badge>
      </Inline>
      <Inline gap="sm" paddingX="md" paddingY="md" indent="md" borderBottom>
        <Badge variant="outline">Nested row (indented)</Badge>
      </Inline>
    </Stack>
  ),
};

/** Document-artifact rows (statement/invoice-style): primary tints, accented
 *  section header, xl padding/indent, and a top-bordered emphasized total band.
 *  See Layout/DotLeader for the full statement composition. */
export const DocumentRows: Story = {
  render: () => (
    <Stack className="w-96 rounded-md border overflow-hidden">
      <Inline paddingX="xl" paddingY="md" accent borderBottom background="primarySubtle">
        <Badge variant="secondary">Section header (accent bar)</Badge>
      </Inline>
      <Inline paddingX="xl" paddingY="md" indent="xl" borderBottom>
        <Badge variant="outline">Line item (xl indent)</Badge>
      </Inline>
      <Inline justify="between" paddingX="xl" paddingY="xl" borderTop background="primary">
        <Badge variant="secondary">Total band</Badge>
        <Badge>9,565.00</Badge>
      </Inline>
    </Stack>
  ),
};
