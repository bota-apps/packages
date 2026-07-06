// @bota-apps/types — framework-free TypeScript contracts, zero runtime.
// Subpaths: "@bota-apps/types/fm" (feature-management shapes) and
// "@bota-apps/types/auth" (auth shapes + the SessionUser constraint).
// Domain data (users, organizations, domain entities, …) is owned by the API —
// this package only defines the framework's own contracts and the minimal
// structural CONSTRAINTS it expects on API-owned types.
export * from "./dynamicForm";
export * from "./money";
export * from "./tone";
