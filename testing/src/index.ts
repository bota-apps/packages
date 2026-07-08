// @bota-apps/testing — the page-level integration-test harness for hosts.
// Apps inject their own data/wiring (router factory, feature tree, translation
// provider, mock-backend schema, seed persona); everything else — the provider
// stack, the components, the router — runs for real. Only the auth + graphql
// clients are doubles, both from @bota-apps/mocks.
//
// Subpath entrypoints: `./setup` (jsdom environment + missing-translation
// gate, for vitest setupFiles) and `./coverage` (node-side route-catalog
// coverage guard).
export * from "./renderRoute";
export * from "./routeSmoke";
export * from "./pageMenu";
