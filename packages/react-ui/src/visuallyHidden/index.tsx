import type { ReactNode } from "react";
import { Span } from "../html";
import { visuallyHiddenVariants } from "./variants";

export * from "./variants";

type VisuallyHiddenProps = {
  children: ReactNode;
};

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <Span className={visuallyHiddenVariants()}>{children}</Span>;
}
