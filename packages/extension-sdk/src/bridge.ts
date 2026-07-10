// The host↔extension contract. An extension runs either embedded in a host
// (inside an iframe) or standalone (its own tab, for local dev). These helpers
// are the entire runtime bridge: detect the mode, post messages up to the host,
// and read the install context the host passes on the URL.

/** True when running inside a host iframe (parent window differs from self). */
export function isEmbedded(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.parent !== window;
}

/**
 * Post a message up to the host window. No-op when standalone (no host to
 * receive it). The message type is the caller's — each extension owns its own
 * message union.
 */
export function notifyHost<TMessage>(message: TMessage): void {
  if (typeof window === "undefined" || !isEmbedded()) {
    return;
  }
  window.parent.postMessage(message, "*");
}

/**
 * The install context a host passes to an embedded extension via URL params.
 * Extensions that need more (e.g. a selected project) extend this shape and
 * layer their own parsing on top of {@link readContextFromUrl}.
 */
export type AppInstallationContext = {
  tenantId: string;
  tenantName: string;
  appToken: string;
};

/** Fallback context used when running standalone (no host-provided params). */
export const standaloneContext: AppInstallationContext = {
  tenantId: "tenant_demo",
  tenantName: "Demo Organization",
  appToken: "demo_app_token",
};

/** Parse the base install context from a URL search string, with standalone fallbacks. */
export function readContextFromUrl(search: string): AppInstallationContext {
  const params = new URLSearchParams(search);
  return {
    tenantId: params.get("tenantId") ?? standaloneContext.tenantId,
    tenantName: params.get("tenantName") ?? standaloneContext.tenantName,
    appToken: params.get("appToken") ?? standaloneContext.appToken,
  };
}
