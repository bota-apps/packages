import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "./index";
import { Button } from "../button";
import { Heading, Text } from "../typography";
import { Inline, Stack } from "../layout";

const meta: Meta<typeof Hero> = {
  title: "Layout/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero>;

function HeroCopy() {
  return (
    <Stack gap="lg" align="center" className="max-w-2xl">
      <Heading as="h1" size="xl">
        Build faster with a design system
      </Heading>
      <Text size="lg" tone="muted">
        Tokenized components, dark mode, and brand theming out of the box — so every page ships
        consistent from day one.
      </Text>
      <Inline gap="md">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">
          View components
        </Button>
      </Inline>
    </Stack>
  );
}

export const Default: Story = {
  render: () => (
    <Hero>
      <HeroCopy />
    </Hero>
  ),
};

export const Glow: Story = {
  render: () => (
    <Hero treatment="glow">
      <HeroCopy />
    </Hero>
  ),
};

export const Grid: Story = {
  render: () => (
    <Hero treatment="grid">
      <HeroCopy />
    </Hero>
  ),
};

export const Tint: Story = {
  render: () => (
    <Hero treatment="tint">
      <HeroCopy />
    </Hero>
  ),
};

export const Aurora: Story = {
  render: () => (
    <Hero treatment="aurora">
      <HeroCopy />
    </Hero>
  ),
};

export const StartAligned: Story = {
  render: () => (
    <Hero treatment="glow" align="start">
      <Stack gap="lg" align="start" className="max-w-2xl">
        <Heading as="h1" size="xl">
          One toolkit for every product surface
        </Heading>
        <Text size="lg" tone="muted">
          Compose sections from primitives and let the theme tokens handle depth, color, and
          contrast across brands.
        </Text>
        <Inline gap="md">
          <Button size="lg">Start building</Button>
          <Button size="lg" variant="ghost">
            Read the docs
          </Button>
        </Inline>
      </Stack>
    </Hero>
  ),
};

export const StructuredProps: Story = {
  render: () => (
    <Hero
      treatment="glow"
      title="Projects without the paperwork"
      description="Run projects for your whole team in minutes, not days."
      actions={
        <>
          <Button size="lg">Get started</Button>
          <Button size="lg" variant="outline">
            Book a demo
          </Button>
        </>
      }
    />
  ),
};
