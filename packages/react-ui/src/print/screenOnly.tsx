import type { ReactNode } from "react";

type ScreenOnlyProps = { children: ReactNode };

/** Visible on screen only — hidden when printing. */
export function ScreenOnly({ children }: ScreenOnlyProps) {
  return <div className="print:hidden">{children}</div>;
}
