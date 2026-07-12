/**
 * DocumentChecklist — a document-completeness surface: a list of required and
 * optional documents, each with a status (provided / missing / pending /
 * expired), an optional description and meta node (a filename or date), and an
 * optional trailing action. An overall worded completeness summary and an
 * optional progress bar count provided documents against the required ones.
 *
 * Presentational and router-neutral: uploading, downloading, and permission
 * checks live in the app. Items expose an `onSelect` callback (view) and/or a
 * trailing `action` node — no routing lives here. Status is never conveyed by
 * color alone: every item pairs a shape icon with a worded status label, the
 * header states completeness in words, and a clean zero-state renders when
 * there are no documents.
 */
import type { ReactNode } from "react";
import { CircleAlert, CircleCheckBig, Clock, TriangleAlert } from "lucide-react";
import { Div, Li, Span, Ul } from "../html";
import { Text } from "../html/typography";
import { Progress } from "../progress";
import { cn } from "../lib/utils";
import {
  documentChecklistIconVariants,
  documentChecklistItemVariants,
  documentChecklistVariants,
  type DocumentStatus,
} from "./variants";

export * from "./variants";

export type DocumentChecklistItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  status: DocumentStatus;
  /** Whether the document is mandatory. Defaults to `false` (optional). */
  required?: boolean;
  /** Trailing supplementary content — e.g. a filename or a date node. */
  meta?: ReactNode;
  /** When provided, the row becomes a keyboard-operable button (view). */
  onSelect?: () => void;
  /** Trailing action slot — an app-provided button or link node. */
  action?: ReactNode;
};

export type DocumentChecklistProps = {
  items: readonly DocumentChecklistItem[];
  /** Show the worded completeness summary and progress bar. Defaults to `true`. */
  showProgress?: boolean;
  ariaLabel?: string;
  /** Rendered when there are no documents. Defaults to a neutral English state. */
  emptyState?: ReactNode;
};

const statusLabels: Record<DocumentStatus, string> = {
  provided: "Provided",
  missing: "Missing",
  pending: "Pending",
  expired: "Expired",
};

function statusIcon(status: DocumentStatus): ReactNode {
  if (status === "provided") {
    return <CircleCheckBig aria-hidden />;
  }
  if (status === "pending") {
    return <Clock aria-hidden />;
  }
  if (status === "expired") {
    return <TriangleAlert aria-hidden />;
  }
  return <CircleAlert aria-hidden />;
}

function ItemBody({ item }: { item: DocumentChecklistItem }) {
  const requiredText = item.required === true ? "Required" : "Optional";
  return (
    <>
      <Span className={cn(documentChecklistIconVariants({ status: item.status }))}>
        {statusIcon(item.status)}
      </Span>
      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Div className="flex min-w-0 flex-col gap-0.5 @md:flex-row @md:items-baseline @md:gap-2">
          <Text as="span" size="sm" weight="medium" tone="default" className="min-w-0">
            {item.label}
          </Text>
          <Text as="span" size="sm" tone="muted" className="@md:shrink-0">
            {`${requiredText} · ${statusLabels[item.status]}`}
          </Text>
        </Div>
        {item.description !== undefined && (
          <Text as="span" size="sm" tone="muted">
            {item.description}
          </Text>
        )}
        {item.meta !== undefined && (
          <Text as="span" size="sm" tone="muted">
            {item.meta}
          </Text>
        )}
      </Div>
      {item.action !== undefined && <Span className="shrink-0">{item.action}</Span>}
    </>
  );
}

function ItemRow({ item }: { item: DocumentChecklistItem }) {
  if (item.onSelect !== undefined) {
    const onSelect = item.onSelect;
    return (
      <button
        type="button"
        onClick={() => onSelect()}
        className={cn(documentChecklistItemVariants({ interactive: true }))}
      >
        <ItemBody item={item} />
      </button>
    );
  }
  return (
    <Div className={cn(documentChecklistItemVariants())}>
      <ItemBody item={item} />
    </Div>
  );
}

export function DocumentChecklist({
  items,
  showProgress = true,
  ariaLabel,
  emptyState,
}: DocumentChecklistProps) {
  const requiredItems = items.filter((item) => item.required === true);
  const counted = requiredItems.length > 0 ? requiredItems : items;
  const total = counted.length;
  const providedCount = counted.filter((item) => item.status === "provided").length;
  const pct = total > 0 ? Math.round((providedCount / total) * 100) : undefined;

  if (items.length === 0) {
    return (
      <Div className={cn(documentChecklistVariants())} aria-label={ariaLabel} role="group">
        <Text as="span" size="sm" tone="muted">
          {emptyState ?? "No documents required."}
        </Text>
      </Div>
    );
  }

  return (
    <Div className={cn(documentChecklistVariants())} aria-label={ariaLabel} role="group">
      {showProgress && pct !== undefined && (
        <Div className="flex flex-col gap-2">
          <Text as="span" size="sm" tone="muted">
            {`${providedCount} of ${total} provided`}
          </Text>
          <Progress value={pct} />
        </Div>
      )}

      <Ul className="flex flex-col">
        {items.map((item) => (
          <Li key={item.id}>
            <ItemRow item={item} />
          </Li>
        ))}
      </Ul>
    </Div>
  );
}
