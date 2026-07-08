import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Outlet, createRootRoute, createRoute, type RouterHistory } from "@tanstack/react-router";
import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@bota-apps/auth-client";
import { useGraphQLClient } from "@bota-apps/hooks";
import { createHostRouter } from "@bota-apps/react-components";
import { createRenderRoute } from "./createRenderRoute";

// A minimal real app: an authenticated shell reading the real AuthProvider and
// a page fetching through the real GraphQLProvider — so the test proves the
// whole production provider stack mounts with only the two doubles injected.
function Shell() {
  const auth = useAuth();
  return (
    <>
      <p>{auth.status === "authenticated" ? `signed in as ${auth.user.name}` : "signed out"}</p>
      <Outlet />
    </>
  );
}

function GreetingPage() {
  const client = useGraphQLClient();
  const [greeting, setGreeting] = useState<string>();
  useEffect(() => {
    void client.request<{ greeting: string }>("query { greeting }").then((data) => {
      setGreeting(data.greeting);
    });
  }, [client]);
  return <p>{greeting ?? "loading greeting"}</p>;
}

function createAppRouter(history: RouterHistory) {
  const rootRoute = createRootRoute({ component: Shell });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: GreetingPage,
  });
  return createHostRouter(rootRoute.addChildren([indexRoute]), history);
}

// The resolver reads the request context — what an app's mock backend does —
// so the test can assert per-render context overrides reach the resolvers.
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      greeting: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (_source, _args, context: { userId?: string }) =>
          `hello ${context.userId ?? "nobody"}`,
      },
    },
  }),
});

function TranslationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <p>translations ready</p>
      {children}
    </>
  );
}

const seedUser = { id: "u1", name: "Test User", email: "test.user@example.com" };

const renderRoute = createRenderRoute({
  createRouter: createAppRouter,
  featureTree: { id: "app" },
  TranslationProvider,
  schema,
  seedUser,
  graphqlContext: (overrides?: { userId?: string }) => ({ userId: seedUser.id, ...overrides }),
});

describe("createRenderRoute", () => {
  it("mounts the real provider stack at the path with only the two doubles injected", async () => {
    renderRoute("/");
    expect(screen.getByText("translations ready")).toBeTruthy();
    expect(await screen.findByText("signed in as Test User")).toBeTruthy();
    expect(await screen.findByText("hello u1")).toBeTruthy();
  });

  it("forwards per-render auth and graphql-context overrides to the doubles", async () => {
    renderRoute("/", {
      auth: { user: { id: "u2", name: "Someone Else", email: "someone.else@example.com" } },
      context: { userId: "override" },
    });
    expect(await screen.findByText("signed in as Someone Else")).toBeTruthy();
    expect(await screen.findByText("hello override")).toBeTruthy();
  });
});
