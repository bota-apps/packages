import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotLeader } from "./index";
import { Div } from "../html";
import { Inline, Stack } from "../layout";
import { Heading, Text } from "../typography";

const meta: Meta<typeof DotLeader> = {
  title: "Layout/DotLeader",
  component: DotLeader,
};
export default meta;

type Story = StoryObj<typeof DotLeader>;

export const LabelValueRow: Story = {
  render: () => (
    <Inline align="baseline" className="w-96">
      <Text size="sm">Service fee</Text>
      <DotLeader />
      <Text size="sm">12,000.00</Text>
    </Inline>
  ),
};

/** The print-fidelity document chrome the leader was built for: primary-tinted
 *  banner and total bands, accented section headers, and dotted label……value
 *  line items — zero raw className at the call sites. */
export const StatementDocument: Story = {
  render: () => (
    <Div className="w-[28rem] overflow-hidden rounded-lg border shadow-sm">
      <Div background="primary" border="bPrimary" paddingX="xl" paddingY="lg">
        <Stack gap="xs">
          <Heading size="lg">Acme Supplies Co.</Heading>
          <Text size="sm" tone="muted">
            123 Commerce Street
          </Text>
        </Stack>
      </Div>
      <Div background="primarySubtle" border="bPrimarySubtle" paddingX="xl" paddingY="md">
        <Text weight="medium" size="lg">
          Account 10-4482
        </Text>
      </Div>
      <Inline paddingX="xl" paddingY="md" accent borderBottom background="primarySubtle">
        <Text size="sm" weight="medium" tone="primary">
          Charges
        </Text>
      </Inline>
      <Inline align="baseline" paddingX="xl" paddingY="md" indent="xl">
        <Text size="sm">Service fee</Text>
        <DotLeader />
        <Text size="sm">12,000.00</Text>
      </Inline>
      <Inline align="baseline" paddingX="xl" paddingY="md" indent="xl">
        <Text size="sm">Discount</Text>
        <DotLeader />
        <Text size="sm">-2,435.00</Text>
      </Inline>
      <Inline justify="between" paddingX="xl" paddingY="xl" borderTop background="primary">
        <Heading size="sm">Amount due</Heading>
        <Text weight="bold" tone="primary">
          9,565.00
        </Text>
      </Inline>
    </Div>
  ),
};
