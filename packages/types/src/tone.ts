// The shared status vocabulary. Kept identical to @bota-apps/react-ui's Badge
// `variant` union so a domain status's `tone` is assignable to <Badge variant> with
// no cast. (Diverges from a generic six-tone set on purpose — alignment with the
// canonical Badge is what makes the assignment typecheck.)
export type BadgeTone =
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "muted";
