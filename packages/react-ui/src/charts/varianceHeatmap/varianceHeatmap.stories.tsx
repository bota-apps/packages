import type { Meta, StoryObj } from "@storybook/react-vite";
import { VarianceHeatmap, type HeatmapCell, type VarianceHeatmapHeader } from "./index";

const meta: Meta<typeof VarianceHeatmap> = {
  title: "Charts/VarianceHeatmap",
  component: VarianceHeatmap,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof VarianceHeatmap>;

const rows: VarianceHeatmapHeader[] = [
  { id: "a", label: "Group A" },
  { id: "b", label: "Group B" },
  { id: "c", label: "Group C" },
];

const columns: VarianceHeatmapHeader[] = [
  { id: "p1", label: "Period 1" },
  { id: "p2", label: "Period 2" },
  { id: "p3", label: "Period 3" },
];

/** Builds a `getCell` accessor from a nested `{ rowId: { colId: value } }` map. */
function cellsFrom(
  data: Record<string, Record<string, number | undefined>>,
): (rowId: string, colId: string) => HeatmapCell | undefined {
  return (rowId, colId) => {
    const value = data[rowId]?.[colId];
    return value === undefined ? undefined : { value };
  };
}

const percent = (value: number): string => {
  if (value > 0) {
    return `+${value}%`;
  }
  if (value < 0) {
    return `−${Math.abs(value)}%`;
  }
  return "0%";
};

export const Default: Story = {
  args: {
    rows,
    columns,
    ariaLabel: "Variance by group and period",
    caption: "Variance (%) versus baseline",
    valueFormatter: percent,
    getCell: cellsFrom({
      a: { p1: 4, p2: 9, p3: 12 },
      b: { p1: 6, p2: 3, p3: 8 },
      c: { p1: 11, p2: 7, p3: 2 },
    }),
  },
};

export const WithNegatives: Story = {
  args: {
    rows,
    columns,
    ariaLabel: "Variance by group and period",
    caption: "Diverging scale — below and above baseline",
    valueFormatter: percent,
    getCell: cellsFrom({
      a: { p1: -18, p2: -6, p3: 3 },
      b: { p1: 14, p2: 0, p3: -9 },
      c: { p1: -2, p2: 21, p3: 7 },
    }),
  },
};

export const LargeMatrix: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <VarianceHeatmap {...args} />
    </div>
  ),
  args: {
    ariaLabel: "Variance across many periods",
    caption: "Wide matrices scroll horizontally in a narrow container",
    valueFormatter: percent,
    rows: Array.from({ length: 6 }, (_, index) => ({
      id: `r${index}`,
      label: `Group ${String.fromCharCode(65 + index)}`,
    })),
    columns: Array.from({ length: 10 }, (_, index) => ({
      id: `c${index}`,
      label: `Period ${index + 1}`,
    })),
    getCell: (rowId, colId) => {
      const r = Number(rowId.slice(1));
      const c = Number(colId.slice(1));
      // Deterministic spread of positive and negative variances.
      const value = Math.round(Math.sin(r * 1.3 + c * 0.7) * 24);
      return { value };
    },
  },
};

export const WithEmptyCells: Story = {
  args: {
    rows,
    columns,
    ariaLabel: "Variance with gaps",
    caption: "Missing measurements render as empty cells",
    valueFormatter: percent,
    getCell: cellsFrom({
      a: { p1: 5, p2: undefined, p3: 12 },
      b: { p1: undefined, p2: -8, p3: undefined },
      c: { p1: 9, p2: 4, p3: undefined },
    }),
  },
};

export const WithoutLegend: Story = {
  args: {
    rows,
    columns,
    showLegend: false,
    ariaLabel: "Variance by group and period",
    valueFormatter: percent,
    getCell: cellsFrom({
      a: { p1: 4, p2: 9, p3: 12 },
      b: { p1: 6, p2: 3, p3: 8 },
      c: { p1: 11, p2: 7, p3: 2 },
    }),
  },
};
