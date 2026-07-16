import type { Meta, StoryObj } from "@storybook/react-vite";
import { RouteDiagram, type RouteLeg, type RouteNode } from "./index";

const meta: Meta<typeof RouteDiagram> = {
  title: "Display/RouteDiagram",
  component: RouteDiagram,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof RouteDiagram>;

// Generic, domain-neutral staged journey: Origin → Hub → Destination.
const nodes: RouteNode[] = [
  { id: "origin", label: "Origin", sublabel: "Stage A", status: "complete" },
  { id: "hub", label: "Hub", sublabel: "Stage B", status: "current" },
  { id: "destination", label: "Destination", sublabel: "Stage C", status: "upcoming" },
];

const legs: RouteLeg[] = [
  { id: "leg1", from: "origin", to: "hub", label: "Segment 1", status: "complete" },
  { id: "leg2", from: "hub", to: "destination", label: "Segment 2", status: "upcoming" },
];

export const HorizontalThreeStops: Story = {
  args: { nodes, legs, ariaLabel: "Staged journey" },
};

export const Vertical: Story = {
  args: { nodes, legs, orientation: "vertical", ariaLabel: "Staged journey" },
};

export const WithProgress: Story = {
  args: {
    ariaLabel: "Staged journey progress",
    nodes: [
      { id: "a", label: "Origin", sublabel: "Stage A", status: "complete" },
      { id: "b", label: "Hub 1", sublabel: "Stage B", status: "complete" },
      { id: "c", label: "Hub 2", sublabel: "Stage C", status: "current" },
      { id: "d", label: "Destination", sublabel: "Stage D", status: "upcoming" },
    ],
    legs: [
      { id: "l1", from: "a", to: "b", label: "Segment 1", status: "complete" },
      { id: "l2", from: "b", to: "c", label: "Segment 2", status: "complete" },
      { id: "l3", from: "c", to: "d", label: "Segment 3", status: "upcoming" },
    ],
  },
};

export const NarrowContainer: Story = {
  args: { nodes, legs, ariaLabel: "Staged journey" },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <RouteDiagram {...args} />
    </div>
  ),
};

export const ReducedMotionNote: Story = {
  args: { nodes, legs, ariaLabel: "Staged journey" },
  parameters: {
    docs: {
      description: {
        story:
          "Legs draw in on mount via a CSS stroke-dashoffset transition. Under " +
          "`prefers-reduced-motion: reduce` (or `animate={false}`) the fully-drawn " +
          "route renders immediately, with no transition and no hidden frame.",
      },
    },
  },
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <RouteDiagram {...args} />
      <RouteDiagram {...args} animate={false} ariaLabel="Staged journey (no animation)" />
    </div>
  ),
};
