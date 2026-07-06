import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { emailTextVariants } from "./variants";

export * from "./variants";

type EmailTextProps = VariantProps<typeof emailTextVariants> & {
  email: string;
  /**
   * When true, wraps in `<a href="mailto:...">` with hover underline.
   * Use true on detail/profile pages. Default: false.
   */
  linked?: boolean;
};

/**
 * Consistent email address display control.
 *
 * All email addresses rendered in the app must use this component so they
 * share the same monospace, visually distinct style.
 *
 * @example
 * <EmailText email="user@example.com" />
 * <EmailText email={project.email} linked size="sm" tone="muted" />
 */
export function EmailText({
  email,
  linked = false,
  size = "md",
  tone = "default",
}: EmailTextProps) {
  const classes = cn(emailTextVariants({ size, tone }));

  if (linked) {
    return (
      <a href={`mailto:${email}`} className={cn(classes, "underline-offset-4 hover:underline")}>
        {email}
      </a>
    );
  }

  return <span className={classes}>{email}</span>;
}
