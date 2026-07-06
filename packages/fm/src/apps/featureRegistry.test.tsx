import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import {
  toAppManifest,
  useFeatureRegistry,
  type MarketplaceApp,
  type MarketplaceAppManifest,
} from "./featureRegistry";

const featureTree: FeatureNodeDef = {
  id: "root",
  label: "Root",
  target: "module",
  children: [{ id: "marketplace", label: "Apps", target: "module" }],
};

function manifest(id: string, version = "1.0.0"): MarketplaceAppManifest {
  return {
    id,
    version,
    displayName: `App ${id}`,
    tagline: "tag",
    longDescription: "long",
    developerName: "dev",
    category: "tasks",
    price: "free",
    flagKey: `flag.${id}`,
    iconName: null,
    iconUrl: null,
    permissions: [{ id: `${id}.read`, label: "Read", description: "Read things" }],
    nav: { mountUnder: "marketplace", label: `App ${id}`, iconName: null },
    pages: [{ path: "", url: `https://apps/${id}`, label: null, iconName: null }],
  };
}

function app(id: string, installed: boolean): MarketplaceApp {
  return { id, installed, manifest: manifest(id), manifestUrl: `https://apps/${id}/manifest` };
}

describe("useFeatureRegistry", () => {
  it("contributes installed apps and skips uninstalled ones", () => {
    const catalog = [app("alpha", true), app("beta", false)];
    const { result } = renderHook(() => useFeatureRegistry(featureTree, catalog));

    expect(result.current.isReady).toBe(true);
    expect(result.current.contributions).toHaveLength(1);
    expect(result.current.contributions[0].meta.id).toBe("alpha");
    // The installed app's subtree is grafted under its mount point.
    expect(result.current.registry.getNode("app:alpha")).toBeDefined();
    expect(result.current.registry.getNode("app:beta")).toBeUndefined();
  });

  it("reports not-ready while the catalog is undefined (still loading)", () => {
    const { result } = renderHook(() => useFeatureRegistry(featureTree, undefined));
    expect(result.current.isReady).toBe(false);
    expect(result.current.contributions).toHaveLength(0);
    // Host tree is still usable before the catalog loads.
    expect(result.current.registry.getNode("marketplace")).toBeDefined();
  });

  it("keeps a stable registry across re-renders with an unchanged installed set", () => {
    const catalog = [app("alpha", true)];
    const { result, rerender } = renderHook(
      ({ c }: { c: MarketplaceApp[] }) => useFeatureRegistry(featureTree, c),
      { initialProps: { c: catalog } },
    );
    const first = result.current.registry;
    rerender({ c: [app("alpha", true)] }); // same (id, version) signature
    expect(result.current.registry).toBe(first);
  });
});

describe("toAppManifest", () => {
  it("bridges nullable optionals to undefined", () => {
    const bridged = toAppManifest({ ...manifest("gamma"), iconName: "Package", iconUrl: null });
    expect(bridged.iconName).toBe("Package");
    expect(bridged.iconUrl).toBeUndefined();
    expect(bridged.nav.iconName).toBeUndefined();
    expect(bridged.pages[0].label).toBeUndefined();
  });
});
