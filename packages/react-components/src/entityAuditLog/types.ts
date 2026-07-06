import type { BadgeVariant } from "@bota-apps/react-ui";

/**
 * Minimal structural CONSTRAINTS for what the audit renderers read — the full
 * audit types are API-owned; apps pass their own entry type and get it back
 * from `onEntryClick`. Every field the API might type more precisely
 * (`valueType`, `before`/`after`, `actor.role`) is loose here on purpose.
 */
export type AuditChangeConstraint = {
  field: string;
  label: string;
  /** Presentation hint — known kinds ("currency", "number", "phone", "date", "boolean", "enum") render richly; anything else renders as text. */
  valueType?: string;
  before?: unknown;
  after?: unknown;
};

export type AuditEntryConstraint = {
  id: string;
  action: string;
  /** ISO timestamp. */
  occurredAt: string;
  // Nullable fields accept `null` (not just `undefined`) so GraphQL-sourced rows
  // pass straight through — the renderers already treat null/undefined as absent.
  actor: { name: string; role?: string | null };
  changes: readonly AuditChangeConstraint[];
  note?: string | null;
  source?: string | null;
};

export type AuditActionPresentation = {
  label: string;
  variant: BadgeVariant;
};

/** Maps an API action code to its display label + badge tone. */
export type FormatAuditAction = (action: string) => AuditActionPresentation;

// Sensible tones for the generic audit verbs; unknown actions read as neutral.
const defaultVariants: Record<string, BadgeVariant> = {
  created: "success",
  updated: "secondary",
  deleted: "destructive",
  statusChanged: "secondary",
  approved: "success",
  rejected: "destructive",
  submitted: "default",
  finalized: "success",
  restored: "warning",
};

// "statusChanged" → "Status Changed"
function humanize(action: string): string {
  const spaced = action.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replaceAll(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** English defaults for the common audit verbs — override via `formatAction`. */
export const defaultFormatAuditAction: FormatAuditAction = (action) => ({
  label: humanize(action),
  variant: defaultVariants[action] ?? "secondary",
});
