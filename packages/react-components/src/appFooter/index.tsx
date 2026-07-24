import type { ReactNode } from "react";

export type AppFooterLink = {
  label: string;
  href: string;
};

type AppFooterProps = {
  /** Ownership line, e.g. "© 2026 Acme Logistics". */
  legal?: ReactNode;
  /** Footer navigation (legal/support pages), rendered as plain anchors. */
  links?: readonly AppFooterLink[];
  /**
   * Custom link renderer for router-integrated navigation — receives each
   * entry of `links` and replaces the default anchor.
   */
  renderLink?: (link: AppFooterLink) => ReactNode;
  /** Extra trailing content (e.g. a version tag). */
  children?: ReactNode;
};

/**
 * App-wide footer for the shell's `footer` slot: a quiet single-row strip with
 * the ownership line left and legal/support links right. Renders on the page
 * surface (not the chrome) since it belongs to the content column.
 */
export function AppFooter({ legal, links, renderLink, children }: AppFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border bg-background px-4 py-4 text-xs text-muted-foreground sm:px-6">
      {legal && <span>{legal}</span>}
      {(links?.length || children) && (
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {links?.map((link) =>
            renderLink ? (
              <span key={link.href}>{renderLink(link)}</span>
            ) : (
              <a key={link.href} href={link.href} className="hover:text-foreground hover:underline">
                {link.label}
              </a>
            ),
          )}
          {children}
        </nav>
      )}
    </footer>
  );
}
