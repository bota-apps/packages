import { FormEl, type FormElProps } from "../html";

export type FormProps = FormElProps;

export function Form({ ...props }: FormProps) {
  return <FormEl {...props} />;
}

export * from "./variants";
