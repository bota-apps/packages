import {
  LoadingContainerEl,
  type LoadingContainerElProps,
  LoadingInnerEl,
  SpinnerEl,
  P,
} from "../html";

type LoadingProps = Pick<LoadingContainerElProps, "variant"> & {
  text?: string;
  size?: "sm" | "default" | "lg";
};

export function Loading({ variant = "section", size = "default", text }: LoadingProps) {
  return (
    <LoadingContainerEl variant={variant}>
      <LoadingInnerEl orientation={variant !== "inline" ? "vertical" : "horizontal"}>
        <SpinnerEl size={size} />
        {text && <P variant="muted">{text}</P>}
      </LoadingInnerEl>
    </LoadingContainerEl>
  );
}

export { LoadingBusiness } from "./loadingBusiness";
export * from "./variants";
