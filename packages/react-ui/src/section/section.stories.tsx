import type { Meta, StoryObj } from "@storybook/react";
import { Check } from "lucide-react";
import { CheckItem, Hero, Section, SectionTitle, StepIndicator } from "./index";
import { Grid, Stack } from "../layout";
import { Button } from "../button";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section>
      <SectionTitle
        title="How it works"
        description="Three steps from sign-up to your first project."
      />
      <Grid columns={3} gap="lg">
        <StepIndicator step="1" title="Create" description="Set up your organization profile." />
        <StepIndicator step="2" title="Invite" description="Add projects and tasks." />
        <StepIndicator step="3" title="Run" description="Approve and pay in one click." />
      </Grid>
    </Section>
  ),
};

export const MutedWithChecklist: Story = {
  render: () => (
    <Section background="muted">
      <SectionTitle title="Everything included" />
      <Stack gap="sm" align="center">
        <CheckItem icon={<Check />}>Unlimited projects</CheckItem>
        <CheckItem icon={<Check />}>Member self-service</CheckItem>
        <CheckItem icon={<Check />}>Analytics and reports</CheckItem>
      </Stack>
    </Section>
  ),
};

export const HeroSection: Story = {
  render: () => (
    <Hero
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
