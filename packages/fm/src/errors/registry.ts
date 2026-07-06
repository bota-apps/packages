// Per-kind error policy — pure data, no React, no toast. The boundary reads this
// to decide the telemetry name, whether a failure is a tracked "error" vs an
// expected "action" outcome, whether to force logout, and the fallback message.

export type ClassifiedKind =
  "auth" | "network" | "api" | "graphql" | "validation" | "business" | "unexpected";

export type TrackMode = "error" | "action";

export type ErrorPolicy = {
  /** Telemetry name — the stem of the fingerprint `<featureId>.<errorName>[.<suffix>]`. */
  errorName: string;
  /** "error" = a real fault; "action" = an expected, user-correctable outcome. */
  track: TrackMode;
  /** Force a re-login when this kind occurs. */
  logsOut?: boolean;
  /** Static fallback toast when neither the call site nor the tree supplies one. */
  defaultNotify?: string;
};

export const featureErrorRegistry: Record<ClassifiedKind, ErrorPolicy> = {
  auth: {
    errorName: "auth_error",
    track: "error",
    logsOut: true,
    defaultNotify: "Your session has expired.",
  },
  network: {
    errorName: "network_error",
    track: "action",
    defaultNotify: "You appear to be offline.",
  },
  api: { errorName: "api_error", track: "error", defaultNotify: "Something went wrong." },
  graphql: { errorName: "graphql_error", track: "error", defaultNotify: "Something went wrong." },
  validation: { errorName: "validation_error", track: "action" },
  business: { errorName: "business_error", track: "action" },
  unexpected: {
    errorName: "unexpected_error",
    track: "error",
    defaultNotify: "Something went wrong.",
  },
};
