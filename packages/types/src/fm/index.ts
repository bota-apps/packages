// Pure type contracts for @bota-apps/fm (feature management + error boundary).
// The runtime — error classes, classifier, registries, scope/boundary, React
// providers — lives in @bota-apps/fm. Consumers that only need the SHAPES (e.g. a
// presentational component typing a boundary prop) import from here and stay free
// of the fm runtime. Error references use a structural `AppErrorLike` so this file
// imports no class.

/** Structural view of an AppError — what message builders read. */
export type AppErrorLike = {
  readonly name: string;
  readonly message: string;
  readonly context?: Record<string, unknown>;
};

/* ── feature tree ───────────────────────────────────────────────────────── */

export type FeatureTarget = "app" | "module" | "page" | "action";

/** Kinds an `expected` status/code may remap a raw error to (never api/graphql). */
export type ExpectedKind = "auth" | "network" | "validation" | "business" | "unexpected";

/** Map an HTTP status (number) or GraphQL code (string) to an expected kind. */
export type ExpectedStatusMap = Record<string | number, ExpectedKind>;

/** Lifecycle badge vocabulary a node may carry (runtime array lives in @bota-apps/fm). */
export type FeatureLabelKind = "beta" | "new" | "comingSoon" | "deprecated" | "preview" | "addon";

/**
 * A feature-tree node. Generic over `Id` — the union of dotted ids the tree
 * uses. Left at its `string` default the shape is unconstrained (what the
 * runtime engine and package internals consume); an app that authors its tree
 * with `satisfies FeatureNodeDef<TaskFeatureId>` gets every `id`, `route`
 * reference, and `children` id checked against its own id union at compile time.
 */
export type FeatureNodeDef<Id extends string = string> = {
  /** Dotted, globally-unique id (e.g. "projects:create"). */
  id: Id;
  label?: string;
  /** One-line summary of what the feature does — surfaced by pickers (e.g. an issue reporter's feature list). */
  description?: string;
  target?: FeatureTarget;
  route?: string;
  /** Lifecycle badges (beta, new, …) passed through to the resolved feature for UI surfaces. */
  labels?: readonly FeatureLabelKind[];
  /** RBAC resources (carried for gating collectors). */
  permissions?: readonly string[];
  /** Feature-flag key — the flag collector hides the node unless the flag is on. */
  flag?: string;
  /** Plan feature key — the plan collector blocks the node unless the current plan includes it. */
  planFeature?: string;
  /** Usage-limit key — the limit collector blocks the node when the limit is reached. */
  limit?: string;
  /** Setup step key — the setup collector blocks the node until the step is complete. */
  setup?: string;
  /** Free-form gating/nav metadata (e.g. an icon) — not consumed by the boundary. */
  meta?: Record<string, unknown>;
  // boundary policy (action nodes)
  expected?: ExpectedStatusMap;
  success?: { message?: string };
  error?: { message?: string };
  children?: readonly FeatureNodeDef<Id>[];
};

/** Union of every node id in a tree literal (typed via `as const satisfies`). */
export type ExtractFeatureIds<N> = N extends { id: infer I extends string }
  ? I | (N extends { children: readonly (infer C)[] } ? ExtractFeatureIds<C> : never)
  : never;

/** Union of every `permissions` entry in a tree literal. */
export type ExtractResourceIds<N> =
  | (N extends { permissions: readonly (infer P extends string)[] } ? P : never)
  | (N extends { children: readonly (infer C)[] } ? ExtractResourceIds<C> : never);

/** Union of every `flag` key in a tree literal. */
export type ExtractFlagKeys<N> =
  | (N extends { flag: infer F extends string } ? F : never)
  | (N extends { children: readonly (infer C)[] } ? ExtractFlagKeys<C> : never);

/** Union of every `limit` key in a tree literal. */
export type ExtractLimitKeys<N> =
  | (N extends { limit: infer L extends string } ? L : never)
  | (N extends { children: readonly (infer C)[] } ? ExtractLimitKeys<C> : never);

/** Union of every `setup` key in a tree literal. */
export type ExtractSetupKeys<N> =
  | (N extends { setup: infer S extends string } ? S : never)
  | (N extends { children: readonly (infer C)[] } ? ExtractSetupKeys<C> : never);

/**
 * Every literal-key union of a tree literal in one map — the one-stop shape
 * apps derive their feature aliases from:
 *
 * ```ts
 * type TaskFeatures = FeatureTypeMap<typeof tasksFeatureTree>;
 * type TaskFlagKey = TaskFeatures["flagKey"];
 * ```
 */
export type FeatureTypeMap<N> = {
  featureId: ExtractFeatureIds<N>;
  resourceId: ExtractResourceIds<N>;
  flagKey: ExtractFlagKeys<N>;
  limitKey: ExtractLimitKeys<N>;
  setupKey: ExtractSetupKeys<N>;
};

export type FeatureStatus = "ready" | "blocked" | "hidden";

