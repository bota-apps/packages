import { useMemo } from "react";
import type {
  AppFeatureContribution,
  AppManifest,
  AppMarketplaceCategory,
  AppMarketplacePrice,
  FeatureNodeDef,
} from "@bota-apps/types/fm";
import { appManifestToContribution } from "./appManifest";
import { mountAppContributions } from "./mountAppContributions";
import { createFeatureRegistry, type FeatureRegistry } from "../tree/registry";

// ---------------------------------------------------------------------------
// Marketplace catalog contract.
//
// These structural types describe the marketplace catalog an app fetches (via
// GraphQL) and hands to `useFeatureRegistry`. They live here — not in
// @bota-apps/types — so fm gains no dependency on the app's generated documents
// or on @bota-apps/hooks. Enum-ish fields (`category`, `price`) are typed as
// `string` and nullable optionals as `T | null`, so an app's graphql-codegen
// output (string-literal unions + `Maybe<T>` optionals) assigns with no cast.
// `category`/`price` reuse the platform unions — `AppMarketplaceCategory`
// resolves to the platform defaults plus whatever taxonomy the app registered
// via `FmRegister` (declaration merging on "@bota-apps/types/fm"), so an app's
// generated `MarketplaceAppCategory`/`MarketplaceAppPrice` unions assign both
// ways — keeping `toAppManifest` a clean pass-through into `AppManifest`.
// ---------------------------------------------------------------------------

/** One permission a marketplace app requests, with its consent copy. */
export type MarketplaceAppPermission = {
  id: string;
  label: string;
  description: string;
};

/** Where a marketplace app mounts in host navigation. */
export type MarketplaceAppNav = {
  mountUnder: string;
  label: string;
  iconName?: string | null;
};

/** A page a marketplace app contributes. */
export type MarketplaceAppPage = {
  path: string;
  url: string;
  label?: string | null;
  iconName?: string | null;
};

/** A marketplace app's published manifest (the catalog's `manifest` field). */
export type MarketplaceAppManifest = {
  id: string;
  version: string;
  displayName: string;
  tagline: string;
  longDescription: string;
  developerName: string;
  category: AppMarketplaceCategory;
  price: AppMarketplacePrice;
  flagKey: string;
  iconName?: string | null;
  iconUrl?: string | null;
  permissions: MarketplaceAppPermission[];
  nav: MarketplaceAppNav;
  pages: MarketplaceAppPage[];
};

/** A catalog entry: a manifest plus its per-organization install state. */
export type MarketplaceApp = {
  id: string;
  installed: boolean;
  manifest: MarketplaceAppManifest;
  manifestUrl: string;
};

/**
 * Bridges a marketplace manifest (nullable optionals from GraphQL `Maybe<T>`) to
 * the internal {@link AppManifest} shape (undefined optionals), so
 * `appManifestToContribution` can graft it into the feature tree.
 */
export function toAppManifest(manifest: MarketplaceAppManifest): AppManifest {
  return {
    id: manifest.id,
    version: manifest.version,
    displayName: manifest.displayName,
    tagline: manifest.tagline,
    longDescription: manifest.longDescription,
    developerName: manifest.developerName,
    category: manifest.category,
    price: manifest.price,
    iconName: manifest.iconName ?? undefined,
    iconUrl: manifest.iconUrl ?? undefined,
    flagKey: manifest.flagKey,
    permissions: manifest.permissions,
    nav: {
      mountUnder: manifest.nav.mountUnder,
      label: manifest.nav.label,
      iconName: manifest.nav.iconName ?? undefined,
    },
    pages: manifest.pages.map((page) => ({
      path: page.path,
      url: page.url,
      label: page.label ?? undefined,
      iconName: page.iconName ?? undefined,
    })),
  };
}

export type FeatureRegistryResult = {
  registry: FeatureRegistry;
  contributions: readonly AppFeatureContribution[];
  /** True once the catalog has loaded (`catalog !== undefined`). */
  isReady: boolean;
};

/**
 * Builds a feature registry from the host's own `featureTree` plus the installed
 * apps in a marketplace `catalog`. The catalog is passed in — the app owns the
 * query — so fm depends on no data layer. The tree is app-specific, so it too is
 * a parameter. Only rebuilds when the installed `(id, version)` set, the tree, or
 * readiness changes; `isReady` is false until the catalog loads.
 */
export function useFeatureRegistry(
  featureTree: FeatureNodeDef,
  catalog: MarketplaceApp[] | undefined,
): FeatureRegistryResult {
  // Stable signature so the registry only rebuilds when the set of installed
  // (id, version) pairs changes — not on every catalog poll.
  const installedSignature = useMemo(() => {
    if (!catalog) {
      return "";
    }
    return catalog
      .filter((entry) => entry.installed)
      .map((entry) => `${entry.id}@${entry.manifest.version}`)
      .sort()
      .join("|");
  }, [catalog]);

  const isReady = catalog !== undefined;

  return useMemo<FeatureRegistryResult>(() => {
    const contributions = (catalog ?? [])
      .filter((entry) => entry.installed)
      .map((entry) => appManifestToContribution(toAppManifest(entry.manifest)));
    // mountAppContributions grafts each contribution at its `mountUnder` node and
    // returns the merged tree (throwing on an unknown mount id or duplicate id).
    const tree = mountAppContributions(featureTree, contributions);
    const registry = createFeatureRegistry(tree);
    return { registry, contributions, isReady };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- installedSignature stands in for `catalog`
  }, [installedSignature, featureTree, isReady]);
}
