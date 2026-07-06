import { RouterProvider, type AnyRouter } from "@tanstack/react-router";
import { GraphQLProvider, QueryProvider, queryClient } from "@bota-apps/hooks";
import { AuthProvider, type AuthClient } from "@bota-apps/auth-client";
import { FeatureProvider, FeatureScopeProvider, type FeatureRegistry } from "@bota-apps/fm";
import type { GraphQLClient } from "@bota-apps/gql-client";
import { AppearanceProvider, type AppearanceConfig } from "./appearanceProvider";
import { ErrorBoundary } from "./errorBoundary";
import { Toasts } from "./toast";

type AppRootConfig = {
  authClient: AuthClient;
  graphqlClient: GraphQLClient;
  /** The app's own typed router (from src/router.tsx). */
  router: AnyRouter;
  /** The app's resolved feature tree (from src/appFeatures.ts). */
  featureRegistry: FeatureRegistry;
  /** Appearance setup (brands the app ships CSS for, defaults, storage key). */
  appearance?: AppearanceConfig;
};

/**
 * The shared provider stack for authenticated apps. Every app composes the same
 * tree; the only per-app inputs are its client, router, and feature registry:
 *
 *   ErrorBoundary
 *     FeatureProvider          (resolves the tree)
 *       FeatureScopeProvider   (app scope — the ambient current scope is never empty)
 *         QueryProvider
 *           GraphQLProvider    (cookie-credentialed graphql-request client)
 *             AuthProvider     (session bootstrap via the auth client)
 *               AppearanceProvider (mode / brand / shell layout)
 *                 RouterProvider (+ context: auth, queryClient) + Toasts
 */
export function createAppRoot({
  authClient,
  graphqlClient,
  router,
  featureRegistry,
  appearance,
}: AppRootConfig) {
  function AppRoot() {
    return (
      <ErrorBoundary>
        <FeatureProvider registry={featureRegistry}>
          <FeatureScopeProvider featureId={featureRegistry.tree.id}>
            <QueryProvider>
              <GraphQLProvider client={graphqlClient}>
                <AuthProvider client={authClient}>
                  <AppearanceProvider {...appearance}>
                    <RouterProvider router={router} context={{ auth: authClient, queryClient }} />
                    <Toasts />
                  </AppearanceProvider>
                </AuthProvider>
              </GraphQLProvider>
            </QueryProvider>
          </FeatureScopeProvider>
        </FeatureProvider>
      </ErrorBoundary>
    );
  }

  return { AppRoot };
}
