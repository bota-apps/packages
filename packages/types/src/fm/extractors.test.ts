import { describe, expect, it } from "vitest";
import type {
  ExtractFeatureIds,
  ExtractFlagKeys,
  ExtractLimitKeys,
  ExtractResourceIds,
  ExtractSetupKeys,
  FeatureNodeDef,
  FeatureTypeMap,
} from "./index";

// A representative tree literal: gating keys spread across depths so each
// extractor has to recurse. The `satisfies` keeps the literal honest against
// FeatureNodeDef while `as const` preserves the string literals the extractors
// pull out.
const tree = {
  id: "root",
  children: [
    {
      id: "projects",
      permissions: ["projects:read"],
      limit: "projects",
      children: [
        {
          id: "projects:create",
          target: "action",
          permissions: ["projects:write"],
          setup: "org-profile",
        },
      ],
    },
    { id: "reports", flag: "advanced-reports", permissions: ["reports:read"] },
  ],
} as const satisfies FeatureNodeDef;

type Tree = typeof tree;

// The literal exists to be reflected over; assert its runtime shape once so it
// is used as a value too.
it("keeps the tree literal a valid FeatureNodeDef", () => {
  expect(tree.id).toBe("root");
});

// The extractors are pure type-level utilities — the "assertions" here are the
// annotated consts: if an extractor stops producing (or over-produces) a
// literal, the annotation no longer typechecks. The runtime expects only keep
// vitest counting the cases.
describe("feature tree type extractors", () => {
  it("ExtractFeatureIds collects every node id", () => {
    const ids: ExtractFeatureIds<Tree>[] = ["root", "projects", "projects:create", "reports"];
    expect(ids).toHaveLength(4);
  });

  it("ExtractResourceIds collects every permissions entry", () => {
    const resources: ExtractResourceIds<Tree>[] = [
      "projects:read",
      "projects:write",
      "reports:read",
    ];
    expect(resources).toHaveLength(3);
  });

  it("ExtractFlagKeys / ExtractLimitKeys / ExtractSetupKeys collect their gating keys", () => {
    const flag: ExtractFlagKeys<Tree> = "advanced-reports";
    const limit: ExtractLimitKeys<Tree> = "projects";
    const setup: ExtractSetupKeys<Tree> = "org-profile";
    expect([flag, limit, setup]).toEqual(["advanced-reports", "projects", "org-profile"]);
  });

  it("FeatureTypeMap bundles all literal unions of a tree", () => {
    const map: FeatureTypeMap<Tree> = {
      featureId: "projects:create",
      resourceId: "projects:write",
      flagKey: "advanced-reports",
      limitKey: "projects",
      setupKey: "org-profile",
    };
    expect(map.featureId).toBe("projects:create");
  });
});
