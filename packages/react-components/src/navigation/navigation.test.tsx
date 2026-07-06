import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { FileText, Home, Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { createFeatureRegistry, resolveFeatureTree, FeatureProvider } from "@bota-apps/fm";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import { buildNavFromDefs, buildNavFromTree } from "./featureNavigation";
import { getActiveNavId, getNavigationSections } from "./helpers";
import { createAppNavigation } from "./createAppNavigation";

const tree = {
  id: "app",
  children: [
    {
      id: "app:home",
      label: "Home",
      route: "/",
      meta: { icon: Home, section: "platform" },
    },
    {
      id: "app:projects",
      label: "Projects",
      route: "/projects",
      meta: { icon: Users, section: "platform" },
      children: [
        {
          id: "app:projects:contracts",
          label: "Contracts",
          route: "/projects/contracts",
          meta: { icon: FileText },
        },
      ],
    },
    {
      id: "app:beta",
      label: "Beta area",
      route: "/beta",
      flag: "beta",
      meta: { icon: FileText, section: "labs" },
    },
    // No route and no icon — never becomes a nav entry.
    { id: "app:background-jobs", label: "Jobs" },
  ],
} as const satisfies FeatureNodeDef;

describe("buildNavFromDefs", () => {
  it("includes every routed node with an icon, gating ignored", () => {
    const items = buildNavFromDefs(tree);
    expect(items.map((item) => item.id)).toEqual(["app:home", "app:projects", "app:beta"]);
    expect(items[1].children?.map((child) => child.id)).toEqual(["app:projects:contracts"]);
  });
});

describe("buildNavFromTree", () => {
  it("prunes hidden features (flag off fails closed)", () => {
    const resolved = resolveFeatureTree(tree, {});
    const items = buildNavFromTree(resolved);
    expect(items.map((item) => item.id)).toEqual(["app:home", "app:projects"]);
  });

  it("keeps flagged features once the flag is on", () => {
    const resolved = resolveFeatureTree(tree, { flags: { beta: true } });
    const items = buildNavFromTree(resolved);
    expect(items.map((item) => item.id)).toContain("app:beta");
  });
});

describe("getActiveNavId", () => {
  const items = buildNavFromDefs(tree);

  it("prefers an exact route match", () => {
    expect(getActiveNavId("/projects", items)).toBe("app:projects");
  });

  it("falls back to the longest route prefix for detail pages", () => {
    expect(getActiveNavId("/projects/contracts/42", items)).toBe("app:projects:contracts");
  });

  it("returns undefined for unknown paths", () => {
    expect(getActiveNavId("/nowhere", items)).toBeUndefined();
  });
});

describe("getNavigationSections", () => {
  it("groups by section in the configured order", () => {
    const items = buildNavFromDefs(tree);
    const sections = getNavigationSections(items, { platform: "Platform", labs: "Labs" }, [
      "labs",
      "platform",
    ]);
    expect(sections.map((section) => section.id)).toEqual(["labs", "platform"]);
    expect(sections[1].items.map((item) => item.id)).toEqual(["app:home", "app:projects"]);
  });
});

describe("createAppNavigation", () => {
  const registry = createFeatureRegistry(tree);
  const nav = createAppNavigation({
    registry,
    sections: { order: ["platform", "labs"], labels: { platform: "Platform", labs: "Labs" } },
  });

  function wrapperAt(pathname: string) {
    return function Wrapper({ children }: { children: ReactNode }) {
      const rootRoute = createRootRoute({ component: () => <>{children}</> });
      const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory({ initialEntries: [pathname] }),
      });
      return (
        <FeatureProvider registry={registry} context={{ flags: { beta: true } }}>
          <RouterProvider router={router} />
        </FeatureProvider>
      );
    };
  }

  it("builds sections and resolves the active entry from the pathname", async () => {
    const { result } = renderHook(() => nav.useAppNavigation(), {
      wrapper: wrapperAt("/projects/contracts"),
    });

    await waitFor(() => {
      expect(result.current.sections.map((section) => section.label)).toEqual(["Platform", "Labs"]);
    });
    expect(result.current.activeNavId).toBe("app:projects:contracts");
  });

  it("lists a feature's children for hub pages", async () => {
    const { result } = renderHook(() => nav.useChildNavigationItems("app:projects"), {
      wrapper: wrapperAt("/projects"),
    });

    await waitFor(() => {
      expect(result.current.map((item) => item.id)).toEqual(["app:projects:contracts"]);
    });
  });
});
