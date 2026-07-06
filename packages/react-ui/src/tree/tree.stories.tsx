import type { Meta, StoryObj } from "@storybook/react";
import { Tree, type TreeNodeData, type TreeNodeContext } from "./index";

const meta: Meta<typeof Tree> = {
  title: "Display/Tree",
  component: Tree,
};
export default meta;

type Story = StoryObj<typeof Tree>;

type OrgUnit = {
  name: string;
  role: string;
};

const orgChart: TreeNodeData<OrgUnit> = {
  id: "ceo",
  data: { name: "Jane Doe", role: "CEO" },
  children: [
    {
      id: "cto",
      data: { name: "John Smith", role: "CTO" },
      children: [
        { id: "eng-1", data: { name: "Ada Lovelace", role: "Engineer" } },
        { id: "eng-2", data: { name: "Liam Chen", role: "Engineer" } },
      ],
    },
    {
      id: "cfo",
      data: { name: "Maria Garcia", role: "CFO" },
      children: [{ id: "fin-1", data: { name: "Noah Patel", role: "Accountant" } }],
    },
  ],
};

function OrgNode({ node, ctx }: { node: TreeNodeData<OrgUnit>; ctx: TreeNodeContext }) {
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-center shadow-sm">
      <p className="text-sm font-medium">{node.data.name}</p>
      <p className="text-xs text-muted-foreground">{node.data.role}</p>
      {!ctx.isLeaf && (
        <button
          type="button"
          className="mt-1 text-xs text-primary hover:underline"
          onClick={ctx.toggle}
        >
          {ctx.isCollapsed ? `Show ${ctx.childCount}` : "Hide"}
        </button>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Tree data={orgChart} renderNode={(node, ctx) => <OrgNode node={node} ctx={ctx} />} />
  ),
};

export const Collapsed: Story = {
  render: () => (
    <Tree
      data={orgChart}
      defaultCollapsedIds={new Set(["cfo"])}
      renderNode={(node, ctx) => <OrgNode node={node} ctx={ctx} />}
    />
  ),
};

export const WithoutConnectors: Story = {
  render: () => (
    <Tree
      data={orgChart}
      connectors={false}
      size="sm"
      align="start"
      renderNode={(node, ctx) => <OrgNode node={node} ctx={ctx} />}
    />
  ),
};
