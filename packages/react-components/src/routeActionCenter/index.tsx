/**
 * RouteActionCenter — the router-aware sibling of react-ui's ActionCenter: a
 * prioritized "next actions" list where each action navigates via a typed
 * route instead of firing a callback. Each row is a TanStack Router <Link>
 * styled with the shared `actionCenterItemVariants` / `actionCenterIconVariants`
 * recipes, so it is visually identical to ActionCenter (icon chip + label /
 * description + trailing chevron, group-hover label tint, shared focus ring)
 * while staying keyboard-operable and honoring the router's active state.
 *
 * Routing is the only thing this layer adds — the visuals are owned by
 * react-ui; this composes them, it never re-rolls them.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Div,
  Li,
  Span,
  Text,
  Ul,
  actionCenterIconVariants,
  actionCenterItemVariants,
  actionCenterVariants,
  cn,
  type ActionCenterTone,
} from "@bota-apps/react-ui";
import type { RoutePath } from "../routeLink";

export type RouteAction = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Urgency tint on the icon chip. Defaults to `default`. */
  tone?: ActionCenterTone;
  /** Typed route target — navigated to on select, matching Link's `to`. */
  to: RoutePath;
  /** Trailing content (a count badge, custom node). Overrides the chevron. */
  trailing?: ReactNode;
};

export type RouteActionCenterProps = {
  actions: readonly RouteAction[];
  ariaLabel?: string;
  /** Shown when there are no actions. Defaults to a quiet English message. */
  emptyState?: ReactNode;
};

function ActionBody({ action }: { action: RouteAction }) {
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
          className="min-w-0 transition-colors group-hover:text-primary"
        >
          {action.label}
        </Text>
        {action.description !== undefined && (
          <Text as="span" size="sm" tone="muted">
            {action.description}
          </Text>
        )}
      </Div>
      {action.trailing ?? (
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-fast ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  );
}

export function RouteActionCenter({ actions, ariaLabel, emptyState }: RouteActionCenterProps) {
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
          <Link
            to={action.to}
            className={cn(actionCenterItemVariants({ interactive: true }))}
            activeProps={{ className: "bg-selected text-selected-foreground" }}
          >
            <ActionBody action={action} />
          </Link>
        </Li>
      ))}
    </Ul>
  );
}
