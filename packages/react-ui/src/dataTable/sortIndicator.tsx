import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortIndicatorProps = {
  direction: "asc" | "desc" | false;
};

export function SortIndicator({ direction }: SortIndicatorProps) {
  const className = "ml-1 inline h-3.5 w-3.5";

  if (direction === "asc") {
    return <ArrowUp className={className} />;
  }
  if (direction === "desc") {
    return <ArrowDown className={className} />;
  }
  return <ArrowUpDown className={className + " opacity-40"} />;
}