/** The gating face of a node — minimal today; structured for collectors later. */
export type ResolvedFeature = {
  id: string;
  label: string;
  available: boolean;
  visible: boolean;
  status: FeatureStatus;
  blockedBy: readonly string[];
  /** Namespaced warning reasons (e.g. "limit:projects") — advisory only, never gates. */
  warnedBy: readonly string[];
  /** The node's lifecycle badges, passed through for UI surfaces. */
  labels: readonly FeatureLabelKind[];
  route?: string;
  /** The node's free-form metadata, passed through so nav/card surfaces can read icons etc. */
  meta?: Record<string, unknown>;
};

/**
 * One derived, renderable gating fact — the shape badge/banner/tooltip surfaces
 * consume. Derived from a feature's namespaced reasons by
 * `deriveFeatureAnnotations` in @bota-apps/fm; apps map `collector` to copy and
 * look up any usage numbers for `detail` from their own API data.
 */
export type FeatureAnnotation = {
  severity: "blocking" | "warning";
  /** The reason's namespace — a collector prefix ("plan", "limit", …) or a custom one. */
  collector: string;
  /** The full namespaced reason, e.g. "plan:advanced-reports". */
  reason: string;
  /** The reason with its namespace stripped, e.g. "advanced-reports". */
  detail: string;
};

/** A resolved node with its resolved children — the shape nav builders walk. */
export type ResolvedFeatureNode = ResolvedFeature & {
  children: readonly ResolvedFeatureNode[];
};

/* ── gating collectors ──────────────────────────────────────────────────── */

/**
 * The app-provided inputs the gating collectors read. Every field is optional —
 * a missing field means "nothing granted/enabled", so gated nodes fail closed
 * (a node with a `flag` is hidden until the app supplies that flag as on).
 */
export type FeatureGateContext = {
  /** Feature-flag values by flag key. */
  flags?: Readonly<Record<string, boolean>>;
  /** Permission keys granted to the current user. */
  permissions?: readonly string[];
  /** Feature keys enabled by the current plan. */
  planFeatures?: readonly string[];
  /** Usage-limit keys that are exhausted. */
  reachedLimits?: readonly string[];
  /** Usage-limit keys nearing exhaustion — surfaced as warnings, never gates. */
  approachingLimits?: readonly string[];
  /** Setup/onboarding step keys that are complete. */
  completedSetup?: readonly string[];
};

/**
 * A collector's non-passing verdict; `undefined` from a collector means "pass".
 * A "warning" verdict never changes the feature's status — its reasons surface
 * as `warnedBy` for advisory UI (approaching limits, expiring trials, …).
 */
export type CollectorVerdict = {
  status: Exclude<FeatureStatus, "ready"> | "warning";
  /** Machine-readable reasons (e.g. "plan:multi-currency") surfaced as `blockedBy`/`warnedBy`. */
  reasons: readonly string[];
};

/** One gating rule: reads a node + the app context, vetoes or passes. */
export type FeatureCollector = (
  node: FeatureNodeDef,
  context: FeatureGateContext,
) => CollectorVerdict | undefined;

/* ── boundary options ───────────────────────────────────────────────────── */

export type ErrorConfigInput = {
  getMessage?: (error: AppErrorLike) => string;
  onError?: (raw: unknown) => void | Promise<void>;
  notifyUser?: boolean;
};

export type SuccessConfigInput<T> = {
  getMessage?: (value: T) => string;
  onSuccess?: (value: T) => void | Promise<void>;
  notifyUser?: boolean;
};

/** The override slice — everything except the id (scope.run already knows its id). */
export type FeatureOptionsOverride<T> = {
  context?: Record<string, unknown>;
  expected?: ExpectedStatusMap;
  error?: ErrorConfigInput;
  success?: SuccessConfigInput<T>;
  generateSuccessContext?: (value: T, meta: { durationMs: number }) => Record<string, unknown>;
  onSettled?: () => void | Promise<void>;
};

/** The one prop forms/actions take: a validated id, or the id + overrides. */
export type FeatureOptionsInput<Id extends string, T> =
  Id | ({ featureId: Id } & FeatureOptionsOverride<T>);

/** Resolved options (tree floor merged with the override) the boundary runs on. */
export type FeatureBoundaryOptions<T> = {
  featureId: string;
  context?: Record<string, unknown>;
  expected?: ExpectedStatusMap;
  error: { message?: string } & ErrorConfigInput;
  success: { message?: string } & SuccessConfigInput<T>;
  generateSuccessContext?: (value: T, meta: { durationMs: number }) => Record<string, unknown>;
  onSettled?: () => void | Promise<void>;
};

/**
 * A resolved boundary you can hand to a presentational component (e.g.
 * `DynamicForm`'s `featureScope`): the merged `FeatureBoundaryOptions` (tree floor
 * + call-site override, so reactions like `success.onSuccess` live here) plus a
 * `run` already bound to them. The consumer only needs `run`; it never imports the
 * fm package to apply the policy.
 */
