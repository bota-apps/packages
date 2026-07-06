import {
  LoadingContainerEl,
  type LoadingContainerElProps,
  LoadingInnerEl,
  SpinnerEl,
  P,
} from "../html";

type LoadingBusinessProps = Pick<LoadingContainerElProps, "variant"> & {
  text?: string;
  size?: "sm" | "default" | "lg";
};

export function LoadingBusiness({
  variant = "section",
  size = "default",
  text,
}: LoadingBusinessProps) {
  return (
    <LoadingContainerEl variant={variant}>
      <LoadingInnerEl orientation={variant !== "inline" ? "vertical" : "horizontal"}>
        <SpinnerEl size={size} />
        {text && <P variant="muted">{text}</P>}
      </LoadingInnerEl>
    </LoadingContainerEl>
  );
}
