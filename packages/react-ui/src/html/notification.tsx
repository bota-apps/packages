/**
 * html/notification — variant-styled toast notification container <div>s.
 *
 * Used by the ToastNotification component.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const notificationVariants = cva(
  "flex items-center gap-3 text-white p-4 rounded-lg shadow-lg pointer-events-auto",
  {
    variants: {
      variant: {
        success: "bg-green-500 dark:bg-green-600",
        error: "bg-red-500 dark:bg-red-600",
        warning: "bg-yellow-500 dark:bg-yellow-600",
        info: "bg-blue-500 dark:bg-blue-600",
        notification: "bg-purple-500 dark:bg-purple-600",
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
      success: "text-green-50",
      error: "text-red-50",
      warning: "text-yellow-50",
      info: "text-blue-50",
      notification: "text-purple-50",
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
