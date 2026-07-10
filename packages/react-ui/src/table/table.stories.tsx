import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./index";

const meta: Meta<typeof Table> = {
  title: "Display/Table",
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table>;

const projects = [
  { id: "PRJ-001", client: "Acme Corp", status: "Active", amount: "12,500.00 USD" },
  { id: "PRJ-002", client: "Globex", status: "Pending", amount: "8,200.00 USD" },
  { id: "PRJ-003", client: "Initech", status: "Active", amount: "21,340.00 USD" },
  { id: "PRJ-004", client: "Umbrella", status: "On hold", amount: "4,975.00 USD" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent projects.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.id}</TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell>{project.status}</TableCell>
            <TableCell align="right">{project.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell align="right">47,015.00 USD</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
