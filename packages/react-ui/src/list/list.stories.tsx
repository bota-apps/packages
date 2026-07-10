import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./index";
import { Badge } from "../badge";

const meta: Meta<typeof List> = {
  title: "Display/List",
  component: List,
};
export default meta;

type Story = StoryObj<typeof List>;

type Task = {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
};

const tasks: Task[] = [
  { id: "t1", title: "Review project plan", assignee: "Jane", done: true },
  { id: "t2", title: "Approve design draft", assignee: "John", done: false },
  { id: "t3", title: "Publish April report", assignee: "Ada", done: false },
  { id: "t4", title: "Update documentation", assignee: "Liam", done: true },
];

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{task.title}</p>
        <p className="text-sm text-muted-foreground">{task.assignee}</p>
      </div>
      <Badge variant={task.done ? "success" : "warning"}>{task.done ? "Done" : "Open"}</Badge>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <List
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => <TaskRow task={task} />}
      gap="sm"
      className="w-96"
    />
  ),
};

export const Divided: Story = {
  render: () => (
    <List
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => <TaskRow task={task} />}
      variant="divided"
      className="w-96"
    />
  ),
};

export const CardLayout: Story = {
  render: () => (
    <List
      layout="card"
      title="This week's tasks"
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => <TaskRow task={task} />}
      variant="divided"
      className="w-96"
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <List
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => <TaskRow task={task} />}
      onItemClick={() => {}}
      variant="divided"
      className="w-96"
    />
  ),
};

export const TwoColumnGrid: Story = {
  render: () => (
    <List
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => (
        <div className="rounded-md border p-3">
          <TaskRow task={task} />
        </div>
      )}
      columns={2}
      gap="md"
      className="w-[36rem]"
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <List
      data={[] as Task[]}
      keyExtractor={(task) => task.id}
      renderItem={(task) => <TaskRow task={task} />}
      ListEmptyComponent={<p className="text-sm text-muted-foreground">No tasks yet.</p>}
    />
  ),
};
