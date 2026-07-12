import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reveal, RevealGroup } from "./index";
import { Card } from "../card";
import { Grid, Stack } from "../layout";
import { Text } from "../typography";

const meta: Meta<typeof Reveal> = {
  title: "Motion/Reveal",
  component: Reveal,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Reveal>;

function Spacer() {
  return (
    <div className="flex h-[60vh] items-center justify-center rounded-lg border border-dashed">
      <Text tone="muted">Scroll down…</Text>
    </div>
  );
}

function DemoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card title={title} className="h-full">
      <Text tone="muted">{body}</Text>
    </Card>
  );
}

export const Effects: Story = {
  render: () => (
    <Stack gap="lg">
      <Spacer />
      <Reveal effect="fade">
        <DemoCard title="Fade" body="Opacity only — the calmest entrance." />
      </Reveal>
      <Reveal effect="fadeUp">
        <DemoCard title="Fade up" body="The default: rises into place as it appears." />
      </Reveal>
      <Reveal effect="fadeDown">
        <DemoCard title="Fade down" body="Settles downward — suits content under a header." />
      </Reveal>
      <Reveal effect="zoom">
        <DemoCard title="Zoom" body="Scales from 95% — reserve for a single focal element." />
      </Reveal>
      <Spacer />
    </Stack>
  ),
};

export const StaggeredGrid: Story = {
  render: () => (
    <Stack gap="lg">
      <Spacer />
      <Grid columns={3} gap="md">
        <RevealGroup itemClassName="h-full">
          <DemoCard title="Composable" body="Primitives assemble into full pages." />
          <DemoCard title="Tokenized" body="Every color and shadow resolves through the theme." />
          <DemoCard title="Accessible" body="Reduced-motion users see content instantly." />
        </RevealGroup>
      </Grid>
      <Spacer />
    </Stack>
  ),
};

export const ReducedMotionNote: Story = {
  render: () => (
    <Stack gap="md">
      <Text>
        With <code>prefers-reduced-motion: reduce</code> emulated, every Reveal renders its resting
        state immediately — content below never gets an entrance pose.
      </Text>
      <Reveal>
        <DemoCard title="Instant for reduced motion" body="No hidden frame, no transition." />
      </Reveal>
    </Stack>
  ),
};
