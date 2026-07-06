import { forwardRef } from "react";
import DOMPurify from "dompurify";
import { AlertEl, type AlertElProps } from "../html";
import { P, Span } from "../html";

// Re-export the canonical variant type from html/alert
export type { AlertVariant as MessageVariant } from "../html";

export * from "./variants";

export type MessageProps = Omit<AlertElProps, "title"> & {
  title?: string;
  description?: string;
  /** Raw HTML string — only for trusted server-rendered content (e.g. Keycloak message summaries). */
  html?: string;
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  { variant, title, description, html, children, ...props },
  ref,
) {
  return (
    <AlertEl ref={ref} variant={variant} {...props}>
      {title !== undefined && <P variant="alertTitle">{title}</P>}
      {description !== undefined && <P>{description}</P>}
      {html !== undefined && (
        <Span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
      )}
      {children}
    </AlertEl>
  );
});
