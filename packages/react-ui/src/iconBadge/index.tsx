import type { LucideIcon } from "lucide-react";
import { IconBadgeEl, type IconBadgeElProps } from "../html";

type IconBadgeProps = Pick<IconBadgeElProps, "size" | "shape" | "tone"> & {
  icon: LucideIcon;
};

export function IconBadge({ icon: Icon, size, shape, tone }: IconBadgeProps) {
  return (
    <IconBadgeEl size={size} shape={shape} tone={tone}>
      <Icon />
    </IconBadgeEl>
  );
}

export * from "./variants";
