import { classifyError } from "../errors/classify";
import { featureErrorRegistry } from "../errors/registry";
import { getFeatureRuntime } from "./runtime";

type TryOptions = {
  featureId?: string;
  context?: Record<string, unknown>;
};

/**
 * The sync boundary, for render-time / store reads (parse, etc.). Tracks the
 * failure (never toasts) and returns the fallback. Use it where throwing would
 * crash a render and a sensible default is better than an error screen.
 */
export function tryOrDefault<T>(fn: () => T, fallback: T, opts: TryOptions = {}): T {
  try {
    return fn();
  } catch (raw) {
    const featureId = opts.featureId ?? "app";
    const { kind, error } = classifyError(raw);
    const policy = featureErrorRegistry[kind];
    getFeatureRuntime()?.track({
      fingerprint: `${featureId}.${policy.errorName}`,
      featureId,
      mode: policy.track,
      context: { ...opts.context, ...error.context },
    });
    return fallback;
  }
}

/**
 * Read-path reporter: forward a query failure to the tracker (reads never toast —
 * the route's page-state error view shows them). Wired into QueryCache.onError.
 */
export function reportQueryError(raw: unknown, featureId = "app"): void {
  const { kind, error } = classifyError(raw);
  const policy = featureErrorRegistry[kind];
  getFeatureRuntime()?.track({
    fingerprint: `${featureId}.${policy.errorName}`,
    featureId,
    mode: policy.track,
    context: error.context,
  });
}
