import type { ReactNode } from "react";
import { Inline } from "@bota-apps/react-ui";

type PageActionsProps = {
  children: ReactNode;
};

/** Groups a page header's action buttons with standard spacing. */
export function PageActions({ children }: PageActionsProps) {
  return <Inline gap="sm">{children}</Inline>;
}
