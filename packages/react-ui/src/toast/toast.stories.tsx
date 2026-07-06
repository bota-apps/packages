import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./index";

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
};
export default meta;

type Story = StoryObj<typeof Toast>;

function ToastDemo({ variant }: { variant?: "default" | "destructive" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <ToastProvider>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show toast
      </Button>
      <Toast variant={variant} open={open} onOpenChange={setOpen}>
        <div className="grid gap-1">
          <ToastTitle>{variant === "destructive" ? "Delete failed" : "Scheduled"}</ToastTitle>
          <ToastDescription>
            {variant === "destructive"
              ? "The item could not be deleted. Try again."
              : "Your report is scheduled for Friday at 9:00 AM."}
          </ToastDescription>
        </div>
        <ToastAction altText="Undo the last action">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const Destructive: Story = {
  render: () => <ToastDemo variant="destructive" />,
};
