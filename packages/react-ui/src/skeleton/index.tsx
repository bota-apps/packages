import { SkeletonEl, type SkeletonElProps } from "../html";

export type SkeletonProps = SkeletonElProps;

function Skeleton(props: SkeletonProps) {
  return <SkeletonEl {...props} />;
}

export { Skeleton };
export * from "./variants";
