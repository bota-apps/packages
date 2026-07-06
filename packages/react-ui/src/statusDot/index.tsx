import { statusDotVariants, type StatusDotProps } from "./variants";

export function StatusDot({ status, size }: StatusDotProps) {
  return <span className={statusDotVariants({ status, size })} />;
}

export * from "./variants";
