import { createContext, useContext } from "react";
import type { GraphQLClient } from "@bota-apps/gql-client";

export const GraphQLContext = createContext<GraphQLClient | undefined>(undefined);

export function useGraphQLClient(): GraphQLClient {
  const client = useContext(GraphQLContext);
  if (!client) {
    throw new Error("useGraphQLClient must be used within a GraphQLProvider");
  }
  return client;
}
