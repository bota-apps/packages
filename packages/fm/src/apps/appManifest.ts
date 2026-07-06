import { icons } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppFeatureContribution, AppManifest, FeatureNodeDef } from "@bota-apps/types/fm";

function isIconName(name: string): name is keyof typeof icons {
  return name in icons;
}

/**
 * Resolves a Lucide icon component from its PascalCase export name ("Package",
 * "Landmark", …). Manifests are data — they carry icon NAMES; only the host
 * holds the component. Unknown or missing names resolve to `undefined` so the
 * caller picks its own fallback icon.
 */
export function resolveLucideIcon(name?: string): LucideIcon | undefined {
  if (!name || !isIconName(name)) {
    return undefined;
  }
  return icons[name];
}

/**
 * Converts an app manifest into a feature subtree: a `module` root at
 * `/apps/<id>/` with one `page` child per manifest page. The whole subtree is
 * gated on the manifest's `flagKey` and carries the app's permission ids, so
 * the standard collectors hide/block it exactly like first-party features.
 */
export function appManifestToFeature(manifest: AppManifest): FeatureNodeDef {
  const rootId = `app:${manifest.id}`;
  const rootRoute = `/apps/${manifest.id}/`;
  const icon = resolveLucideIcon(manifest.nav.iconName ?? manifest.iconName);
  const permissions = manifest.permissions.map((permission) => permission.id);
  const meta: Record<string, unknown> = { appId: manifest.id };
  if (icon) {
    meta.icon = icon;
  } else if (manifest.iconUrl) {
    meta.iconUrl = manifest.iconUrl;
  }

  const children: FeatureNodeDef[] = manifest.pages.map((page) => {
    const pageIcon = resolveLucideIcon(page.iconName) ?? icon;
    const pageMeta: Record<string, unknown> = { appId: manifest.id };
    if (pageIcon) {
      pageMeta.icon = pageIcon;
    }
    return {
      id: `${rootId}:${page.path || "index"}`,
      label: page.label ?? manifest.nav.label,
      target: "page",
      route: page.path === "" ? rootRoute : `${rootRoute}${page.path}`,
      meta: pageMeta,
      permissions,
      flag: manifest.flagKey,
    };
  });

  return {
    id: rootId,
    label: manifest.nav.label,
    target: "module",
    route: rootRoute,
    meta,
    permissions,
    flag: manifest.flagKey,
    children,
  };
}

/** Wraps {@link appManifestToFeature} with the mount point and identity meta. */
export function appManifestToContribution(manifest: AppManifest): AppFeatureContribution {
  return {
    meta: { id: manifest.id, version: manifest.version },
    mountUnder: manifest.nav.mountUnder,
    feature: appManifestToFeature(manifest),
  };
}
