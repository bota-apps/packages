import type { Meta, StoryObj } from "@storybook/react";
import { PrintDocument } from "./printDocument";
import { PrintRoot } from "./printRoot";
import { PageBreak } from "./pageBreak";
import { PrintOnly } from "./printOnly";
import { ScreenOnly } from "./screenOnly";
import { usePrint } from "./usePrint";
import { Button } from "../button";
import { Card } from "../card";
import { Stack } from "../layout";
import { Heading, Text } from "../typography";

const meta: Meta<typeof PrintDocument> = {
  title: "Print/Print",
  component: PrintDocument,
};
export default meta;

type Story = StoryObj<typeof PrintDocument>;

function ProjectSummaryExample() {
  const { printRef, print, isPrinting } = usePrint<HTMLDivElement>({
    title: "Project summary — June 2026",
    documentType: "project-summary",
  });

  return (
    <Stack gap="md" className="max-w-xl">
      <ScreenOnly>
        <Button onClick={() => void print()} disabled={isPrinting}>
          {isPrinting ? "Printing…" : "Print summary"}
        </Button>
      </ScreenOnly>

      <PrintRoot ref={printRef} documentType="project-summary">
        <PrintDocument title="Project summary" subtitle="June 2026">
          <Stack gap="md">
            <PrintOnly>
              <Text size="sm" tone="muted">
                Generated for print only — this line is hidden on screen.
              </Text>
            </PrintOnly>

            <Card title="Project summary — June 2026" description="Jane Doe · Engineering">
              <Stack gap="sm">
                <Text size="sm">Budget: 48,000 USD</Text>
                <Text size="sm">Spent: 11,300 USD</Text>
                <Text size="sm" weight="semibold">
                  Remaining: 36,700 USD
                </Text>
              </Stack>
            </Card>

            <PageBreak />

            <Card title="Page two">
              <Heading size="xs">Budget detail</Heading>
              <Text size="sm" tone="muted">
                The PageBreak above forces this card onto a new printed page.
              </Text>
            </Card>
          </Stack>
        </PrintDocument>
      </PrintRoot>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <ProjectSummaryExample />,
};
