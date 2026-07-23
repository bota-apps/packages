import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "../errorBoundary";
import { PageContainer } from "../pageContainer";
import { classifyPageError } from "../pageError";

export type SuspensePageContainerProps = {
  /** Feature id — forwarded to the internal PageContainer fallbacks. */
  featureId?: string;
  /** Document title shown during the loading and error fallback states. */
  fallbackTitle: string;
  variant?: "default" | "narrow" | "full";
  /** Copy for unclassifiable failures — classified ones use the app's per-code copy. */
  errorTitle?: string;
  errorDescription?: string;
  retryLabel?: string;
  /** Children include their own PageContainer with data-driven props. */
  children: ReactNode;
};

/**
 * Suspense + error boundary wrapper for pages whose data loads via suspending
 * queries: while loading it renders a loading PageContainer, and a render
 * error becomes an error PageContainer with a retry that resets the boundary.
 */
export function SuspensePageContainer({
  featureId,
  fallbackTitle,
  variant,
  errorTitle = "Something went wrong",
  errorDescription = "Please try again later",
  retryLabel = "Try Again",
  children,
}: SuspensePageContainerProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => {
        // Classify instead of echoing `error.message` — transport errors embed
        // the whole serialized response, which must never reach the page.
        const page = classifyPageError(error);
        return (
          <PageContainer
            featureId={featureId}
            title={fallbackTitle}
            variant={variant}
            state={{
              kind: "error",
              code: page.code,
              detail: page.detail,
              title: page.code === "unknown" ? errorTitle : undefined,
              description:
                page.safeMessage ?? (page.code === "unknown" ? errorDescription : undefined),
              onRetry: reset,
              retryLabel,
            }}
          />
        );
      }}
    >
      <Suspense
        fallback={
          <PageContainer
            featureId={featureId}
            title={fallbackTitle}
            variant={variant}
            state={{ kind: "loading" }}
          />
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
