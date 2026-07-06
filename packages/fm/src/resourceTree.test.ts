import { describe, expect, it } from "vitest";
import { buildResourceTree, collectResourceIds, pruneToGranted } from "./resourceTree";

// Flat, depth-first catalog carrying an extra payload field (label) to prove the
// helpers preserve the source node type.
const flat = [
  { id: "org", parentId: null, label: "Organization" },
  { id: "org:roles", parentId: "org", label: "Roles" },
  { id: "org:roles:edit", parentId: "org:roles", label: "Edit roles" },
  { id: "tasks", parentId: null, label: "Tasks" },
];

describe("buildResourceTree", () => {
  it("rebuilds the nested tree and preserves node payload", () => {
    const tree = buildResourceTree(flat);
    expect(tree.map((n) => n.id)).toEqual(["org", "tasks"]);
    expect(tree[0].label).toBe("Organization");
    expect(tree[0].children[0].id).toBe("org:roles");
    expect(tree[0].children[0].children[0].id).toBe("org:roles:edit");
  });
});

describe("collectResourceIds", () => {
  it("returns all ids depth-first, self before children", () => {
    expect(collectResourceIds(buildResourceTree(flat))).toEqual([
      "org",
      "org:roles",
      "org:roles:edit",
      "tasks",
    ]);
  });
});

describe("pruneToGranted", () => {
  it("keeps only granted nodes, preserving structure", () => {
    const pruned = pruneToGranted(buildResourceTree(flat), new Set(["org", "org:roles"]));
    expect(collectResourceIds(pruned)).toEqual(["org", "org:roles"]);
  });

  it("drops a branch when its parent is not granted", () => {
    // org:roles is granted but org (its parent) is not → the whole branch is cut.
    const pruned = pruneToGranted(buildResourceTree(flat), new Set(["org:roles", "tasks"]));
    expect(collectResourceIds(pruned)).toEqual(["tasks"]);
  });
});
