import type { LucideIcon } from "lucide-react";
import { ActionLinkEl } from "../html";

export * from "./variants";

type ActionLinkProps = {
  icon?: LucideIcon;
  label: string;
  size?: "default" | "lg";
};

/**
 * ActionLink — the visual for RouteLink variant="text".
 * Renders an icon + label as an inline text link. No button chrome.
 */
export function ActionLink({ icon: Icon, label, size = "default" }: ActionLinkProps) {
  return (
    <ActionLinkEl size={size}>
      {Icon && <Icon />}
      {label}
    </ActionLinkEl>
  );
}
