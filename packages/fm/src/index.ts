// @bota-apps/fm — the unified feature + error/boundary module.
//
// One feature tree. Each node yields a FeatureScope with two faces: a gating face
// (available/status — minimal today, collectors later) and a boundary face
// (run/recover that classifies errors, emits one telemetry fingerprint, and
// notifies once). Error handling is owned by the feature node, not sprinkled at
// call sites. The package depends on no UI/telemetry SDK — the app wires concretes
// via configureFeatureRuntime. The pure SHAPE types live in @bota-apps/types/fm
// and are re-exported here for consumer convenience.

// errors (runtime: classes + classifier + registry)
export { AppError, type AppErrorOptions, type ErrorContext } from "./errors/appError";
export {
  ApiError,
  GraphQLError,
  ValidationError,
  BusinessRuleError,
  AuthError,
  NetworkError,
  UnexpectedError,
} from "./errors/types";
export {
  featureErrorRegistry,
  type ClassifiedKind,
  type ErrorPolicy,
  type TrackMode,
} from "./errors/registry";
export { classifyError, type ClassifiedError } from "./errors/classify";

// boundary (runtime)
export { configureFeatureRuntime, getFeatureRuntime } from "./boundary/runtime";
export { runFeatureAction } from "./boundary/runFeatureAction";
export { tryOrDefault, reportQueryError } from "./boundary/tryOrDefault";
export { buildFeatureOptions } from "./boundary/buildFeatureOptions";
export { routeClassifiedError } from "./boundary/route";

// tree (runtime)
export { createFeatureRegistry, type FeatureRegistry } from "./tree/registry";
export { resolveFeature, resolveFeaturePath, resolveFeatureTree } from "./tree/resolver";
export { composeFeatureTree } from "./tree/compose";
export { deriveFeatureAnnotations, featureLabelKinds } from "./tree/annotations";
export {
  flagCollector,
  permissionCollector,
  planCollector,
  limitCollector,
  setupCollector,
  defaultCollectors,
} from "./tree/collectors";

// scope (runtime)
export { makeScope } from "./scope/featureScope";

// apps (runtime) — manifest → feature-subtree conversion and mounting
export {
  resolveLucideIcon,
  appManifestToFeature,
  appManifestToContribution,
} from "./apps/appManifest";
export { mountAppContributions } from "./apps/mountAppContributions";
export {
  toAppManifest,
  useFeatureRegistry,
  type FeatureRegistryResult,
  type MarketplaceApp,
  type MarketplaceAppManifest,
  type MarketplaceAppNav,
  type MarketplaceAppPage,
  type MarketplaceAppPermission,
} from "./apps/featureRegistry";

// react (runtime)
export { FeatureProvider, useFeatureRegistryContext } from "./react/featureProvider";
export { FeatureScopeProvider, useCurrentScopeId } from "./react/featureScopeProvider";
export { useFeatureScope, useCurrentFeatureScope } from "./react/useFeatureScope";
export {
  useFeature,
  useFeatureStatus,
  useFeatureChildren,
  useFeatureTree,
  useFeatureAnnotations,
} from "./react/useFeature";
export {
  useFeatureSetup,
  type FeatureSetupInput,
  type PrunedResourceNode,
} from "./react/useFeatureSetup";
export {
  capabilitiesToFeatureInputs,
  type OrgCapabilitiesInput,
  type CapabilityFeatureInputs,
} from "./capabilities";
export {
  buildResourceTree,
  collectResourceIds,
  pruneToGranted,
  type FlatResourceNode,
  type ResourceTreeNode,
} from "./resourceTree";
export { FeatureGate, type FeatureGateProps } from "./react/featureGate";
export { createFeatureAccess } from "./react/createFeatureAccess";

// shape contracts — re-exported from @bota-apps/types/fm for convenience, so
// consumers can `import { FeatureNodeDef } from "@bota-apps/fm"`.
export type {
  AppErrorLike,
  FeatureTarget,
  ExpectedKind,
  ExpectedStatusMap,
  FeatureNodeDef,
  ExtractFeatureIds,
  ExtractResourceIds,
  ExtractFlagKeys,
  ExtractLimitKeys,
  ExtractSetupKeys,
  FeatureTypeMap,
  AppManifest,
  AppFeatureContribution,
  AppPermissionDescriptor,
  // NOT FmRegister: declaration merging must target the module that declares
  // the interface — augment "@bota-apps/types/fm" to extend the taxonomy.
  AppMarketplaceCategory,
  DefaultAppMarketplaceCategory,
  RegisteredMarketplaceCategory,
  AppMarketplacePrice,
  AppPage,
  AppNavEntry,
  FeatureStatus,
  FeatureLabelKind,
  FeatureAnnotation,
  ResolvedFeature,
  ResolvedFeatureNode,
  FeatureGateContext,
  FeatureCollector,
  CollectorVerdict,
  ErrorConfigInput,
  SuccessConfigInput,
  FeatureOptionsOverride,
  FeatureOptionsInput,
  FeatureBoundaryOptions,
  FeatureBoundary,
  FeatureScope,
  TrackEvent,
  NotifyMessage,
  FeatureRuntime,
} from "@bota-apps/types/fm";
