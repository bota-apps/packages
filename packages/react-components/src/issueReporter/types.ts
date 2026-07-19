import type { BadgeVariant } from "@bota-apps/react-ui";

/**
 * Shared structural types for the issue-reporting components (IssueReporter,
 * IssueList, IssueDetails). The components are deliberately dumb: they know
 * nothing about endpoints, transports, auth, or storage — everything
 * environment-specific arrives through props typed here.
 */

/** Everything the host needs to persist a new issue — transport-agnostic. */
export type CreateIssuePayload = {
  /** Id of the feature-tree node the issue is anchored to. */
  featureId: string;
  description: string;
  reproSteps?: string;
  /** Raw browser files — uploading/storage is the host's concern. */
  screenshots: readonly File[];
  contactName?: string;
  contactEmail?: string;
};

/** A stored screenshot as the host references it (already uploaded). */
export type IssueScreenshotRef = {
  id: string;
  fileName: string;
  /** Host-resolved download/view URL; without it only a name chip renders. */
  url?: string;
  contentType?: string;
  sizeBytes?: number;
};

/**
 * Minimal structural constraint for a stored issue. The full issue type is
 * API-owned: hosts pass their richer type and receive the same type back from
 * callbacks. Nullable fields accept `null` (not just `undefined`) so
 * GraphQL-sourced rows pass straight through.
 */
export type Issue = {
  id: string;
  featureId: string;
  description: string;
  reproSteps?: string | null;
  /** Raw status code (e.g. an API enum value); presentation is mapped separately. */
  status: string;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  screenshots?: readonly IssueScreenshotRef[] | null;
  contactName?: string | null;
  contactEmail?: string | null;
};

/** Display label + badge tone for one raw status code. */
export type IssueStatusAppearance = {
  label: string;
  variant: BadgeVariant;
};

// "IN_PROGRESS", "in-progress", and "inProgress" all normalize to "inprogress".
function normalizeStatus(status: string): string {
  return status.toLowerCase().replaceAll(/[\s_-]+/g, "");
}

// "NEEDS_INFO" / "needsInfo" → "Needs info".
function humanizeStatus(status: string): string {
  const spaced = status
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  if (spaced.length === 0) {
    return status;
  }
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const wellKnownStatuses: Record<string, IssueStatusAppearance> = {
  open: { label: "Open", variant: "default" },
  inprogress: { label: "In progress", variant: "warning" },
  resolved: { label: "Resolved", variant: "success" },
  closed: { label: "Closed", variant: "muted" },
};

/**
 * Fallback status presentation used by IssueList/IssueDetails when the host
 * provides no `statusAppearance` entry for a status. Recognizes the common
 * lifecycle statuses in any casing convention; anything else renders as a
 * humanized label with a neutral tone.
 */
export function defaultIssueStatusAppearance(status: string): IssueStatusAppearance {
  return (
    wellKnownStatuses[normalizeStatus(status)] ?? {
      label: humanizeStatus(status),
      variant: "secondary",
    }
  );
}

/** `<DateTime>` takes ISO strings; issue rows may carry strings or Dates. */
export function issueDateValue(value: string | Date): string {
  return typeof value === "string" ? value : value.toISOString();
}
