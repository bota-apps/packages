import { buildFeatureOptions } from "../boundary/buildFeatureOptions";
import { runFeatureAction } from "../boundary/runFeatureAction";
import { tryOrDefault } from "../boundary/tryOrDefault";
import type {
  FeatureBoundary,
  FeatureNodeDef,
  FeatureOptionsOverride,
  FeatureScope,
  ResolvedFeature,
} from "@bota-apps/types/fm";

export function makeScope(
  id: string,
  node: FeatureNodeDef | undefined,
  feature: ResolvedFeature,
): FeatureScope {
  return {
    id,
    feature,
    available: feature.available,
    status: feature.status,
    run: <T>(action: () => Promise<T>, override?: FeatureOptionsOverride<T>) =>
      runFeatureAction(action, buildFeatureOptions<T>(id, node, override)),
    boundary: <T = unknown>(override?: FeatureOptionsOverride<T>): FeatureBoundary<T> => {
      const options = buildFeatureOptions<T>(id, node, override);
      return { ...options, run: (action) => runFeatureAction(action, options) };
    },
    recover: <T>(fn: () => T, fallback: T) => tryOrDefault(fn, fallback, { featureId: id }),
  };
}
