// @bota-apps/app-config — standardized runtime env for @bota-apps apps. Owns the
// Vite env resolver (`createViteAppConfig`) and the base schema every
// GraphQL-backed host shares (`graphqlAppEnv`). Config lives here, not in
// schema-utils, so the schema runtime stays focused on form/detail contracts.
export * from "./viteConfig";
export * from "./env";
export * from "./sessionPaths";
