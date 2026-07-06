import { useState, type ReactNode, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { SectionListSectionEl, SectionListHeaderEl, SectionListContentEl, Div } from "../html";
import { cn } from "../lib/utils";
import { Stack, Grid, Inline } from "../layout";
import { Heading, Text } from "../typography";
import { Card, type CardProps } from "../card";
import { sectionListItemVariants, sectionListExpandTriggerVariants } from "./variants";

export * from "./variants";

type SectionListSection<T> = {
  key: string;
  title: string;
  description?: string;
  data: T[];
  /** Content rendered inline next to the title (e.g. a badge) */
  titleRight?: ReactNode;
  headerRight?: ReactNode;
};

type SectionListCardOptions = Omit<CardProps, "children">;

type SectionListBaseProps<T> = {
  sections: SectionListSection<T>[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  onItemClick?: (item: T) => void;
  renderSectionHeader?: (
    section: SectionListSection<T>,
    ctx: { isExpanded: boolean; toggle: () => void },
  ) => ReactNode;
  collapsible?: boolean;
  defaultCollapsedKeys?: Set<string>;
  ListEmptyComponent?: ReactNode;
  SectionEmptyComponent?: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  columns?: 1 | 2 | 3 | 4;
  /** Render a light bottom border between items instead of gap spacing */
  divided?: boolean;
  /** Extract children from an item for recursive rendering */
  getChildren?: (item: T) => T[] | undefined;
};

type SectionListDefaultProps<T> = SectionListBaseProps<T> & {
  variant?: "default";
};

type SectionListCardProps<T> = SectionListBaseProps<T> & {
  variant: "card";
  cardProps: SectionListCardOptions;
};

type SectionListProps<T> = SectionListDefaultProps<T> | SectionListCardProps<T>;

function DefaultSectionHeader<T>({
  section,
  isExpanded,
  toggle,
  collapsible,
}: {
  section: SectionListSection<T>;
  isExpanded: boolean;
  toggle: () => void;
  collapsible: boolean;
}) {
  if (collapsible) {
    return (
      <SectionListHeaderEl data-state={isExpanded ? "open" : "closed"} onClick={toggle}>
        <ChevronDown />
        <Stack gap="xs" className="flex-1 min-w-0">
          <Inline gap="sm" align="center">
            <Heading size="xs">{section.title}</Heading>
            {section.titleRight}
          </Inline>
          {section.description ? (
            <Text size="sm" tone="muted">
              {section.description}
            </Text>
          ) : undefined}
        </Stack>
        {section.headerRight ? <Inline gap="sm">{section.headerRight}</Inline> : undefined}
      </SectionListHeaderEl>
    );
  }

  return (
    <Inline gap="sm" className="px-4 py-3">
      <Stack gap="xs" className="flex-1 min-w-0">
        <Inline gap="sm" align="center">
          <Heading size="xs">{section.title}</Heading>
          {section.titleRight}
        </Inline>
        {section.description ? (
          <Text size="sm" tone="muted">
            {section.description}
          </Text>
        ) : undefined}
      </Stack>
      {section.headerRight ? <Inline gap="sm">{section.headerRight}</Inline> : undefined}
    </Inline>
  );
}

function ItemDiv<T>({
  item,
  onItemClick,
  className,
  children,
}: {
  item: T;
  onItemClick?: (item: T) => void;
  className?: string;
  children: ReactNode;
}) {
  const cls =
    cn(className, sectionListItemVariants({ interactive: Boolean(onItemClick) })) || undefined;

  return (
    <Div
      className={cls}
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
      {children}
    </Div>
  );
}

function ExpandableItem<T>({
  item,
  index,
  renderItem,
  keyExtractor,
  getChildren,
  onItemClick,
  divided,
  isLast,
  itemChildren,
}: {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  getChildren?: (item: T) => T[] | undefined;
  onItemClick?: (item: T) => void;
  divided: boolean;
  isLast: boolean;
  itemChildren: T[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={sectionListItemVariants({ divided: divided && !isLast })}>
      <button
        type="button"
        className={sectionListExpandTriggerVariants()}
        data-state={expanded ? "open" : "closed"}
        onClick={() => setExpanded((v) => !v)}
      >
        <ChevronDown className="h-4 w-4" />
        <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
      </button>
      {expanded && (
        <div className="pl-6 pb-2">
          <ItemList
            items={itemChildren}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getChildren={getChildren}
            onItemClick={onItemClick}
            divided={divided}
          />
        </div>
      )}
    </div>
  );
}

function ItemList<T>({
  items,
  renderItem,
  keyExtractor,
  getChildren,
  onItemClick,
  divided,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  getChildren?: (item: T) => T[] | undefined;
  onItemClick?: (item: T) => void;
  divided: boolean;
}) {
  return (
    <div>
      {items.map((item, index) => {
        const children = getChildren?.(item);
        const key = keyExtractor(item, index);
        const isLast = index === items.length - 1;

        if (children && children.length > 0) {
          return (
            <ExpandableItem
              key={key}
              item={item}
              index={index}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getChildren={getChildren}
              onItemClick={onItemClick}
              divided={divided}
              isLast={isLast}
              itemChildren={children}
            />
          );
        }

        return (
          <ItemDiv
            key={key}
            item={item}
            onItemClick={onItemClick}
            className={cn("py-2", sectionListItemVariants({ divided: divided && !isLast }))}
          >
            {renderItem(item, index)}
          </ItemDiv>
        );
      })}
    </div>
  );
}

export function SectionList<T>(props: SectionListProps<T>) {
  const {
    sections,
    renderItem,
    keyExtractor,
    onItemClick,
    renderSectionHeader,
    collapsible = true,
    defaultCollapsedKeys,
    ListEmptyComponent,
    SectionEmptyComponent,
    gap = "md",
    columns = 1,
    divided = false,
    variant,
    getChildren,
  } = props;

  const cardOptions = variant === "card" ? props.cardProps : undefined;

  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(
    () => defaultCollapsedKeys ?? new Set(),
  );

  if (sections.length === 0 && ListEmptyComponent) {
    if (cardOptions) {
      return <Card {...cardOptions}>{ListEmptyComponent}</Card>;
    }
    return <>{ListEmptyComponent}</>;
  }

  const toggle = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const content = (
    <Stack gap={gap}>
      {sections.map((section) => {
        const isExpanded = !collapsedKeys.has(section.key);

        return (
          <SectionListSectionEl key={section.key}>
            {renderSectionHeader ? (
              renderSectionHeader(section, {
                isExpanded,
                toggle: () => toggle(section.key),
              })
            ) : (
              <DefaultSectionHeader
                section={section}
                isExpanded={isExpanded}
                toggle={() => toggle(section.key)}
                collapsible={collapsible}
              />
            )}
            {isExpanded && (
              <SectionListContentEl>
                {section.data.length === 0 && SectionEmptyComponent ? (
                  <>{SectionEmptyComponent}</>
                ) : columns > 1 ? (
                  <Grid columns={columns} gap="xs">
                    {section.data.map((item, index) => (
                      <ItemDiv
                        key={keyExtractor(item, index)}
                        item={item}
                        onItemClick={onItemClick}
                      >
                        {renderItem(item, index)}
                      </ItemDiv>
                    ))}
                  </Grid>
                ) : divided ? (
                  <ItemList
                    items={section.data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getChildren={getChildren}
                    onItemClick={onItemClick}
                    divided
                  />
                ) : (
                  <ItemList
                    items={section.data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getChildren={getChildren}
                    onItemClick={onItemClick}
                    divided={false}
                  />
                )}
              </SectionListContentEl>
            )}
          </SectionListSectionEl>
        );
      })}
    </Stack>
  );

  if (cardOptions) {
    return <Card {...cardOptions}>{content}</Card>;
  }

  return content;
}

export type { SectionListSection, SectionListProps, SectionListCardOptions };
