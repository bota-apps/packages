import { describe, expect, it } from "vitest";
import type { AppFeatureContribution, FeatureNodeDef } from "@bota-apps/types/fm";
import { createFeatureRegistry } from "../tree/registry";
import { mountAppContributions } from "./mountAppContributions";

const host: FeatureNodeDef = {
  id: "root",
  children: [{ id: "tasks", children: [{ id: "tasks:runs" }] }, { id: "settings" }],
};

function contribution(id: string, mountUnder: string): AppFeatureContribution {
  return {
    meta: { id, version: "1.0.0" },
    mountUnder,
    feature: {
      id: `app:${id}`,
      label: id,
      target: "module",
      children: [{ id: `app:${id}:index`, target: "page" }],
    },
  };
}

describe("mountAppContributions", () => {
  it("returns the root untouched when there is nothing to mount", () => {
    expect(mountAppContributions(host, [])).toBe(host);
  });

  it("grafts each contribution under its mount node and tags the subtree with appId", () => {
    const tree = mountAppContributions(host, [
      contribution("milestones", "tasks"),
      contribution("bank-payment", "settings"),
    ]);

    const registry = createFeatureRegistry(tree);
    expect(registry.getPath("app:milestones")?.map((node) => node.id)).toEqual([
      "root",
      "tasks",
      "app:milestones",
    ]);
    expect(registry.getPath("app:bank-payment:index")?.map((node) => node.id)).toEqual([
      "root",
      "settings",
      "app:bank-payment",
      "app:bank-payment:index",
    ]);
    expect(registry.getNode("app:milestones")?.meta).toEqual({ appId: "milestones" });
    expect(registry.getNode("app:milestones:index")?.meta).toEqual({ appId: "milestones" });

    // Existing children stay ahead of contributed ones.
    const tasks = registry.getNode("tasks");
    expect(tasks?.children?.map((node) => node.id)).toEqual(["tasks:runs", "app:milestones"]);
  });

  it("does not mutate the host tree", () => {
    mountAppContributions(host, [contribution("milestones", "tasks")]);
    expect(host.children?.[0]?.children?.map((node) => node.id)).toEqual(["tasks:runs"]);
  });

  it("throws when a contribution names an unknown mount id", () => {
    expect(() => mountAppContributions(host, [contribution("milestones", "nope")])).toThrow(
      'contribution "milestones" mounts under unknown feature id "nope"',
    );
  });
});
