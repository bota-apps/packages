import type { ReactNode } from "react";
import type { GraphQLClient } from "@bota-apps/gql-client";
import { GraphQLContext } from "../graphqlContext";

type GraphQLProviderProps = {
  client: GraphQLClient;
  children: ReactNode;
};

export function GraphQLProvider({ client, children }: GraphQLProviderProps) {
  return <GraphQLContext.Provider value={client}>{children}</GraphQLContext.Provider>;
}
