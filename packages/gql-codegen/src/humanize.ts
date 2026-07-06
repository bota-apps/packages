// Turn an identifier into a sentence-case label:
//   firstName  -> "First name"
//   baseBudget -> "Base budget"
//   onLeave    -> "On leave"
//   email      -> "Email"
// Split on camelCase / snake_case / digits, lowercase everything, then
// capitalize the first character. Deterministic and dependency-free so the
// codegen output is stable across runs.
export function humanize(name: string): string {
  const words = String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
