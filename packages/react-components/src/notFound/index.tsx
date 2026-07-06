import { FileQuestion } from "lucide-react";
import { PageContainer } from "../pageContainer";
import { RouteLink, toRoutePath } from "../routeLink";

export type NotFoundProps = {
  title?: string;
  description?: string;
  /** Where the escape link points (default "/"). */
  homeTo?: string;
  homeLabel?: string;
};

/** The app-wide 404 page — wire it as the router's `defaultNotFoundComponent`. */
export function NotFound({
  title = "404 — Not Found",
  description = "The page or resource you're looking for doesn't exist or has been moved.",
  homeTo = "/",
  homeLabel = "Go Home",
}: NotFoundProps = {}) {
  return (
    <PageContainer
      title="Not Found"
      showHeaderWhen="ready-only"
      state={{
        kind: "error",
        icon: <FileQuestion />,
        title,
        description,
        actions: (
          <RouteLink
            variant="text"
            to={toRoutePath(homeTo)}
            icon={FileQuestion}
            label={homeLabel}
          />
        ),
      }}
    />
  );
}
