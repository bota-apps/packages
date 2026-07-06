import { describe, expect, it, vi } from "vitest";
import { buildSchema } from "graphql";
import { gql } from "graphql-request";
import { createMockGraphQLClient } from "./createGraphQlClient";

const schema = buildSchema(`
  type Department { id: ID!, name: String! }
  type Query { department(id: ID!): Department }
`);

const root = {
  department: ({ id }: { id: string }) => (id === "d1" ? { id: "d1", name: "Engineering" } : null),
};

describe("createMockGraphQLClient", () => {
  it("executes real operations against the provided schema", async () => {
    const client = createMockGraphQLClient({ schema, rootValue: root });
    const data = await client.request<{ department: { name: string } | null }>(
      gql`
        query ($id: ID!) {
          department(id: $id) {
            id
            name
          }
        }
      `,
      { id: "d1" },
    );
    expect(data.department?.name).toBe("Engineering");
  });

  it("is a real GraphQLClient — the hooks' rawRequest path works and returns null misses", async () => {
    const client = createMockGraphQLClient({ schema, rootValue: root });
    const { data } = await client.rawRequest<{ department: null }>(
      gql`
        query ($id: ID!) {
          department(id: $id) {
            id
          }
        }
      `,
      { id: "missing" },
    );
    expect(data.department).toBeNull();
  });

  it("contextValue factory runs per request", async () => {
    const contextValue = vi.fn(() => ({}));
    const client = createMockGraphQLClient({ schema, rootValue: root, contextValue });
    await client.request(gql`
      {
        department(id: "d1") {
          id
        }
      }
    `);
    expect(contextValue).toHaveBeenCalledTimes(1);
  });

  it("overrides replace a member on the real client instance", async () => {
    const boom = new Error("network down");
    const client = createMockGraphQLClient({
      schema,
      rootValue: root,
      overrides: { request: () => Promise.reject(boom) },
    });
    await expect(
      client.request(gql`
        {
          department(id: "d1") {
            id
          }
        }
      `),
    ).rejects.toBe(boom);
  });
});
