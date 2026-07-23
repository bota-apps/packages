import { type ReactNode, useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  EmptyState,
  ErrorState,
  Inline,
  Loading,
  Page,
  PageContent,
  PageHeader,
  PageMenuActions,
  Stack,
  type PageMenuAction,
} from "@bota-apps/react-ui";
import { RefreshCw } from "lucide-react";
import { FeatureScopeProvider } from "@bota-apps/fm";
import { Breadcrumbs } from "../breadcrumbs";
import { pageStateContentVariants } from "./variants";

export * from "./variants";
export type { PageMenuAction };

/**
 * The unified page lifecycle, discriminated on `kind` — pages hand the whole
 * data situation to PageContainer instead of hand-rolling loading/error/empty
 * branches (derive it from query state with `derivePageState`).
 */
export type PageState =
  | { kind: "ready"; warning?: string }
  | { kind: "loading" }
  | {
      kind: "error";
      title?: string;
      description?: string;
      icon?: ReactNode;
      actions?: ReactNode;
      onRetry?: () => void;
      retryLabel?: string;
    }
  | {
      kind: "empty";
      title: string;
      description: string;
      icon?: ReactNode;
      action?: ReactNode;
    };

export type PageContainerProps = {
  /** Feature id — when set, the page body becomes that feature's ambient scope. */
  featureId?: string;
  /** Sets document.title only — not rendered visually. */
  title: string;
  /** Optional visual heading rendered in the page header. */
  heading?: string;
  description?: string;
  /** Metadata rendered in the header (left side, below the description). */
  headerMetadata?: ReactNode;
  /** Structured actions rendered as a dropdown in the header (right side). */
  menuActions?: PageMenuAction[];
  /** Accessible name for the menu-actions trigger (override to translate). */
  menuActionsLabel?: string;
  /** Escape hatch for non-standard header content (badges, confirm dialogs, toggles). */
  headerRight?: ReactNode;
  /** Content area width. */
  variant?: "default" | "narrow" | "wide" | "full";
  /** Page scroll model — "fixed" pins the header and scrolls only the body. */
  layout?: "flow" | "fixed";
  /** Unified page state. */
  state: PageState;
  /** Main page content — rendered when state.kind === "ready". */
  children?: ReactNode;
  /** Footer content below the main content. */
  footer?: ReactNode;
  showHeaderWhen?: "always" | "ready-only";
  showFooterWhen?: "always" | "ready-only";
};

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function PageStateContent({ children }: { children: ReactNode }) {
  return <div className={pageStateContentVariants()}>{children}</div>;
}

function PageBodyContent({ state, children }: { state: PageState; children?: ReactNode }) {
  switch (state.kind) {
    case "loading":
      return (
        <PageStateContent>
          <Loading variant="section" size="lg" />
        </PageStateContent>
      );

    case "error": {
      const retryButton = state.onRetry ? (
        <Button variant="outline" onClick={state.onRetry}>
          <Inline gap="xs">
            <RefreshCw />
            {state.retryLabel ?? "Try Again"}
          </Inline>
        </Button>
      ) : null;

      const action =
        retryButton || state.actions ? (
          <ButtonGroup>
            {retryButton}
            {state.actions}
          </ButtonGroup>
        ) : undefined;

      return (
        <PageStateContent>
          <ErrorState
            icon={state.icon}
            title={state.title ?? "Something went wrong"}
            description={state.description ?? "Please try again later"}
            action={action}
          />
        </PageStateContent>
      );
    }

    case "empty":
      return (
        <PageStateContent>
          <EmptyState
            icon={state.icon}
            title={state.title}
            description={state.description}
            action={state.action}
          />
        </PageStateContent>
      );

    case "ready":
      return (
        <>
          {state.warning ? <Alert variant="warning">{state.warning}</Alert> : null}
          {children}
        </>
      );
  }
}

/**
 * The standard authenticated-app page: document title, breadcrumb trail,
 * header (heading/description/actions), and a body driven by one `PageState`.
 */
export function PageContainer({
  featureId,
  title,
  heading,
  description,
  headerMetadata,
  menuActions,
  menuActionsLabel,
  headerRight,
  variant,
  layout = "flow",
  state,
  children,
  footer,
  showHeaderWhen = "always",
  showFooterWhen = "ready-only",
}: PageContainerProps) {
  useDocumentTitle(title);

  const shouldShowHeader = showHeaderWhen === "always" || state.kind === "ready";
  const shouldShowFooter = showFooterWhen === "always" || state.kind === "ready";

  const header = useMemo(() => {
    if (!shouldShowHeader) {
      return null;
    }

    const menuActionsNode =
      menuActions && menuActions.length > 0 ? (
        <PageMenuActions actions={menuActions} triggerLabel={menuActionsLabel} />
      ) : null;

    const resolvedAction =
      menuActionsNode && headerRight ? (
        <Inline gap="sm" align="center">
          {headerRight}
          {menuActionsNode}
        </Inline>
      ) : (
        (menuActionsNode ?? headerRight)
      );

    return (
      <Stack gap="sm">
        <Breadcrumbs />
        <PageHeader
          title={heading}
          description={description}
          metadata={headerMetadata}
          action={resolvedAction}
        />
      </Stack>
    );
  }, [
    description,
    heading,
    headerMetadata,
    headerRight,
    menuActions,
    menuActionsLabel,
    shouldShowHeader,
  ]);

  const body = (
    <>
      <PageBodyContent state={state}>{children}</PageBodyContent>
      {shouldShowFooter ? footer : null}
    </>
  );

  const page =
    layout === "fixed" ? (
      <Page layout="fixed">
        {header ? (
          <PageContent variant={variant} region="header">
            {header}
          </PageContent>
        ) : null}
        <PageContent variant={variant} region="body">
          {body}
        </PageContent>
      </Page>
    ) : (
      <Page>
        <PageContent variant={variant}>
          {header}
          {body}
        </PageContent>
      </Page>
    );

  if (featureId === undefined) {
    return page;
  }

  return <FeatureScopeProvider featureId={featureId}>{page}</FeatureScopeProvider>;
}
