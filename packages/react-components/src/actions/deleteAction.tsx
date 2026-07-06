import { Button, ConfirmDialog } from "@bota-apps/react-ui";
import { Trash2 } from "lucide-react";

type DeleteActionProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

/** Destructive action behind a confirm dialog — never deletes on first click. */
export function DeleteAction({ title, description, confirmLabel, onConfirm }: DeleteActionProps) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="action-destructive">
          <Trash2 /> {confirmLabel}
        </Button>
      }
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant="destructive"
      onConfirm={onConfirm}
    />
  );
}
