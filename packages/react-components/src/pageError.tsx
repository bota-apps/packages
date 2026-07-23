import { createContext, useContext, type ReactNode } from "react";
import { classifyError } from "@bota-apps/fm";

/* ------------------------------------------------------------------ */
/* Page error taxonomy                                                 */
/* ------------------------------------------------------------------ */

/**
 * UI-facing failure class for page-level error states. Derived from the fm
 * error taxonomy (`classifyError`) — this is the presentation projection:
 * what the page should SAY and OFFER, not what telemetry should record.
 */
export type PageErrorCode =
  "unauthenticated" | "forbidden" | "not-found" | "network" | "server" | "unknown";

export type PageError = {
  code: PageErrorCode;
  /**
   * A message safe to show instead of the generic copy — only set for
   * validation/business failures, whose messages are written for users.
   * Transport/authorization messages stay out of the UI (they are not
   * localized and may leak internals).
   */
  safeMessage?: string;
  /**
   * Full technical detail for diagnostics and issue reports — never rendered
   * on the page.
   */
  detail: string;
};

const graphqlCodeMap: Record<string, PageErrorCode> = {
  FORBIDDEN: "forbidden",
  UNAUTHENTICATED: "unauthenticated",
  UNAUTHORIZED: "unauthenticated",
  NOT_FOUND: "not-found",
  INTERNAL_SERVER_ERROR: "server",
};

function fromStatus(status: number): PageErrorCode {
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status >= 500) return "server";
  return "unknown";
}

/** Map any thrown value to its page-level presentation class. */
export function classifyPageError(raw: unknown): PageError {
  const classified = classifyError(raw);
  const detail = raw instanceof Error ? raw.message : String(raw);

  switch (classified.kind) {
    case "auth":
      return { code: "unauthenticated", detail };
    case "network":
      return { code: "network", detail };
    case "graphql":
      return { code: graphqlCodeMap[classified.error.code ?? ""] ?? "unknown", detail };
    case "api":
      return { code: fromStatus(classified.error.status), detail };
    case "validation":
    case "business":
      return { code: "unknown", safeMessage: classified.error.message, detail };
    case "unexpected":
      return { code: "unknown", detail };
  }
}

/**
 * Whether retrying can plausibly change the outcome. Authorization and
 * missing-content failures re-fail identically — offering "Try again" there
 * teaches users the button is decorative.
 */
export function isRetryablePageError(code: PageErrorCode): boolean {
  return code === "network" || code === "server" || code === "unknown";
}

export type PageErrorCopy = { title: string; description: string };

/** Neutral fallback copy — apps localize via PageErrorProvider `copy`. */
export const defaultPageErrorCopy: Record<PageErrorCode, PageErrorCopy> = {
  unauthenticated: {
    title: "Your session has ended",
    description: "Sign in again to continue.",
  },
  forbidden: {
    title: "You don't have access to this page",
    description: "Your account doesn't have permission to view this content.",
  },
  "not-found": {
    title: "Not found",
    description: "This content doesn't exist or is no longer available.",
  },
  network: {
    title: "Connection problem",
    description: "We couldn't reach the server. Check your connection and try again.",
  },
  server: {
    title: "Something went wrong on our side",
    description: "Please try again in a moment.",
  },
  unknown: {
    title: "Something went wrong",
    description: "Please try again later",
  },
};

/* ------------------------------------------------------------------ */
/* App-level error presentation policy                                 */
/* ------------------------------------------------------------------ */

export type PageErrorActionContext = {
  code: PageErrorCode;
  /** Technical detail from the failure — attach to reports, never render. */
  detail?: string;
};

export type PageErrorConfig = {
  /**
   * Extra call-to-actions appended to every page error state, chosen by
   * failure class — e.g. a report-an-issue button (attach `detail` as the
   * report payload), or sign-out/switch-workspace for authorization failures.
   * Defined once at the app root; every PageContainer picks it up.
   */
  renderActions?: (context: PageErrorActionContext) => ReactNode;
  /** Localized copy per failure class, overriding the neutral defaults. */
  copy?: Partial<Record<PageErrorCode, PageErrorCopy>>;
};

const PageErrorContext = createContext<PageErrorConfig>({});

/**
 * App-level policy for page error states: localized copy and per-class
 * call-to-actions. Optional — without it, PageContainer falls back to the
 * neutral defaults and offers retry only for retryable classes.
 */
export function PageErrorProvider({
  children,
  ...config
}: PageErrorConfig & { children: ReactNode }) {
  return <PageErrorContext.Provider value={config}>{children}</PageErrorContext.Provider>;
}

export function usePageErrorConfig(): PageErrorConfig {
  return useContext(PageErrorContext);
}
