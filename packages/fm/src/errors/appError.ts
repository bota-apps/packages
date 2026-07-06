// Framework-free error base. Carries an optional `cause` and a low-cardinality
// `context` (ids / source / phase only — never raw payloads) so the tracker can
// attach a few stable fields to a fingerprint without exploding cardinality.
export type ErrorContext = Record<string, unknown>;

export type AppErrorOptions = {
  cause?: unknown;
  context?: ErrorContext;
};

export class AppError extends Error {
  readonly context?: ErrorContext;

  constructor(message: string, opts: AppErrorOptions = {}) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    // Subclasses report their own class name (used in messages / debugging).
    this.name = new.target.name;
    this.context = opts.context;
  }
}
