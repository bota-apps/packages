// Subdomain-per-tenant URL utilities.
//
// Production:  acme.example.com     → subdomain = "acme"
// Local dev:   acme.localhost:3001  → subdomain = "acme"
//
// The base domain is resolved from the request against an allowlist — the set
// of domains the deployment is allowed to serve. Callers pass that allowlist
// (e.g. `["example.com", "localhost"]`); a hostname outside it is rejected
// rather than silently trusted. There is no prod-vs-local branching in app
// code: `localhost` is just another entry in the allowlist.
//
// `window.location` is only a convenience default; tests and non-browser
// callers pass the hostname/location explicitly.

/** The pieces of `window.location` that `buildSubdomainUrl` reads. */
export type UrlLocation = {
  protocol: string;
  hostname: string;
  port: string;
};

/** The allowed base domain a hostname resolves to, or `undefined` if none match. */
function matchBaseDomain(hostname: string, baseDomains: readonly string[]): string | undefined {
  return baseDomains.find((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

/**
 * Extract the tenant subdomain from the given hostname (or the current window
 * location), resolving the base domain against `baseDomains`. Throws if the
 * hostname is not under an allowed domain, or carries no subdomain — apps that
 * call this require a tenant subdomain to operate.
 */
export function getSubdomain(
  baseDomains: readonly string[],
  hostname: string = window.location.hostname,
): string {
  if (!hostname) {
    throw new Error("No hostname provided and window.location.hostname is empty");
  }

  const base = matchBaseDomain(hostname, baseDomains);
  if (!base) {
    throw new Error(
      `Host "${hostname}" is not under an allowed domain (${baseDomains.join(", ")})`,
    );
  }

  // hostname === base means the bare domain with no tenant subdomain.
  const sub = hostname === base ? "" : hostname.slice(0, -(base.length + 1));
  if (!sub) {
    throw new Error(`No tenant subdomain in "${hostname}". Expected <subdomain>.${base}`);
  }
  return sub;
}

/**
 * Build the full URL for a given subdomain, preserving the current protocol
 * and port. The base domain is resolved from `location.hostname` against
 * `baseDomains`; a hostname outside the allowlist keeps its full host as the
 * base (so preview/ephemeral deployments still get a working subdomain URL).
 */
export function buildSubdomainUrl(
  subdomain: string,
  baseDomains: readonly string[],
  pathname = "/",
  location: UrlLocation = window.location,
): string {
  const { protocol, port, hostname } = location;

  const baseDomain = matchBaseDomain(hostname, baseDomains) ?? hostname;
  const portSuffix = port && port !== "80" && port !== "443" ? `:${port}` : "";

  return `${protocol}//${subdomain}.${baseDomain}${portSuffix}${pathname}`;
}
