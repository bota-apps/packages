import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TileEl, TileIconEl, Div, P } from "../html";
import { cn } from "../lib/utils";
import { quickLinkGridVariants } from "./variants";

export * from "./variants";

type QuickLinkVariant = "default" | "grid";

type QuickLinkProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
  suffix?: ReactNode;
  children?: never;
  variant?: QuickLinkVariant;
  className?: string;
};

export function QuickLink({
  icon: Icon,
  label,
  description,
  suffix,
  variant,
  className,
}: QuickLinkProps) {
  const layout = variant === "grid" ? "grid" : "row";
  return (
    <TileEl layout={layout} className={className}>
      <TileIconEl layout={layout}>
        <Icon />
      </TileIconEl>

      <Div layout="col" className="flex-1 min-w-0">
        <P className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
          {label}
        </P>
        {description && (
          <P className="mt-0.5 text-xs text-muted-foreground leading-snug truncate">
            {description}
          </P>
        )}
      </Div>

      {suffix}

      <ChevronRight className="shrink-0 size-4 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" />
    </TileEl>
  );
}

type QuickLinkGridProps = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
};

export function QuickLinkGrid({ children, columns = 3, className }: QuickLinkGridProps) {
  return <Div className={cn(quickLinkGridVariants({ columns }), className)}>{children}</Div>;
}
