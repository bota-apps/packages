import { AppError } from "./appError";
import {
  ApiError,
  AuthError,
  BusinessRuleError,
  GraphQLError,
  NetworkError,
  UnexpectedError,
  ValidationError,
} from "./types";
import type { ExpectedKind, ExpectedStatusMap } from "@bota-apps/types/fm";

// A raw thrown value, mapped to a typed error + its kind. The union ties each
// kind to its concrete error type, so downstream switches read `.status` / `.code`
// with no cast.
export type ClassifiedError =
  | { kind: "api"; error: ApiError }
  | { kind: "graphql"; error: GraphQLError }
  | { kind: "auth"; error: AuthError }
  | { kind: "network"; error: NetworkError }
  | { kind: "validation"; error: ValidationError }
  | { kind: "business"; error: BusinessRuleError }
  | { kind: "unexpected"; error: AppError };

/** Guarded structural read — the one place we look inside an `unknown` value. */
function getProp(obj: unknown, key: string): unknown {
  if (typeof obj !== "object" || obj === null || !(key in obj)) return undefined;
  return (obj as Record<string, unknown>)[key];
}

function messageOf(raw: unknown): string {
  if (raw instanceof Error) return raw.message;
  if (typeof raw === "string") return raw;
  return "Something went wrong";
}

/** Re-wrap a source error as the kind an `expected` entry remapped it to. */
function remap(kind: ExpectedKind, message: string, cause: unknown): ClassifiedError {
  switch (kind) {
    case "business":
      return { kind, error: new BusinessRuleError(message, { cause }) };
    case "validation":
      return { kind, error: new ValidationError(message, { cause }) };
    case "auth":
      return { kind, error: new AuthError(message, { cause }) };
    case "network":
      return { kind, error: new NetworkError(message, { cause }) };
    case "unexpected":
      return { kind, error: new UnexpectedError(message, { cause }) };
  }
}

// graphql-request throws a ClientError shaped like { response: { status, errors } }.
function classifyClientError(
  raw: unknown,
  expected?: ExpectedStatusMap,
): ClassifiedError | undefined {
  const response = getProp(raw, "response");
  if (response === undefined) return undefined;

  const status = getProp(response, "status");
  const errors = getProp(response, "errors");
  const firstError = Array.isArray(errors) ? errors[0] : undefined;
  const code = getProp(getProp(firstError, "extensions"), "code");
  const message =
    typeof getProp(firstError, "message") === "string"
      ? String(getProp(firstError, "message"))
      : messageOf(raw);

  if (typeof code === "string" && expected?.[code]) return remap(expected[code], message, raw);
  if (typeof status === "number" && expected?.[status])
    return remap(expected[status], message, raw);
  if (typeof code === "string")
    return { kind: "graphql", error: new GraphQLError(message, { code, cause: raw }) };
  if (typeof status === "number")
    return { kind: "api", error: new ApiError(message, status, { cause: raw }) };
  return undefined;
}

function looksLikeNetwork(raw: unknown): boolean {
  if (!(raw instanceof Error)) return false;
  const m = raw.message.toLowerCase();
  return (
    raw.name === "TypeError" ||
    m.includes("network") ||
    m.includes("fetch") ||
    m.includes("timeout")
  );
}

/**
 * Map any thrown value to a typed, kind-tagged error. Order matters: explicit
 * typed errors first, then HTTP/GraphQL shape (honouring per-call `expected`
 * remaps), then the network heuristic LAST (so a "timeout" business error isn't
 * mislabeled), then the unexpected fallback.
 */
export function classifyError(raw: unknown, expected?: ExpectedStatusMap): ClassifiedError {
  if (raw instanceof AuthError) return { kind: "auth", error: raw };
  if (raw instanceof ApiError) {
    return (
      (expected?.[raw.status] && remap(expected[raw.status], raw.message, raw)) || {
        kind: "api",
        error: raw,
      }
    );
  }
  if (raw instanceof GraphQLError) {
    return (
      (raw.code && expected?.[raw.code] && remap(expected[raw.code], raw.message, raw)) || {
        kind: "graphql",
        error: raw,
      }
    );
  }
  if (raw instanceof ValidationError) return { kind: "validation", error: raw };
  if (raw instanceof BusinessRuleError) return { kind: "business", error: raw };
  if (raw instanceof NetworkError) return { kind: "network", error: raw };
  if (raw instanceof UnexpectedError) return { kind: "unexpected", error: raw };

  const client = classifyClientError(raw, expected);
  if (client) return client;

  if (looksLikeNetwork(raw)) return { kind: "network", error: NetworkError.fromError(raw) };

  if (raw instanceof AppError) return { kind: "unexpected", error: raw };
  return { kind: "unexpected", error: new UnexpectedError(messageOf(raw), { cause: raw }) };
}
