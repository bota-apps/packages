import type { ClassifiedError } from "../errors/classify";
import { featureErrorRegistry } from "../errors/registry";
import { getFeatureRuntime } from "./runtime";
import type { FeatureBoundaryOptions } from "@bota-apps/types/fm";

// The fingerprint suffix and the "specific" message are the only kind-typed bits;
// computed in switches (not the data registry) so `.status` / `.code` stay typed.
function fingerprintSuffix(c: ClassifiedError): string | undefined {
  switch (c.kind) {
    case "api":
      return String(c.error.status);
    case "graphql":
      return c.error.code;
    default:
      return undefined;
  }
}

/** A message specific enough to show the user without the tree's generic copy. */
function specificMessage(c: ClassifiedError): string | undefined {
  switch (c.kind) {
    case "api":
      return c.error.status >= 400 && c.error.status < 500 ? c.error.message : undefined;
    case "validation":
    case "business":
      return c.error.message;
    default:
      return undefined;
  }
}

/**
 * The single place that calls `notify` and `track`. Builds the fingerprint,
 * decides silent-vs-toast, and triggers logout per the per-kind policy.
 */
export function routeClassifiedError<T>(c: ClassifiedError, opts: FeatureBoundaryOptions<T>): void {
  const rt = getFeatureRuntime();
  const policy = featureErrorRegistry[c.kind];

  const suffix = fingerprintSuffix(c);
  const fingerprint = `${opts.featureId}.${policy.errorName}${suffix ? `.${suffix}` : ""}`;
  rt?.track({
    fingerprint,
    featureId: opts.featureId,
    mode: policy.track,
    context: { ...opts.context, ...c.error.context },
  });

  if (opts.error.notifyUser ?? true) {
    // call-site override → specific (4xx/validation/business) → tree floor → registry default.
    const message =
      opts.error.getMessage?.(c.error) ??
      specificMessage(c) ??
      opts.error.message ??
      policy.defaultNotify;
    if (message) rt?.notify({ id: opts.featureId, message, level: "error" });
  }

  if (policy.logsOut) rt?.requestLogout?.();
}
