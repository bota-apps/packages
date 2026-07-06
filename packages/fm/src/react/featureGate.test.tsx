import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FeatureGateContext, FeatureNodeDef } from "@bota-apps/types/fm";
import { createFeatureRegistry } from "../tree/registry";
import { FeatureProvider } from "./featureProvider";
import { FeatureGate } from "./featureGate";

const tree = {
  id: "app",
  children: [
    { id: "reports", planFeature: "reports" },
    { id: "beta", flag: "beta" },
  ],
} as const satisfies FeatureNodeDef;

const registry = createFeatureRegistry(tree);

function host(featureId: string, context: FeatureGateContext) {
  return render(
    <FeatureProvider registry={registry} context={context}>
      <FeatureGate featureId={featureId} whenBlocked={<span>upgrade to unlock</span>}>
        <span>the feature</span>
      </FeatureGate>
    </FeatureProvider>,
  );
}

describe("FeatureGate", () => {
  it("renders children when the feature is ready", () => {
    host("reports", { planFeatures: ["reports"] });
    expect(screen.getByText("the feature")).toBeDefined();
  });

  it("renders whenBlocked instead of children when the feature is blocked", () => {
    host("reports", {});
    expect(screen.queryByText("the feature")).toBeNull();
    expect(screen.getByText("upgrade to unlock")).toBeDefined();
  });

  it("renders nothing when the feature is hidden", () => {
    const { container } = host("beta", {});
    expect(container.textContent).toBe("");
  });
});
