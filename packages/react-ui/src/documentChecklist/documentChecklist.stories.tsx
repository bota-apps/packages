import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { DocumentChecklist, type DocumentChecklistItem } from "./index";

const meta: Meta<typeof DocumentChecklist> = {
  title: "Display/DocumentChecklist",
  component: DocumentChecklist,
};
export default meta;

type Story = StoryObj<typeof DocumentChecklist>;

const items: DocumentChecklistItem[] = [
  {
    id: "identity",
    label: "Identity document",
    description: "A government-issued photo ID.",
    status: "provided",
    required: true,
    meta: "identity.pdf · uploaded 12 Mar",
  },
  {
    id: "address",
    label: "Proof of address",
    description: "Dated within the last three months.",
    status: "expired",
    required: true,
    meta: "address.pdf · issued 4 Nov",
  },
  {
    id: "agreement",
    label: "Signed agreement",
    status: "pending",
    required: true,
    meta: "Awaiting countersignature",
  },
  {
    id: "statement",
    label: "Supporting statement",
    description: "Optional context for the review team.",
    status: "missing",
    required: false,
  },
];

export const Default: Story = {
  args: { ariaLabel: "Document checklist", items },
};

export const AllProvided: Story = {
  args: {
    ariaLabel: "Document checklist",
    items: items.map((item) => ({ ...item, status: "provided" })),
  },
};

export const WithActions: Story = {
  args: {
    ariaLabel: "Document checklist",
    items: items.map((item) => ({
      ...item,
      onSelect: () => {},
      action:
        item.status === "provided" ? (
          <Button variant="ghost" size="sm">
            View
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            Upload
          </Button>
        ),
    })),
  },
};

export const RequiredVsOptional: Story = {
  args: {
    ariaLabel: "Document checklist",
    items: [
      { id: "a", label: "Identity document", status: "provided", required: true },
      { id: "b", label: "Proof of address", status: "missing", required: true },
      { id: "c", label: "Supporting statement", status: "missing", required: false },
      { id: "d", label: "Additional reference", status: "provided", required: false },
    ],
  },
};

export const Empty: Story = {
  args: { ariaLabel: "Document checklist", items: [] },
};

export const NarrowContainer: Story = {
  args: { ariaLabel: "Document checklist", items },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DocumentChecklist {...args} />
    </div>
  ),
};
