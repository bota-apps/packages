import type { LucideIcon } from "lucide-react";
import { IconBadgeEl, type IconBadgeElProps } from "../html";

type IconBadgeProps = Pick<IconBadgeElProps, "size" | "tone"> & {
  icon: LucideIcon;
};

export function IconBadge({ icon: Icon, size, tone }: IconBadgeProps) {
  return (
    <IconBadgeEl size={size} tone={tone}>
      <Icon />
    </IconBadgeEl>
  );
}

export * from "./variants";
