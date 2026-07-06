import * as React from "react";
import { LabelEl, type LabelElProps } from "../html";

export type LabelProps = LabelElProps;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => (
  <LabelEl ref={ref} {...props} />
));
Label.displayName = "Label";

const Description = React.forwardRef<HTMLLabelElement, LabelProps>(({ ...props }, ref) => (
  <LabelEl ref={ref} variant="description" {...props} />
));
Description.displayName = "Description";

export { Label, Description };
export * from "./variants";
