import { describe, expect, it } from "vitest";
import { capabilitiesToFeatureInputs, type OrgCapabilitiesInput } from "./capabilities";

const planTierOrder = ["starter", "professional", "enterprise"] as const;

const capabilities: OrgCapabilitiesInput = {
  plan: "professional",
  flags: [
    { key: "beta.reports", enabled: true },
    { key: "beta.payments", enabled: false },
  ],
  limits: [
    { key: "projects", current: 50, max: 50 }, // reached
    { key: "runs", current: 9, max: 10 }, // approaching (>0.8)
    { key: "seats", current: 2, max: 10 }, // neither
  ],
  setupCompletion: [
    { key: "org", completed: true },
    { key: "tasks", completed: false },
  ],
};

describe("capabilitiesToFeatureInputs", () => {
  it("returns empty inputs for undefined capabilities", () => {
    expect(capabilitiesToFeatureInputs(undefined, planTierOrder)).toEqual({});
  });

  it("maps flags, plan-tier expansion, limit thresholds, and setup steps", () => {
    expect(capabilitiesToFeatureInputs(capabilities, planTierOrder)).toEqual({
      flags: { "beta.reports": true, "beta.payments": false },
      planFeatures: ["starter", "professional"],
      reachedLimits: ["projects"],
      approachingLimits: ["runs"],
      completedSetup: ["org"],
    });
  });

  it("yields no plan features when the plan is not in the tier order", () => {
    expect(
      capabilitiesToFeatureInputs({ ...capabilities, plan: "mystery" }, planTierOrder).planFeatures,
    ).toEqual([]);
  });
});
