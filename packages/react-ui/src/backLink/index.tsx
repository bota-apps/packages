import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { BackLinkEl } from "../html";

type BackLinkProps = {
  children: ReactNode;
};

export function BackLink({ children }: BackLinkProps) {
  return (
    <BackLinkEl>
      <ArrowLeft />
      {children}
    </BackLinkEl>
  );
}

export * from "./variants";
