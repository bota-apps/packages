// The cva styling for ToastNotification lives in ../html/notification.tsx —
// the html layer stays the source of truth; this module re-exports it.
export { notificationVariants, notificationIconVariants } from "../html/notification";
export type { NotificationVariant } from "../html/notification";
