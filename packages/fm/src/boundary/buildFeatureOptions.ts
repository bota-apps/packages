import type {
  FeatureBoundaryOptions,
  FeatureNodeDef,
  FeatureOptionsOverride,
} from "@bota-apps/types/fm";

/**
 * Merge the tree node's policy (the floor) with the call-site override. The node
 * owns the static `message` (success/error); the call site wins on everything
 * dynamic (getMessage, onSuccess/onError, context, expected). Mirrors expo54's
 * buildFeatureOptions.
 */
export function buildFeatureOptions<T>(
  featureId: string,
  node: FeatureNodeDef | undefined,
  override?: FeatureOptionsOverride<T>,
): FeatureBoundaryOptions<T> {
  return {
    featureId,
    context: override?.context,
    expected: { ...node?.expected, ...override?.expected },
    error: {
      message: node?.error?.message,
      getMessage: override?.error?.getMessage,
      onError: override?.error?.onError,
      notifyUser: override?.error?.notifyUser,
    },
    success: {
      message: node?.success?.message,
      getMessage: override?.success?.getMessage,
      onSuccess: override?.success?.onSuccess,
      notifyUser: override?.success?.notifyUser,
    },
    generateSuccessContext: override?.generateSuccessContext,
    onSettled: override?.onSettled,
  };
}
