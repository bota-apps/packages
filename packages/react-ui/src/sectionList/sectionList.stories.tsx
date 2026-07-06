import type { Meta, StoryObj } from "@storybook/react";
import { SectionList } from "./index";
import { Badge } from "../badge";
import { Inline } from "../layout";
import { Text } from "../typography";
import { EmptyState } from "../emptyState";

type Project = { id: string; name: string; role: string };

const engineering: Project[] = [
  { id: "e1", name: "Jane Doe", role: "Frontend engineer" },
  { id: "e2", name: "John Smith", role: "Backend engineer" },
];

const operations: Project[] = [{ id: "o1", name: "Ada Lovelace", role: "Operations lead" }];

const sections = [
  {
    key: "engineering",
    title: "Engineering",
    description: "Product and platform teams.",
    titleRight: <Badge variant="secondary">{engineering.length}</Badge>,
    data: engineering,
  },
  {
    key: "operations",
    title: "Operations",
    data: operations,
  },
];

const renderProject = (item: Project) => (
  <Inline gap="sm" justify="between" className="px-4">
    <Text size="sm" weight="medium">
      {item.name}
    </Text>
    <Text size="sm" tone="muted">
      {item.role}
    </Text>
  </Inline>
);

const meta: Meta<typeof SectionList> = {
  title: "Layout/SectionList",
  component: SectionList,
};
export default meta;

type Story = StoryObj<typeof SectionList>;

export const Default: Story = {
  render: () => (
    <SectionList sections={sections} renderItem={renderProject} keyExtractor={(item) => item.id} />
  ),
};

export const CardVariantDivided: Story = {
  render: () => (
    <SectionList
      variant="card"
      cardProps={{ title: "Directory", description: "Grouped by department." }}
      sections={sections}
      renderItem={renderProject}
      keyExtractor={(item) => item.id}
      divided
      onItemClick={() => undefined}
    />
  ),
};

export const CollapsedByDefault: Story = {
  render: () => (
    <SectionList
      sections={sections}
      renderItem={renderProject}
      keyExtractor={(item) => item.id}
      defaultCollapsedKeys={new Set(["operations"])}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <SectionList
      sections={[]}
      renderItem={renderProject}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState title="No projects" description="Add your first project to get started." />
      }
    />
  ),
};
