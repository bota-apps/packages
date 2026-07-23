/**
 * html/notification — variant-styled toast notification container <div>s.
 *
 * Used by the ToastNotification component.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const notificationVariants = cva(
  "flex items-center gap-3 p-4 rounded-lg shadow-floating pointer-events-auto",
  {
    variants: {
      variant: {
        success: "bg-status-success text-status-success-foreground",
        error: "bg-status-danger text-status-danger-foreground",
        warning: "bg-status-warning text-status-warning-foreground",
        info: "bg-status-info text-status-info-foreground",
        notification: "bg-primary text-primary-foreground",
      },
    },
  },
);

export type NotificationVariant = NonNullable<VariantProps<typeof notificationVariants>["variant"]>;

export type NotificationElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof notificationVariants>;

export const NotificationEl = forwardRef<HTMLDivElement, NotificationElProps>(
  function NotificationEl({ variant, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(notificationVariants({ variant }), className)} {...props} />
    );
  },
);

/* Icon wrapper — matches the icon color to the notification variant */

export const notificationIconVariants = cva("flex-shrink-0", {
  variants: {
    variant: {
      success: "text-status-success-foreground",
      error: "text-status-danger-foreground",
      warning: "text-status-warning-foreground",
      info: "text-status-info-foreground",
      notification: "text-primary-foreground",
    },
  },
});

export type NotificationIconElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof notificationIconVariants>;

export const NotificationIconEl = forwardRef<HTMLDivElement, NotificationIconElProps>(
  function NotificationIconEl({ variant, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(notificationIconVariants({ variant }), className)} {...props} />
    );
  },
);

/* ------------------------------------------------------------------ */
/* ToastContainerEl — fixed, pointer-events-none toast overlay          */
/* ------------------------------------------------------------------ */

export const ToastContainerEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ToastContainerEl(props, ref) {
    return (
      <div
        ref={ref}
        className="fixed inset-0 pointer-events-none flex items-center justify-center gap-2 p-4"
        {...props}
      />
    );
  },
);
