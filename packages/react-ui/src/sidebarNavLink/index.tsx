import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SidebarNavLabelEl } from "../html";

export * from "./variants";

type SidebarNavLinkProps = {
  icon?: LucideIcon;
  label: string;
  /** Nesting depth:
   *  0 (default) — top-level item; inherits typography from container
   *  1            — sub-item; slightly de-emphasised label
   *  2+           — deep nesting; smaller, muted label
   */
  treeLevel?: number;
  suffix?: ReactNode;
};

export function SidebarNavLink({ icon: Icon, label, treeLevel = 0, suffix }: SidebarNavLinkProps) {
  return (
    <>
      {Icon && <Icon />}
      <SidebarNavLabelEl depth={treeLevel >= 2 ? 2 : treeLevel === 1 ? 1 : 0}>
        {label}
      </SidebarNavLabelEl>
      {suffix}
    </>
  );
}
