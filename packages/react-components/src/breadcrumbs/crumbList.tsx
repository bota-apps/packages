import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Badge, Inline, List, Text } from "@bota-apps/react-ui";
import { RouteLink } from "../routeLink";
import { OverflowCrumb } from "./overflowCrumb";
import { breadcrumbItemVariants } from "./variants";
import type { BreadcrumbDisplayItem } from "./displayItems";
import type { BreadcrumbVariant } from "./types";

// The three visual variants differ only in separator glyph and how the current
// (unlinked) crumb renders — one list, one config map.
const separators: Record<BreadcrumbVariant, ReactNode> = {
  slash: "/",
  pill: <ChevronRight size={14} />,
  highlighted: <ChevronRight size={14} />,
};

function CurrentCrumb({ variant, label }: { variant: BreadcrumbVariant; label: string }) {
  if (variant === "highlighted") {
    return (
      <Badge variant="secondary">
        <Text as="span" tone="default" size="sm" weight="semibold">
          {label}
        </Text>
      </Badge>
    );
  }
  return (
    <Text as="span" tone="default" size="sm" weight="medium">
      {label}
    </Text>
  );
}

type CrumbListProps = {
  items: BreadcrumbDisplayItem[];
  variant: BreadcrumbVariant;
};

export function CrumbList({ items, variant }: CrumbListProps) {
  return (
    <List
      data={items}
      direction="horizontal"
      keyExtractor={(item, index) =>
        item.kind === "overflow" ? `overflow-${index}` : `${item.label}-${index}`
      }
      renderItem={(item, index) => (
        <Inline gap="xs" className={breadcrumbItemVariants()}>
          {index > 0 && (
            <Text as="span" tone="muted" size="sm">
              {separators[variant]}
            </Text>
          )}
          {item.kind === "overflow" ? (
            <OverflowCrumb hidden={item.hidden} />
          ) : item.to ? (
            <RouteLink variant="text" to={item.to} label={item.label} />
          ) : (
            <CurrentCrumb variant={variant} label={item.label} />
          )}
        </Inline>
      )}
    />
  );
}
