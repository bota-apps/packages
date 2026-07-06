import { ButtonEl, type ButtonElProps } from "../html";

export * from "./variants";

type FABProps = Omit<ButtonElProps, "variant" | "size" | "position"> & {
  position?: "bottom-right" | "bottom-left";
};

export function FAB({ position = "bottom-right", ...props }: FABProps) {
  return <ButtonEl variant="fab" size="fab" position={position} {...props} />;
}
