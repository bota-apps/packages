/**
 * ActionCenter — a "next actions" panel: a prioritized list of things a user
 * could do next, each with an icon, a label, optional supporting copy, and an
 * urgency tone. Generalizes the app-local next-steps panels across products.
 *
 * Router-neutral by design: an action carries an `onSelect` callback (rendered
 * as a keyboard-operable button) or nothing (a static row), plus an optional
 * `trailing` slot. Routing lives one layer up — the react-components
 * RouteActionCenter composes these same item variants with real links. The
 * `actionCenterItemVariants`/`actionCenterIconVariants` recipes are the shared
 * styling source of truth for both.
 */
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Div, Li, Span, Ul } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  actionCenterIconVariants,
  actionCenterItemVariants,
  actionCenterVariants,
  type ActionCenterTone,
} from "./variants";

export * from "./variants";

export type ActionCenterAction = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Urgency tint on the icon chip. Defaults to `default`. */
  tone?: ActionCenterTone;
  /** When provided, the action becomes a keyboard-operable button. */
  onSelect?: () => void;
  /** Trailing content (a count badge, custom node). Overrides the chevron. */
  trailing?: ReactNode;
};

export type ActionCenterProps = {
  actions: readonly ActionCenterAction[];
  ariaLabel?: string;
  /** Shown when there are no actions. Defaults to a quiet English message. */
  emptyState?: ReactNode;
};

function ActionBody({ action }: { action: ActionCenterAction }) {
  const interactive = action.onSelect !== undefined;
  return (
    <>
      {action.icon !== undefined && (
        <Span className={cn(actionCenterIconVariants({ tone: action.tone ?? "default" }))}>
          {action.icon}
        </Span>
      )}
      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text
          as="span"
          size="sm"
          weight="medium"
          tone="default"
          className={cn("min-w-0", interactive && "transition-colors group-hover:text-primary")}
        >
          {action.label}
        </Text>
        {action.description !== undefined && (
          <Text as="span" size="sm" tone="muted">
            {action.description}
          </Text>
        )}
      </Div>
      {action.trailing ??
        (interactive ? (
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-fast ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        ) : undefined)}
    </>
  );
}

export function ActionCenter({ actions, ariaLabel, emptyState }: ActionCenterProps) {
  if (actions.length === 0) {
    return (
      <Text as="p" size="sm" tone="muted">
        {emptyState ?? "No actions right now."}
      </Text>
    );
  }

  return (
    <Ul aria-label={ariaLabel} className={cn(actionCenterVariants())}>
      {actions.map((action) => (
        <Li key={action.id} className="min-w-0">
          {action.onSelect !== undefined ? (
            <button
              type="button"
              onClick={action.onSelect}
              className={cn(actionCenterItemVariants({ interactive: true }))}
            >
              <ActionBody action={action} />
            </button>
          ) : (
            <Div className={cn(actionCenterItemVariants())}>
              <ActionBody action={action} />
            </Div>
          )}
        </Li>
      ))}
    </Ul>
  );
}
