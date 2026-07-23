import { AlertTriangle } from "lucide-react";
import { PageContainer } from "../pageContainer";
import { classifyPageError } from "../pageError";
import { RouteLink, toRoutePath } from "../routeLink";

// Structurally compatible with TanStack Router's ErrorComponentProps, so it
// wires directly as `defaultErrorComponent` without depending on that type.
export type RouteErrorProps = {
  error: Error;
  title?: string;
  description?: string;
  homeTo?: string;
  homeLabel?: string;
};

/** The app-wide route error page — wire it as the router's `defaultErrorComponent`. */
export function RouteError({
  error,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or contact support.",
  homeTo = "/",
  homeLabel = "Go Home",
}: RouteErrorProps) {
  // Classify instead of echoing `error.message` — transport errors embed the
  // whole serialized response, which must never reach the page.
  const page = classifyPageError(error);
  return (
    <PageContainer
      title="Error"
      showHeaderWhen="ready-only"
      state={{
        kind: "error",
        code: page.code,
        detail: page.detail,
        icon: <AlertTriangle />,
        title: page.code === "unknown" ? title : undefined,
        description: page.safeMessage ?? (page.code === "unknown" ? description : undefined),
        actions: (
          <RouteLink
            variant="text"
            to={toRoutePath(homeTo)}
            icon={AlertTriangle}
            label={homeLabel}
          />
        ),
      }}
    />
  );
}
