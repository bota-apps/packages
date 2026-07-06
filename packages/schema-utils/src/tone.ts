export type { BadgeTone } from "@bota-apps/types";

// The runtime list of status tones. Kept identical to @bota-apps/react-ui's Badge
// `variant` union (via the BadgeTone contract) so a domain status's `tone` is
// assignable to <Badge variant> with no cast. The Equal<> assertion in ./_alignment
// fails the build if this list and the type drift apart.
export const badgeTones = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "success",
  "warning",
  "muted",
] as const;
