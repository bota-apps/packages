import { describe, expect, it } from "vitest";
import { Landmark, Package } from "lucide-react";
import type { AppManifest } from "@bota-apps/types/fm";
import { appManifestToContribution, appManifestToFeature, resolveLucideIcon } from "./appManifest";

const manifest: AppManifest = {
  id: "bank-payment",
  version: "1.2.0",
  displayName: "Bank Payment",
  tagline: "Pay vendors straight from your bank",
  longDescription: "Connects project tasks to a bank transfer flow.",
  developerName: "Bota Apps",
  category: "integrations",
  price: "paid",
  iconName: "Package",
  flagKey: "apps.bank-payment",
  permissions: [
    { id: "bank-payment:read", label: "Read payments", description: "See payment batches" },
    { id: "bank-payment:write", label: "Send payments", description: "Initiate transfers" },
  ],
  nav: { mountUnder: "tasks", label: "Bank Payment", iconName: "Landmark" },
  pages: [
    { path: "", url: "https://apps.example.com/bank-payment/" },
    { path: "settings", url: "https://apps.example.com/bank-payment/settings", label: "Settings" },
  ],
};

describe("resolveLucideIcon", () => {
  it("resolves a known icon name to its component", () => {
    expect(resolveLucideIcon("Package")).toBe(Package);
  });

  it("returns undefined for unknown or missing names", () => {
    expect(resolveLucideIcon("NoSuchIcon")).toBeUndefined();
    expect(resolveLucideIcon(undefined)).toBeUndefined();
    expect(resolveLucideIcon("")).toBeUndefined();
  });
});

describe("appManifestToFeature", () => {
  it("builds a flag-gated module subtree with one page node per manifest page", () => {
    const feature = appManifestToFeature(manifest);

    expect(feature.id).toBe("app:bank-payment");
    expect(feature.label).toBe("Bank Payment");
    expect(feature.target).toBe("module");
    expect(feature.route).toBe("/apps/bank-payment/");
    expect(feature.flag).toBe("apps.bank-payment");
    expect(feature.permissions).toEqual(["bank-payment:read", "bank-payment:write"]);
    expect(feature.meta).toEqual({ appId: "bank-payment", icon: Landmark });

    expect(feature.children).toHaveLength(2);
    const [index, settings] = feature.children ?? [];
    expect(index).toMatchObject({
      id: "app:bank-payment:index",
      label: "Bank Payment",
      target: "page",
      route: "/apps/bank-payment/",
      flag: "apps.bank-payment",
    });
    expect(settings).toMatchObject({
      id: "app:bank-payment:settings",
      label: "Settings",
      route: "/apps/bank-payment/settings",
    });
  });

  it("falls back to the root icon for pages and to iconUrl when no icon resolves", () => {
    const feature = appManifestToFeature(manifest);
    expect(feature.children?.[0]?.meta?.icon).toBe(Landmark);

    const noIcon = appManifestToFeature({
      ...manifest,
      iconName: undefined,
      iconUrl: "https://cdn.example.com/icon.png",
      nav: { ...manifest.nav, iconName: "NoSuchIcon" },
    });
    expect(noIcon.meta).toEqual({
      appId: "bank-payment",
      iconUrl: "https://cdn.example.com/icon.png",
    });
    expect(noIcon.children?.[0]?.meta).toEqual({ appId: "bank-payment" });
  });
});

describe("appManifestToContribution", () => {
  it("wraps the feature with the mount point and identity meta", () => {
    const contribution = appManifestToContribution(manifest);

    expect(contribution.meta).toEqual({ id: "bank-payment", version: "1.2.0" });
    expect(contribution.mountUnder).toBe("tasks");
    expect(contribution.feature.id).toBe("app:bank-payment");
  });
});
