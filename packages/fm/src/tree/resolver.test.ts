import { describe, expect, it } from "vitest";
import type { FeatureGateContext, FeatureNodeDef } from "@bota-apps/types/fm";
import { composeFeatureTree } from "./compose";
import { createFeatureRegistry } from "./registry";
import { resolveFeature, resolveFeaturePath, resolveFeatureTree } from "./resolver";

const tree = {
  id: "app",
  children: [
    {
      id: "tasks",
      flag: "tasks",
      children: [
        { id: "tasks:runs", permissions: ["tasks.read"] },
        { id: "tasks:reports", planFeature: "reports" },
      ],
    },
    { id: "settings", setup: "profile", children: [{ id: "settings:billing" }] },
    { id: "projects", limit: "seats" },
  ],
} as const satisfies FeatureNodeDef;

const openContext: FeatureGateContext = {
  flags: { tasks: true },
  permissions: ["tasks.read"],
  planFeatures: ["reports"],
  completedSetup: ["profile"],
};

describe("resolveFeature", () => {
  it("resolves ready with no gating keys or a fully-granted context", () => {
    expect(resolveFeature({ id: "plain" })).toEqual({
      id: "plain",
      label: "plain",
      available: true,
      visible: true,
      status: "ready",
      blockedBy: [],
      warnedBy: [],
      labels: [],
      route: undefined,
      meta: undefined,
    });
    expect(resolveFeature(tree.children[0], openContext).status).toBe("ready");
  });

  it("fails closed: gated keys with an empty context hide/block with reasons", () => {
    expect(resolveFeature(tree.children[0])).toMatchObject({
      status: "hidden",
      visible: false,
      available: false,
      blockedBy: ["flag:tasks"],
    });
    expect(resolveFeature(tree.children[0].children[0])).toMatchObject({
      status: "hidden",
      blockedBy: ["permission:tasks.read"],
    });
    expect(resolveFeature(tree.children[0].children[1])).toMatchObject({
      status: "blocked",
      visible: true,
      blockedBy: ["plan:reports"],
    });
    expect(resolveFeature(tree.children[1])).toMatchObject({
      status: "blocked",
      blockedBy: ["setup:profile"],
    });
    expect(resolveFeature(tree.children[2], { reachedLimits: ["seats"] })).toMatchObject({
      status: "blocked",
      blockedBy: ["limit:seats"],
    });
  });

  it("the worst verdict wins and reasons accumulate", () => {
    const node: FeatureNodeDef = { id: "x", flag: "off", planFeature: "missing" };
    expect(resolveFeature(node)).toMatchObject({
      status: "hidden",
      blockedBy: ["flag:off", "plan:missing"],
    });
  });

  it("approaching limits warn without gating; reached limits still block", () => {
    const node = tree.children[2];
    expect(resolveFeature(node, { approachingLimits: ["seats"] })).toMatchObject({
      status: "ready",
      available: true,
      blockedBy: [],
      warnedBy: ["limit:seats"],
    });
    // Reached wins over approaching — the block replaces the warning.
    expect(
      resolveFeature(node, { reachedLimits: ["seats"], approachingLimits: ["seats"] }),
    ).toMatchObject({
      status: "blocked",
      blockedBy: ["limit:seats"],
      warnedBy: [],
    });
  });

  it("passes node labels through to the resolved feature", () => {
    expect(resolveFeature({ id: "x", labels: ["beta", "addon"] }).labels).toEqual([
      "beta",
      "addon",
    ]);
  });
});

describe("resolveFeaturePath", () => {
  it("cascades ancestor verdicts onto the leaf", () => {
    const registry = createFeatureRegistry(tree);
    const path = registry.getPath("tasks:runs");
    if (!path) {
      throw new Error("expected a path for tasks:runs");
    }
    // The child's own permission is granted, but the parent flag is off.
    const resolved = resolveFeaturePath(path, { permissions: ["tasks.read"] });
    expect(resolved).toMatchObject({
      id: "tasks:runs",
      status: "hidden",
      blockedBy: ["flag:tasks"],
    });
  });

  it("throws on an empty path", () => {
    expect(() => resolveFeaturePath([])).toThrow("empty path");
  });
});

describe("resolveFeatureTree", () => {
  it("resolves the whole tree with cascading verdicts", () => {
    const resolved = resolveFeatureTree(tree, openContext);
    expect(resolved.status).toBe("ready");
    expect(resolved.children.map((child) => [child.id, child.status])).toEqual([
      ["tasks", "ready"],
      ["settings", "ready"],
      ["projects", "ready"],
    ]);

    const gated = resolveFeatureTree(tree, {});
    const settings = gated.children[1];
    expect(settings.status).toBe("blocked");
    // A blocked parent's plain child inherits blocked.
    expect(settings.children[0]).toMatchObject({
      id: "settings:billing",
      status: "blocked",
      blockedBy: ["setup:profile"],
    });
  });
});

describe("createFeatureRegistry", () => {
  it("throws on a duplicate feature id", () => {
    const duplicated: FeatureNodeDef = {
      id: "app",
      children: [{ id: "a" }, { id: "a" }],
    };
    expect(() => createFeatureRegistry(duplicated)).toThrow('duplicate feature id "a"');
  });

  it("getPath returns the root→node chain", () => {
    const registry = createFeatureRegistry(tree);
    expect(registry.getPath("tasks:reports")?.map((node) => node.id)).toEqual([
      "app",
      "tasks",
      "tasks:reports",
    ]);
    expect(registry.getPath("nope")).toBeUndefined();
  });
});

describe("composeFeatureTree", () => {
  it("appends contributions as root children", () => {
    const composed = composeFeatureTree(
      { id: "app", children: [{ id: "core" }] },
      { id: "plugin-a" },
      { id: "plugin-b" },
    );
    expect(composed.children?.map((node) => node.id)).toEqual(["core", "plugin-a", "plugin-b"]);
    // The composed tree registers cleanly (unique ids).
    expect(() => createFeatureRegistry(composed)).not.toThrow();
  });
});
