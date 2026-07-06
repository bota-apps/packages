import { useMemo } from "react";
import { useMatches } from "@tanstack/react-router";
import { toRoutePath } from "../routeLink";
import type { BreadcrumbItem } from "./types";

type StaticDataWithBreadcrumb = {
  breadcrumb: string;
};

function hasStaticBreadcrumb(data: unknown): data is StaticDataWithBreadcrumb {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!("breadcrumb" in data)) {
    return false;
  }
  return typeof data.breadcrumb === "string";
}

// Loader data may carry a dynamic label (e.g. the entity's name) under
// `breadcrumbLabel`; it wins over the route's static key.
function readBreadcrumbLabel(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }
  if (!("breadcrumbLabel" in data)) {
    return undefined;
  }
  return typeof data.breadcrumbLabel === "string" ? data.breadcrumbLabel : undefined;
}

/**
 * Builds the crumb trail from the active route matches: every match whose
 * `staticData.breadcrumb` is set contributes a crumb. The static value is a
 * label key passed through `translate` (defaults to using the key as the
 * label — inject an i18n `t` to localize); `loaderData.breadcrumbLabel`
 * overrides it for dynamic labels. The last crumb loses its link.
 */
export function useBreadcrumbItems(translate?: (key: string) => string): BreadcrumbItem[] {
  const matches = useMatches();

  return useMemo(() => {
    const result: BreadcrumbItem[] = [];

    for (const match of matches) {
      if (!hasStaticBreadcrumb(match.staticData)) {
        continue;
      }

      const staticKey = match.staticData.breadcrumb;
      const dynamicLabel = readBreadcrumbLabel(match.loaderData);

      result.push({
        label: dynamicLabel ?? (translate ? translate(staticKey) : staticKey),
        // match.pathname is the resolved pathname of an ACTIVE route match, so
        // it is a registered route at runtime — the sanctioned boundary.
        to: toRoutePath(match.pathname),
      });
    }

    if (result.length <= 1) {
      return result;
    }

    result[result.length - 1] = { ...result[result.length - 1], to: undefined };

    return result;
  }, [matches, translate]);
}
