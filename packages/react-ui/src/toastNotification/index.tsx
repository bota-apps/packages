import {
  X,
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { ButtonEl } from "../html";
import {
  NotificationEl,
  NotificationIconEl,
  type NotificationVariant,
  ToastContainerEl,
} from "../html";
import { Div, Span } from "../html";

export * from "./variants";

const toastIcons: Record<NotificationVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  notification: Bell,
};

type ToastNotificationProps = {
  variant: NotificationVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
};

export function ToastNotification({
  variant,
  title,
  description,
  onDismiss,
}: ToastNotificationProps) {
  const Icon = toastIcons[variant];
  return (
    <NotificationEl variant={variant}>
      {Icon && (
        <NotificationIconEl variant={variant}>
          <Icon size={20} aria-hidden="true" />
        </NotificationIconEl>
      )}
      <Div layout="col" grow>
        <Span weight="semibold" truncate>
          {title}
        </Span>
        {description && (
          <Span size="sm" opacity="90" lineClamp="2">
            {description}
          </Span>
        )}
      </Div>
      {onDismiss && (
        <ButtonEl variant="ghost-dismiss" size="icon" onClick={onDismiss} aria-label="Dismiss">
          <X />
        </ButtonEl>
      )}
    </NotificationEl>
  );
}

type ToastContainerProps = {
  children: ReactNode;
};

export function ToastContainer({ children }: ToastContainerProps) {
  return <ToastContainerEl>{children}</ToastContainerEl>;
}
