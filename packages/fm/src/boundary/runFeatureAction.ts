import { classifyError } from "../errors/classify";
import { routeClassifiedError } from "./route";
import { getFeatureRuntime } from "./runtime";
import type { FeatureBoundaryOptions } from "@bota-apps/types/fm";

/**
 * The async boundary: run an action under one feature's policy. On success it
 * tracks the action, notifies the success message (if any), and runs onSuccess;
 * on failure it classifies → tracks → notifies → (logout) and runs onError.
 * Returns `undefined` on failure — the explicit recovery signal — so callers
 * never need their own try/catch.
 */
export async function runFeatureAction<T>(
  fn: () => Promise<T>,
  opts: FeatureBoundaryOptions<T>,
): Promise<T | undefined> {
  const rt = getFeatureRuntime();
  const start = Date.now();
  try {
    const value = await fn();
    const durationMs = Date.now() - start;
    rt?.track({
      fingerprint: opts.featureId,
      featureId: opts.featureId,
      mode: "action",
      context: {
        ...opts.context,
        ...opts.generateSuccessContext?.(value, { durationMs }),
        outcome: "success",
      },
    });
    if (opts.success.notifyUser ?? true) {
      const message = opts.success.getMessage?.(value) ?? opts.success.message;
      if (message) rt?.notify({ id: opts.featureId, message, level: "success" });
    }
    await opts.success.onSuccess?.(value);
    return value;
  } catch (raw) {
    routeClassifiedError(classifyError(raw, opts.expected), opts);
    await opts.error.onError?.(raw);
    return undefined;
  } finally {
    await opts.onSettled?.();
  }
}
