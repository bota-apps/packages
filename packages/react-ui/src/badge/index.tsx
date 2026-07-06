import { BadgeEl, type BadgeElProps } from "../html";

export type BadgeProps = BadgeElProps;

function Badge(props: BadgeProps) {
  return <BadgeEl {...props} />;
}

export { Badge };
export * from "./variants";
