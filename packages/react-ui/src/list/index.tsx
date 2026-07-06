import { type ReactNode, type KeyboardEvent } from "react";
import { Grid, Inline } from "../layout";
import { Div } from "../html";
import { Card } from "../card";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";
import { listItemVariants } from "./variants";

export * from "./variants";

type GridColumns = NonNullable<ComponentPropsWithoutRef<typeof Grid>["columns"]>;
type GridGap = NonNullable<ComponentPropsWithoutRef<typeof Grid>["gap"]>;

type ListVariant = "plain" | "divided";

type ListPropsBase<T> = {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  onItemClick?: (item: T) => void;
  ListEmptyComponent?: ReactNode;
  ListHeaderComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  ItemSeparatorComponent?: ReactNode;
  direction?: "vertical" | "horizontal";
  variant?: ListVariant;
  columns?: GridColumns;
  gap?: GridGap;
  className?: string;
  itemClassName?: string;
};

type ListProps<T> = ListPropsBase<T> &
  ({ layout?: "default" } | { layout: "card"; title: string; headerRight?: ReactNode });

export function List<T>(props: ListProps<T>) {
  const {
    data,
    renderItem,
    keyExtractor,
    onItemClick,
    ListEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent,
    ItemSeparatorComponent,
    direction = "vertical",
    variant = "plain",
    columns,
    gap,
    className,
    itemClassName,
  } = props;

  const isCard = props.layout === "card";

  if (data.length === 0 && ListEmptyComponent) {
    if (isCard) {
      return (
        <Card title={props.title} headerRight={props.headerRight}>
          {ListEmptyComponent}
        </Card>
      );
    }
    return <>{ListEmptyComponent}</>;
  }

  const isDivided = variant === "divided";
  const resolvedItemClassName =
    cn(listItemVariants({ variant, clickable: onItemClick ? true : undefined }), itemClassName) ||
    undefined;

  const items = (
    <>
      {ListHeaderComponent}
      {data.map((item, index) => (
        <Div
          key={keyExtractor(item, index)}
          className={resolvedItemClassName}
          role={onItemClick ? "button" : undefined}
          tabIndex={onItemClick ? 0 : undefined}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
          onKeyDown={
            onItemClick
              ? (e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onItemClick(item);
                  }
                }
              : undefined
          }
        >
          {index > 0 && !isDivided && ItemSeparatorComponent}
          {renderItem(item, index)}
        </Div>
      ))}
      {ListFooterComponent}
    </>
  );

  const content =
    direction === "horizontal" ? (
      <Inline gap={gap} className={className}>
        {items}
      </Inline>
    ) : (
      <Grid columns={columns} gap={gap} className={className}>
        {items}
      </Grid>
    );

  if (isCard) {
    return (
      <Card title={props.title} headerRight={props.headerRight}>
        {content}
      </Card>
    );
  }

  return content;
}
