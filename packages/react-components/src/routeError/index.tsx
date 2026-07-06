import { AlertTriangle } from "lucide-react";
import { PageContainer } from "../pageContainer";
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
  return (
    <PageContainer
      title="Error"
      showHeaderWhen="ready-only"
      state={{
        kind: "error",
        icon: <AlertTriangle />,
        title,
        description: error.message || description,
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
