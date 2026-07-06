import type { ReactNode } from "react";
import { Inline } from "@bota-apps/react-ui";

type RowActionsProps = {
  children: ReactNode;
};

/** Right-aligned action cluster for a table/list row's trailing cell. */
export function RowActions({ children }: RowActionsProps) {
  return (
    <Inline gap="xs" justify="end">
      {children}
    </Inline>
  );
}
