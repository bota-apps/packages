import { describe, expect, it } from "vitest";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import { createFeatureAccess } from "./createFeatureAccess";

// A minimal app tree. `as const satisfies` preserves the id literals the façade
// constrains against.
const tree = {
  id: "root",
  children: [
    { id: "projects", target: "module" },
    { id: "projects:create", target: "action" },
  ],
} as const satisfies FeatureNodeDef;

describe("createFeatureAccess", () => {
  const { featureId } = createFeatureAccess(tree);

  it("returns known ids unchanged", () => {
    expect(featureId("projects:create")).toBe("projects:create");
    expect(featureId("projects")).toBe("projects");
  });

  it("constrains ids at compile time", () => {
    // The type-level assertion: featureId only accepts this tree's id union.
    // @ts-expect-error — "projcts:create" is a typo, not a node id.
    featureId("projcts:create");
    // @ts-expect-error — an arbitrary string is not a known feature id.
    featureId("something-else");
  });
});
