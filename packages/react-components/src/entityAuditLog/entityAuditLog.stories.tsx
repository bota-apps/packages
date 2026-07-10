import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AuditEntryDetail, EntityAuditLog, type AuditEntryConstraint } from "./index";

type StoryAuditEntry = AuditEntryConstraint;

const entries: StoryAuditEntry[] = [
  {
    id: "a1",
    action: "budgetChanged",
    occurredAt: "2026-06-30T10:00:00Z",
    actor: { name: "Jane Doe", role: "Admin" },
    changes: [
      {
        field: "budget",
        label: "Base budget",
        valueType: "currency",
        before: { amount: 50_000, currency: "USD" },
        after: { amount: 60_000, currency: "USD" },
      },
      { field: "grade", label: "Grade", valueType: "enum", before: "G5", after: "G6" },
    ],
    note: "Annual review",
    source: "web",
  },
  {
    id: "a2",
    action: "updated",
    occurredAt: "2026-05-12T14:30:00Z",
    actor: { name: "John Smith", role: "Manager" },
    changes: [
      {
        field: "phone",
        label: "Phone",
        valueType: "phone",
        before: "+15551230000",
        after: "+15551232333",
      },
      { field: "email", label: "Email", before: "old@example.com", after: "new@example.com" },
      { field: "remote", label: "Remote work", valueType: "boolean", before: false, after: true },
    ],
  },
  {
    id: "a3",
    action: "created",
    occurredAt: "2026-01-05T08:00:00Z",
    actor: { name: "System" },
    changes: [],
    source: "import",
  },
];

const meta: Meta<typeof EntityAuditLog> = {
  title: "react-components/EntityAuditLog",
  component: EntityAuditLog,
};

export default meta;
type Story = StoryObj<typeof EntityAuditLog>;

function PaginatedLog() {
  const [page, setPage] = useState(1);
  return (
    <EntityAuditLog
      entries={entries}
      page={page}
      pageCount={3}
      onPageChange={setPage}
      isLoading={false}
      isError={false}
      onEntryClick={() => {}}
    />
  );
}

export const Default: Story = {
  render: () => <PaginatedLog />,
};

export const Empty: Story = {
  render: () => (
    <EntityAuditLog
      entries={[]}
      page={1}
      onPageChange={() => {}}
      isLoading={false}
      isError={false}
    />
  ),
};

export const ErrorLoading: Story = {
  render: () => (
    <EntityAuditLog
      entries={undefined}
      page={1}
      onPageChange={() => {}}
      isLoading={false}
      isError
    />
  ),
};

export const Detail: Story = {
  render: () => <AuditEntryDetail entry={entries[0]} />,
};
