import { createRouter, type AnyRoute, type RouterHistory } from "@tanstack/react-router";
import { NotFound } from "./notFound";
import { RouteError } from "./routeError";

/**
 * The shared router factory for host apps — owns the router options every host
 * must agree on (preload behavior and the app-wide error/404 surfaces), so a
 * new app can't drift on them by accident. An app's `src/router.ts` keeps only
 * its generated route tree and a thin wrapper:
 *
 *   export const createAppRouter = (history?: RouterHistory) =>
 *     createHostRouter(routeTree, history);
 *   export const router = createAppRouter();
 *
 * Page tests build through the same wrapper with an in-memory history, so the
 * options tests exercise are exactly the options production runs with. Generic
 * over the route tree, so `typeof router` still carries the app's route types
 * into its `Register` declaration.
 */
export function createHostRouter<TRouteTree extends AnyRoute>(
  routeTree: TRouteTree,
  history?: RouterHistory,
) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    // The real values are provided at runtime by createAppRoot's
    // <RouterProvider context={...} />.
    context: undefined!,
    // NotFound's props are all-optional; wrap it so its weak type doesn't
    // clash with the router's NotFoundRouteProps.
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: RouteError,
  });
}
