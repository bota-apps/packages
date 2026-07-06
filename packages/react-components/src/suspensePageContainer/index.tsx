import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "../errorBoundary";
import { PageContainer } from "../pageContainer";

export type SuspensePageContainerProps = {
  /** Feature id — forwarded to the internal PageContainer fallbacks. */
  featureId?: string;
  /** Document title shown during the loading and error fallback states. */
  fallbackTitle: string;
  variant?: "default" | "narrow" | "full";
  errorTitle?: string;
  /** Fallback error description used when the thrown value carries no message. */
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
      fallback={(error, reset) => (
        <PageContainer
          featureId={featureId}
          title={fallbackTitle}
          variant={variant}
          state={{
            kind: "error",
            title: errorTitle,
            description: error.message || errorDescription,
            onRetry: reset,
            retryLabel,
          }}
        />
      )}
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
