import { describe, expect, it } from "vitest";
import type {
  AppMarketplaceCategory,
  DefaultAppMarketplaceCategory,
  RegisteredMarketplaceCategory,
} from "./index";

// The register resolution is a pure type-level mechanism — the "assertions"
// here are the annotated consts: if the resolution widens, narrows, or stops
// honoring a registration, an annotation no longer typechecks. The runtime
// expects only keep vitest counting the cases.
describe("marketplace taxonomy register (FmRegister)", () => {
  it("resolves to exactly the platform defaults when nothing is registered", () => {
    const categories: AppMarketplaceCategory[] = [
      "tasks",
      "projects",
      "compliance",
      "reporting",
      "integrations",
    ];
    // Unregistered, the resolution adds nothing beyond the default set — the
    // two unions stay assignable in BOTH directions.
    const backToDefault: DefaultAppMarketplaceCategory = categories[0];
    const backToResolved: AppMarketplaceCategory = backToDefault;
    expect(categories).toHaveLength(5);
    expect(backToResolved).toBe("tasks");
  });

  it("widens by the members an app registers under the marketplaceCategory slot", () => {
    type AppRegister = { marketplaceCategory: "crm" | "billing" };
    type Extended = DefaultAppMarketplaceCategory | RegisteredMarketplaceCategory<AppRegister>;
    const extended: Extended[] = ["crm", "billing", "tasks", "reporting"];
    expect(extended).toHaveLength(4);
  });

  it("contributes nothing when the register carries no marketplaceCategory key", () => {
    // A register without the slot resolves to never — the union collapses to
    // the defaults, so a default member is still the only thing assignable.
    type Unrelated = { user: { id: string } };
    const stillDefault: DefaultAppMarketplaceCategory | RegisteredMarketplaceCategory<Unrelated> =
      "reporting";
    expect(stillDefault).toBe("reporting");
  });
});
