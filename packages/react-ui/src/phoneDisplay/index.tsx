import { Phone } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { phoneTextVariants } from "./variants";

export * from "./variants";

type PhoneDisplayProps = VariantProps<typeof phoneTextVariants> & {
  phone: string;
  /**
   * Show a call button (Phone icon → `tel:` link).
   * Use `true` on detail/view pages. Hidden automatically in print layouts.
   * Default: `false`.
   */
  showCallButton?: boolean;
  /**
   * Country calling code (digits, no `+`) to apply when `phone` is written in
   * national form — i.e. it has no leading `+`. A single leading trunk `0` is
   * dropped before the code is prepended. Omit to display `phone` as given.
   *
   * @example "1" (North America) · "44" (UK) · "49" (Germany)
   */
  countryCode?: string;
  /**
   * Segment lengths for grouping the national part of the number, applied only
   * when `countryCode` is set. Omit to leave the national digits ungrouped.
   *
   * @example [3, 3, 4] renders `+1-415-555-0123`
   */
  groups?: number[];
};

/** Normalize `raw` to `+<digits>`, applying `countryCode` to national-form input. */
function toE164(raw: string, countryCode?: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }
  if (!countryCode) {
    // No country context — show the number as given.
    return trimmed;
  }

  // National form: drop a single trunk `0`, then prepend the country code
  // (unless the digits already start with it).
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  return national.startsWith(countryCode) ? `+${national}` : `+${countryCode}${national}`;
}

/** Split `national` into `-`-joined segments of the given lengths (remainder appended). */
function group(national: string, groups: number[]): string {
  const parts: string[] = [];
  let i = 0;
  for (const len of groups) {
    if (i >= national.length) {
      break;
    }
    parts.push(national.slice(i, i + len));
    i += len;
  }
  if (i < national.length) {
    parts.push(national.slice(i));
  }
  return parts.join("-");
}

function formatForDisplay(e164: string, countryCode?: string, groups?: number[]): string {
  if (!e164.startsWith("+") || !countryCode || !groups?.length) {
    return e164;
  }
  const digits = e164.slice(1);
  if (!digits.startsWith(countryCode)) {
    return e164;
  }
  return `+${countryCode}-${group(digits.slice(countryCode.length), groups)}`;
}

/**
 * Consistent phone number display with an optional call button.
 *
 * By default the number is shown as given. Pass a `countryCode` (and optional
 * `groups`) to normalize national-form input to E.164 and group it for display
 * — the component stays country-agnostic, so the consuming app supplies the
 * conventions its locale uses. The call button is hidden in print layouts.
 *
 * @example
 * <PhoneDisplay phone={project.phone} />
 * <PhoneDisplay phone={project.phone} countryCode="1" groups={[3, 3, 4]} showCallButton />
 */
export function PhoneDisplay({
  phone,
  showCallButton = false,
  countryCode,
  groups,
  size = "md",
  tone = "default",
}: PhoneDisplayProps) {
  const e164 = toE164(phone, countryCode);
  const formatted = formatForDisplay(e164, countryCode, groups);
  const telHref = `tel:${e164.replace(/\D/g, "")}`;

  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn(phoneTextVariants({ size, tone }))}>{formatted}</span>
      {showCallButton && (
        <a
          href={telHref}
          aria-label={`Call ${formatted}`}
          className="print:hidden inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Phone className="h-3 w-3" />
        </a>
      )}
    </span>
  );
}
