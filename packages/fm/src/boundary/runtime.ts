// The runtime seam: how the boundary notifies the user and tracks telemetry,
// and how it requests a logout. Kept abstract so @bota-apps/fm depends on no
// UI or telemetry SDK — the app wires concretes once at bootstrap
// (configureFeatureRuntime in app/src/providers.ts). The shapes live in
// @bota-apps/types/fm; this file owns the singleton runtime.

import type { FeatureRuntime } from "@bota-apps/types/fm";

let runtime: FeatureRuntime | undefined;

export function configureFeatureRuntime(next: FeatureRuntime): void {
  runtime = next;
}

export function getFeatureRuntime(): FeatureRuntime | undefined {
  return runtime;
}
