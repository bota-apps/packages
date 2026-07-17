import { describe, expect, it, vi } from "vitest";
import { buildSchema, GraphQLError, type ExecutionResult } from "graphql";
import { gql } from "graphql-request";
import { createMockGraphQLClient } from "./createGraphQlClient";

const schema = buildSchema(`
  type Department { id: ID!, name: String! }
  type Query { department(id: ID!): Department }
  type Subscription { ticks(count: Int!): Int!, restricted: Int! }
`);

async function* tickSource({ count }: { count: number }) {
  for (let tick = 1; tick <= count; tick += 1) {
    yield { ticks: tick };
  }
}

const root = {
  department: ({ id }: { id: string }) => (id === "d1" ? { id: "d1", name: "Engineering" } : null),
  ticks: tickSource,
  restricted: () => {
    throw new Error("not allowed");
  },
};

async function collect<T>(events: AsyncGenerator<ExecutionResult<T>>): Promise<T[]> {
  const data: T[] = [];
  for await (const result of events) {
    if (result.data !== undefined && result.data !== null) {
      data.push(result.data);
    }
  }
  return data;
}

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

  it("subscribe streams each pushed result against the schema's subscription resolvers", async () => {
    const client = createMockGraphQLClient({ schema, rootValue: root });
    const data = await collect(
      client.subscribe<{ ticks: number }>({
        query: "subscription ($count: Int!) { ticks(count: $count) }",
        variables: { count: 3 },
      }),
    );
    expect(data.map((payload) => payload.ticks)).toEqual([1, 2, 3]);
  });

  it("subscribe-time failure arrives as one error result, then completion (SSE shape)", async () => {
    const client = createMockGraphQLClient({ schema, rootValue: root });
    const events = client.subscribe({ query: "subscription { restricted }" });
    const first = await events.next();
    if (first.done) {
      throw new Error("expected an error result before completion");
    }
    expect(first.value.errors?.[0]?.message).toContain("not allowed");
    expect((await events.next()).done).toBe(true);
  });

  it("aborting the signal rejects the pending read, like the network transport", async () => {
    const client = createMockGraphQLClient({
      schema,
      rootValue: {
        ...root,
        // One value, then a source that never pushes again.
        ticks: async function* stalled() {
          yield { ticks: 1 };
          await new Promise(() => undefined);
        },
      },
    });
    const controller = new AbortController();
    const events = client.subscribe<{ ticks: number }>({
      query: "subscription { ticks(count: 1) }",
      signal: controller.signal,
    });
    const first = await events.next();
    if (first.done) {
      throw new Error("expected the first pushed result");
    }
    expect(first.value.data?.ticks).toBe(1);

    const pending = events.next();
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });

  it("an already-aborted signal fails fast without executing", async () => {
    const client = createMockGraphQLClient({ schema, rootValue: root });
    const controller = new AbortController();
    controller.abort();
    const events = client.subscribe({
      query: "subscription { ticks(count: 1) }",
      signal: controller.signal,
    });
    await expect(events.next()).rejects.toMatchObject({ name: "AbortError" });
  });

  it("contextValue factory runs once per subscription", async () => {
    const contextValue = vi.fn(() => ({}));
    const client = createMockGraphQLClient({ schema, rootValue: root, contextValue });
    await collect(client.subscribe({ query: "subscription { ticks(count: 2) }" }));
    expect(contextValue).toHaveBeenCalledTimes(1);
  });

  it("overrides can script the subscribe stream", async () => {
    const client = createMockGraphQLClient({
      schema,
      rootValue: root,
      overrides: {
        subscribe: async function* scripted<TData>(): AsyncGenerator<
          ExecutionResult<TData>,
          void,
          undefined
        > {
          yield { errors: [new GraphQLError("scripted stream")] };
        },
      },
    });
    const events = client.subscribe({ query: "subscription { ticks(count: 9) }" });
    const first = await events.next();
    if (first.done) {
      throw new Error("expected the scripted result");
    }
    expect(first.value.errors?.[0]?.message).toBe("scripted stream");
    expect((await events.next()).done).toBe(true);
  });
});
