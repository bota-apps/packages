// @bota-apps/hooks — the generic data layer shared by every authenticated app:
// the configured React Query client, the GraphQL client context, and the
// query/mutation pipeline wrappers. Domain-specific hooks (useProjects, etc.)
// are NOT here — each app owns those in its own src/api/<domain>, built on these.
export * from "./queryClient";
export * from "./graphqlContext";
export * from "./useQueryPipeline";
export * from "./useMutationPipeline";
export * from "./usePaginatedQueryPipeline";
export * from "./useGqlOperations";
export * from "./react/queryProvider";
export * from "./react/graphqlProvider";
