import "i18next";

// Declaration merging with i18next's CustomTypeOptions — the one place
// `interface` is required. Keeps `t()` return types in sync with the runtime
// options set in `defaultInitOptions` (no null/empty returns, no namespace
// separator inside keys).
declare module "i18next" {
  interface CustomTypeOptions {
    nsSeparator: false;
    returnNull: false;
    returnEmptyString: false;
  }
}
