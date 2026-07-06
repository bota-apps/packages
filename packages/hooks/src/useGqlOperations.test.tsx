import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { parse } from "graphql";
import { GraphQLClient } from "graphql-request";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { GraphQLContext } from "./graphqlContext";
import { gqlQueryKey, useGqlMutation, useGqlQuery } from "./useGqlOperations";

type Department = { id: string; name: string };

const DepartmentsDocument: TypedDocumentNode<
  { departments: Department[] },
  Record<string, never>
> = parse(/* GraphQL */ `
  query Departments {
    departments {
      id
      name
    }
  }
`);

const DepartmentDocument: TypedDocumentNode<{ department: Department | null }, { id: string }> =
  parse(/* GraphQL */ `
    query Department($id: ID!) {
      department(id: $id) {
        id
        name
      }
    }
  `);

const CreateDepartmentDocument: TypedDocumentNode<
  { createDepartment: Department },
  { input: { name: string } }
> = parse(/* GraphQL */ `
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
    }
  }
`);

/**
 * A real GraphQLClient over a stubbed fetch — exercises the printed-document
 * path end-to-end and keeps the test cast-free. Responds to every request
 * with the queued data payloads in order (last one repeats).
 */
function createTestClient(...payloads: unknown[]) {
  const requests: { query: string; variables?: unknown }[] = [];
  const client = new GraphQLClient("http://test.invalid/graphql", {
    fetch: async (_input, init) => {
      const body: unknown = JSON.parse(String(init?.body));
      if (body && typeof body === "object" && "query" in body) {
        const { query, variables } = body;
        requests.push({ query: String(query), variables });
      }
      const data = payloads[Math.min(requests.length - 1, payloads.length - 1)];
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  return { client, requests };
}

function createWrapper(client: GraphQLClient) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <GraphQLContext.Provider value={client}>{children}</GraphQLContext.Provider>
      </QueryClientProvider>
    );
  }
  return { Wrapper, queryClient };
}

describe("gqlQueryKey", () => {
  it("uses the operation name, appending variables only when defined and non-empty", () => {
    expect(gqlQueryKey(DepartmentsDocument)).toEqual(["Departments"]);
    expect(gqlQueryKey(DepartmentDocument, { id: "dept_1" })).toEqual([
      "Department",
      { id: "dept_1" },
    ]);
    expect(gqlQueryKey(DepartmentsDocument, {})).toEqual(["Departments"]);
  });

  it("strips undefined-valued variables so equivalent calls share a key", () => {
    const OptionalDocument: TypedDocumentNode<{ departments: Department[] }, { status?: string }> =
      parse(/* GraphQL */ `
        query DepartmentsByStatus($status: String) {
          departments(status: $status) {
            id
          }
        }
      `);
    expect(gqlQueryKey(OptionalDocument, { status: undefined })).toEqual(["DepartmentsByStatus"]);
    expect(gqlQueryKey(OptionalDocument, { status: "active" })).toEqual([
      "DepartmentsByStatus",
      { status: "active" },
    ]);
  });

  it("rejects documents without a named operation", () => {
    const anonymous: TypedDocumentNode<
      { departments: Department[] },
      Record<string, never>
    > = parse(/* GraphQL */ `
      {
        departments {
          id
        }
      }
    `);
    expect(() => gqlQueryKey(anonymous)).toThrow(/named operation/);
  });
});

describe("useGqlQuery", () => {
  it("returns the unwrapped root field and caches it under the derived key", async () => {
    const departments = [{ id: "dept_1", name: "Engineering" }];
    const { client, requests } = createTestClient({ departments });
    const { Wrapper, queryClient } = createWrapper(client);

    const { result } = renderHook(() => useGqlQuery(DepartmentsDocument), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(departments);
    });
    expect(requests[0]?.query).toContain("query Departments");
    expect(queryClient.getQueryData(gqlQueryKey(DepartmentsDocument))).toEqual(departments);
  });

  it("sends variables and keys the cache per variables object", async () => {
    const department = { id: "dept_2", name: "Finance" };
    const { client, requests } = createTestClient({ department });
    const { Wrapper, queryClient } = createWrapper(client);

    const { result } = renderHook(() => useGqlQuery(DepartmentDocument, { id: "dept_2" }), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(department);
    });
    expect(requests[0]?.variables).toEqual({ id: "dept_2" });
    expect(queryClient.getQueryData(gqlQueryKey(DepartmentDocument, { id: "dept_2" }))).toEqual(
      department,
    );
  });

  it("propagates GraphQL errors as the query error", async () => {
    const client = new GraphQLClient("http://test.invalid/graphql", {
      fetch: async () =>
        new Response(JSON.stringify({ errors: [{ message: "boom" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    });
    const { Wrapper } = createWrapper(client);

    const { result } = renderHook(() => useGqlQuery(DepartmentsDocument), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useGqlQuery contract", () => {
  it("rejects documents selecting more than one root field", async () => {
    const MultiFieldDocument: TypedDocumentNode<
      { departments: Department[]; department: Department | null },
      Record<string, never>
    > = parse(/* GraphQL */ `
      query DepartmentsAndOne {
        departments {
          id
        }
        department(id: "dept_1") {
          id
        }
      }
    `);
    const { client } = createTestClient({ departments: [], department: null });
    const { Wrapper } = createWrapper(client);

    const { result } = renderHook(() => useGqlQuery(MultiFieldDocument), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toMatch(/exactly one root field/);
  });
});

describe("useGqlMutation", () => {
  it("passes mutate variables through and invalidates the requested keys on success", async () => {
    const departments = [{ id: "dept_1", name: "Engineering" }];
    const created = { id: "dept_9", name: "Legal" };
    const { client, requests } = createTestClient({ departments }, { createDepartment: created });
    const { Wrapper } = createWrapper(client);

    const { result } = renderHook(
      () => ({
        query: useGqlQuery(DepartmentsDocument),
        mutation: useGqlMutation(CreateDepartmentDocument, {
          invalidates: [gqlQueryKey(DepartmentsDocument)],
        }),
      }),
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(result.current.query.data).toEqual(departments);
    });

    result.current.mutation.mutate({ input: { name: "Legal" } });
    await waitFor(() => {
      expect(result.current.mutation.data).toEqual(created);
    });
    expect(requests[1]?.variables).toEqual({ input: { name: "Legal" } });

    // The invalidated list query refetches (initial fetch + post-mutation refetch).
    await waitFor(() => {
      const listRequests = requests.filter((r) => r.query.includes("query Departments"));
      expect(listRequests.length).toBe(2);
    });
  });
});
