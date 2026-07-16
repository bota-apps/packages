import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, FileText, TriangleAlert, Users } from "lucide-react";
import { Badge } from "../badge";
import { ActionCenter, type ActionCenterAction } from "./index";

const meta: Meta<typeof ActionCenter> = {
  title: "Display/ActionCenter",
  component: ActionCenter,
};
export default meta;

type Story = StoryObj<typeof ActionCenter>;

const actions: ActionCenterAction[] = [
  {
    id: "fix",
    label: "Resolve missing details",
    description: "2 records need attention before you can continue.",
    tone: "destructive",
    icon: <TriangleAlert aria-hidden />,
    onSelect: () => {},
    trailing: <Badge variant="destructive">2</Badge>,
  },
  {
    id: "review",
    label: "Review pending items",
    description: "Waiting on your approval.",
    tone: "warning",
    icon: <FileText aria-hidden />,
    onSelect: () => {},
    trailing: <Badge variant="warning">5</Badge>,
  },
  {
    id: "invite",
    label: "Invite a teammate",
    description: "Share access with a colleague.",
    tone: "primary",
    icon: <Users aria-hidden />,
    onSelect: () => {},
  },
];

export const Default: Story = {
  args: { actions, ariaLabel: "Next actions" },
};

export const StaticRows: Story = {
  args: {
    ariaLabel: "Next actions",
    actions: actions.map(({ onSelect: _onSelect, trailing: _trailing, ...rest }) => rest),
  },
};

export const AllClear: Story = {
  args: {
    ariaLabel: "Next actions",
    actions: [
      {
        id: "done",
        label: "Nothing needs your attention",
        description: "You're all caught up.",
        tone: "primary",
        icon: <CircleCheck aria-hidden />,
      },
    ],
  },
};

export const Empty: Story = {
  args: { actions: [], ariaLabel: "Next actions" },
};