export type FeatureBoundary<T> = FeatureBoundaryOptions<T> & {
  run: (action: () => Promise<T>) => Promise<T | undefined>;
};

/**
 * One node, two faces: the gating face (from the resolver) and the boundary face
 * (`run`/`recover`/`boundary`). `run` resolves its defaults from the tree node,
 * merged with the call-site override. Built by fm's `makeScope`; typed here so
 * presentational packages can accept one without depending on the fm runtime.
 */
export type FeatureScope = {
  readonly id: string;

  // gating face
  readonly feature: ResolvedFeature;
  readonly available: boolean;
  readonly status: ResolvedFeature["status"];

  // boundary face
  run<T>(action: () => Promise<T>, override?: FeatureOptionsOverride<T>): Promise<T | undefined>;
  /** Pre-bind the options (tree floor + override) into a runnable boundary to pass
   *  to a presentational component — `scope.boundary({ success: { onSuccess } })`. */
  boundary<T = unknown>(override?: FeatureOptionsOverride<T>): FeatureBoundary<T>;
  recover<T>(fn: () => T, fallback: T): T;
};

/* ── app manifests (marketplace/extension apps) ─────────────────────────── */

/** The marketplace taxonomy every host understands out of the box. */
export type DefaultAppMarketplaceCategory =
  "tasks" | "projects" | "compliance" | "reporting" | "integrations";

/**
 * Marketplace taxonomy is owned by the app's domain — this package only ships
 * the {@link DefaultAppMarketplaceCategory} platform set. An app extends the
 * taxonomy once, via declaration merging (same mechanism as `AuthRegister` in
 * `@bota-apps/types/auth`):
 *
 * ```ts
 * declare module "@bota-apps/types/fm" {
 *   interface FmRegister {
 *     marketplaceCategory: "crm" | "billing";
 *   }
 * }
 * ```
 *
 * {@link AppMarketplaceCategory} then resolves to the defaults PLUS the
 * registered members app-wide, with no generics at call sites. Unregistered,
 * it stays exactly the default five. The augmentation must target
 * `"@bota-apps/types/fm"` — the module that DECLARES the interface.
 */
// An interface (not a type) on purpose: declaration merging is the mechanism,
// and it is empty until an app merges its taxonomy in.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FmRegister {}

/**
 * The app-registered marketplace categories ({@link FmRegister}'s
 * `marketplaceCategory` slot), or `never` when nothing is registered.
 */
export type RegisteredMarketplaceCategory<TRegister = FmRegister> = TRegister extends {
  marketplaceCategory: infer TCategory extends string;
}
  ? TCategory
  : never;

/**
 * The platform defaults widened by whatever the app registered via
 * {@link FmRegister} — apps own their marketplace taxonomy.
 */
export type AppMarketplaceCategory = DefaultAppMarketplaceCategory | RegisteredMarketplaceCategory;

export type AppMarketplacePrice = "free" | "paid" | "enterprise";

/** One permission a marketplace app requests, with user-facing consent copy. */
export type AppPermissionDescriptor = {
  id: string;
  label: string;
  description: string;
};

/** One embeddable page an app contributes; `path: ""` is the app's index page. */
export type AppPage = {
  path: string;
  url: string;
  label?: string;
  /** Lucide icon name, resolved at runtime by `resolveLucideIcon` in @bota-apps/fm. */
  iconName?: string;
};

/** Where the app hangs in the host's feature tree and how its nav entry reads. */
export type AppNavEntry = {
  /** The host feature id the app's subtree mounts under. */
  mountUnder: string;
  label: string;
  iconName?: string;
};

/**
 * What an installable (marketplace/extension) app publishes about itself —
 * enough for the host to list it, ask consent for its permissions, and graft
 * its pages into the feature tree via `appManifestToContribution`.
 */
export type AppManifest = {
  id: string;
  version: string;
  displayName: string;
  tagline: string;
  longDescription: string;
  developerName: string;
  category: AppMarketplaceCategory;
  price: AppMarketplacePrice;
  iconName?: string;
  iconUrl?: string;
  /** The feature flag gating the whole app subtree. */
  flagKey: string;
  permissions: AppPermissionDescriptor[];
  nav: AppNavEntry;
  pages: AppPage[];
};

/** A manifest converted into a mountable feature subtree. */
export type AppFeatureContribution = {
  meta: { id: string; version: string };
  mountUnder: string;
  feature: FeatureNodeDef;
};

/* ── runtime seam ───────────────────────────────────────────────────────── */

export type TrackEvent = {
  fingerprint: string;
  featureId: string;
  mode: "error" | "action";
  context?: Record<string, unknown>;
};

export type NotifyMessage = {
  id: string;
  message: string;
  level?: "error" | "success";
};

export type FeatureRuntime = {
  notify: (msg: NotifyMessage) => void;
  track: (event: TrackEvent) => void;
  requestLogout?: () => void;
};
