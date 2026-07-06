import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { isEmbedded, notifyHost, readContextFromUrl } from "./bridge";
import type { AppInstallationContext } from "./bridge";
import { ExtensionShell } from "./extensionShell";
import type { ExtensionPage } from "./extensionShell";

function readPath(): string {
  if (typeof window === "undefined") {
    return "/";
  }
  return window.location.pathname || "/";
}

export type CreateExtensionAppConfig<TContext = AppInstallationContext> = {
  appName: string;
  appIcon: LucideIcon;
  appVersion: string;
  /** Pages shown in the standalone sidebar. */
  pages: readonly ExtensionPage[];
  /** Message posted to the host on mount (the ready handshake). */
  readyMessage: unknown;
  /**
   * Parse the install context from the URL search string. Defaults to the base
   * {@link readContextFromUrl}; pass your own to add app-specific fields.
   */
  readContext?: (search: string) => TContext;
  /** Render the page for the current path, given the parsed context. */
  renderPage: (path: string, context: TContext) => ReactNode;
};

/**
 * The bootstrap factory for an extension app — the extension-side counterpart to
 * `createAppRoot`. Returns an `App` component that owns the embedded/standalone
 * decision: it renders the page bare when embedded in a host, and wraps it in the
 * {@link ExtensionShell} when standalone. Internal navigation is history-based so
 * every page stays URL-addressable in standalone dev.
 */
export function createExtensionApp<TContext = AppInstallationContext>(
  config: CreateExtensionAppConfig<TContext>,
): { App: () => ReactNode } {
  const { appName, appIcon, appVersion, pages, readyMessage, renderPage } = config;
  const readContext =
    config.readContext ?? ((search: string) => readContextFromUrl(search) as TContext);

  function App() {
    const embedded = isEmbedded();
    const [path, setPath] = useState(readPath);
    const context = useMemo(
      () => readContext(typeof window === "undefined" ? "" : window.location.search),
      [],
    );

    useEffect(() => {
      notifyHost(readyMessage);
    }, []);

    useEffect(() => {
      if (embedded) {
        return;
      }
      const onPopState = () => setPath(readPath());
      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    }, [embedded]);

    const navigate = useCallback((newPath: string) => {
      window.history.pushState(null, "", newPath);
      setPath(newPath);
    }, []);

    const page = renderPage(path, context);

    if (embedded) {
      return page;
    }

    return (
      <ExtensionShell
        appName={appName}
        appIcon={appIcon}
        appVersion={appVersion}
        pages={pages}
        currentPath={path}
        onNavigate={navigate}
      >
        {page}
      </ExtensionShell>
    );
  }

  return { App };
}
