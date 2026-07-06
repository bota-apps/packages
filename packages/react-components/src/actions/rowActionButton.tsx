import { Button } from "@bota-apps/react-ui";
import type { LucideIcon } from "lucide-react";

type RowActionButtonProps = {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  /** Accessible name — icon-only buttons must still announce what they do. */
  label: string;
};

/** Icon-only ghost button for a row action (edit, download, …). */
export function RowActionButton({ icon: Icon, onClick, disabled, label }: RowActionButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} disabled={disabled} aria-label={label}>
      <Icon />
    </Button>
  );
}
