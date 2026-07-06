import * as React from "react";
import { Message, type MessageProps } from "../message";
import { AlertTitleEl, AlertDescriptionEl } from "../html";

export * from "./variants";

/**
 * Alert — an accessible message with role="alert".
 * Builds on Message; all MessageProps are supported.
 */
const Alert = React.forwardRef<HTMLDivElement, MessageProps>((props, ref) => (
  <Message ref={ref} role="alert" {...props} />
));
Alert.displayName = "Alert";

/** Optional title row inside an Alert when composing with children. */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => <AlertTitleEl ref={ref} {...props} />);
AlertTitle.displayName = "AlertTitle";

/** Optional description row inside an Alert when composing with children. */
const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <AlertDescriptionEl ref={ref} {...props} />,
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
