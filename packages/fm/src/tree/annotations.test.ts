import { describe, expect, it } from "vitest";
import { deriveFeatureAnnotations, featureLabelKinds } from "./annotations";
import { resolveFeature } from "./resolver";

describe("deriveFeatureAnnotations", () => {
  it("splits namespaced reasons into blocking-first annotations", () => {
    const feature = resolveFeature(
      { id: "reports", planFeature: "advanced-reports", limit: "exports" },
      { approachingLimits: ["exports"] },
    );
    expect(deriveFeatureAnnotations(feature)).toEqual([
      {
        severity: "blocking",
        collector: "plan",
        reason: "plan:advanced-reports",
        detail: "advanced-reports",
      },
      { severity: "warning", collector: "limit", reason: "limit:exports", detail: "exports" },
    ]);
  });

  it("keeps an un-namespaced reason whole as the collector", () => {
    const feature = {
      ...resolveFeature({ id: "x" }),
      blockedBy: ["maintenance"],
    };
    expect(deriveFeatureAnnotations(feature)).toEqual([
      { severity: "blocking", collector: "maintenance", reason: "maintenance", detail: "" },
    ]);
  });

  it("returns nothing for a ready, warning-free feature", () => {
    expect(deriveFeatureAnnotations(resolveFeature({ id: "x" }))).toEqual([]);
  });
});

describe("featureLabelKinds", () => {
  it("enumerates the full label vocabulary", () => {
    expect(featureLabelKinds).toEqual([
      "beta",
      "new",
      "comingSoon",
      "deprecated",
      "preview",
      "addon",
    ]);
  });
});
