// Shared story/test fixture: a generic invented host app ("Workbench") with
// Projects / Reports / Settings modules. Not part of the published package —
// excluded from the build alongside stories and tests.
import { BarChart3, FolderKanban, Settings } from "lucide-react";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import type { Issue } from "./types";

export const sampleFeatureTree: FeatureNodeDef = {
  id: "workbench",
  label: "Workbench",
  target: "app",
  children: [
    {
      id: "projects",
      label: "Projects",
      description: "Plan and track project work",
      target: "module",
      meta: { icon: FolderKanban },
      children: [
        {
          id: "projects.list",
          label: "Project list",
          description: "Browse and filter every project",
          target: "page",
        },
        {
          id: "projects.create",
          label: "Create project",
          description: "Start a new project from scratch or a template",
          target: "action",
        },
        {
          id: "projects.archive",
          label: "Archive",
          target: "page",
          children: [{ id: "projects.archive.restore", label: "Restore", target: "action" }],
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      target: "module",
      meta: { icon: BarChart3 },
      children: [
        { id: "reports.usage", label: "Usage report", target: "page" },
        // Deliberately label-less and icon-less: exercises the id fallback.
        { id: "reports.export", target: "action" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      target: "module",
      meta: { icon: Settings },
      children: [{ id: "settings.members", label: "Members", target: "page" }],
    },
  ],
};

const labelById = new Map<string, string>();
function indexLabels(node: FeatureNodeDef): void {
  labelById.set(node.id, node.label ?? node.id);
  for (const child of node.children ?? []) {
    indexLabels(child);
  }
}
indexLabels(sampleFeatureTree);

/** Story-side `featureLabel` implementation backed by the sample tree. */
export function sampleFeatureLabel(featureId: string): string {
  return labelById.get(featureId) ?? featureId;
}

export function placeholderImage(background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="${background}"/><circle cx="60" cy="50" r="18" fill="white" opacity="0.7"/><rect x="30" y="80" width="100" height="10" rx="5" fill="white" opacity="0.7"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const sampleIssues: Issue[] = [
  {
    id: "issue-1",
    featureId: "projects.create",
    description:
      "The create button stays disabled after fixing the validation errors, so the form can never be submitted.",
    reproSteps: "1. Open create project\n2. Submit with an empty name\n3. Fill in the name",
    status: "IN_PROGRESS",
    createdAt: "2026-07-01T09:30:00Z",
    updatedAt: "2026-07-02T10:00:00Z",
    screenshots: [
      {
        id: "shot-1",
        fileName: "create-form.png",
        url: placeholderImage("#64748b"),
        contentType: "image/png",
        sizeBytes: 48_213,
      },
      { id: "shot-2", fileName: "console-output.png", contentType: "image/png" },
    ],
    contactName: "Alex Doe",
    contactEmail: "alex@example.com",
  },
  {
    id: "issue-2",
    featureId: "reports.usage",
    description: "The usage report shows last month's totals under this month's heading.",
    status: "open",
    createdAt: "2026-07-10T14:05:00Z",
  },
  {
    id: "issue-3",
    featureId: "settings.members",
    description: "Removing a member leaves their avatar in the list until a full page reload.",
    status: "resolved",
    createdAt: "2026-06-20T08:15:00Z",
    updatedAt: "2026-06-28T16:40:00Z",
    screenshots: [
      {
        id: "shot-3",
        fileName: "members-list.png",
        url: placeholderImage("#0d9488"),
        contentType: "image/png",
      },
    ],
  },
];
