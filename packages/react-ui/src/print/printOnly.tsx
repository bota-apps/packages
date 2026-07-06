import type { ReactNode } from "react";

type PrintOnlyProps = { children: ReactNode };

/** Visible only when printing — hidden on screen. */
export function PrintOnly({ children }: PrintOnlyProps) {
  return <div className="hidden print:block">{children}</div>;
}
