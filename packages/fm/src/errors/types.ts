import { AppError, type AppErrorOptions } from "./appError";

// The web-relevant error taxonomy. Each maps to one policy in the registry and
// one telemetry `errorName`.

/** An HTTP-level failure (status known). */
export class ApiError extends AppError {
  readonly status: number;
  constructor(message: string, status: number, opts: AppErrorOptions = {}) {
    super(message, opts);
    this.status = status;
  }
}

/** A GraphQL error response (optional `extensions.code`). */
export class GraphQLError extends AppError {
  readonly code?: string;
  constructor(message: string, opts: AppErrorOptions & { code?: string } = {}) {
    super(message, opts);
    this.code = opts.code;
  }
}

/** Input failed server-side validation. */
export class ValidationError extends AppError {}

/** A domain/business rule rejected the request (e.g. a conflict). */
export class BusinessRuleError extends AppError {}

/** Authentication/authorization failure — typically forces a re-login. */
export class AuthError extends AppError {}

/** The request never reached the server (offline / timeout / DNS). */
export class NetworkError extends AppError {
  static fromError(raw: unknown): NetworkError {
    const message = raw instanceof Error ? raw.message : "Network request failed";
    return new NetworkError(message, { cause: raw });
  }
}

/** Anything unclassified — the safety net. */
export class UnexpectedError extends AppError {}
