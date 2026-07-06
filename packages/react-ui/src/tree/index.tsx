import { useState, type ReactNode } from "react";
import {
  TreeRootEl,
  TreeBranchEl,
  TreeChildrenEl,
  TreeChildWrapperEl,
  TreeVerticalLineEl,
  Div,
} from "../html";

export * from "./variants";

type TreeNodeData<T> = {
  id: string;
  data: T;
  children?: TreeNodeData<T>[];
};

type TreeNodeContext = {
  depth: number;
  isLeaf: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  childCount: number;
};

type TreeProps<T> = {
  data: TreeNodeData<T> | TreeNodeData<T>[];
  renderNode: (node: TreeNodeData<T>, ctx: TreeNodeContext) => ReactNode;
  defaultCollapsedIds?: Set<string>;
  size?: "sm" | "md" | "lg";
  connectors?: boolean;
  leafStack?: boolean;
  EmptyComponent?: ReactNode;
  align?: "center" | "start";
};

function getPosition(index: number, total: number): "first" | "middle" | "last" | "only" {
  if (total === 1) {
    return "only";
  }
  if (index === 0) {
    return "first";
  }
  if (index === total - 1) {
    return "last";
  }
  return "middle";
}

function TreeBranchNode<T>({
  node,
  renderNode,
  collapsedIds,
  toggleNode,
  size,
  connectors,
  leafStack,
  depth,
  align,
}: {
  node: TreeNodeData<T>;
  renderNode: TreeProps<T>["renderNode"];
  collapsedIds: Set<string>;
  toggleNode: (id: string) => void;
  size: "sm" | "md" | "lg";
  connectors: boolean;
  leafStack?: boolean;
  depth: number;
  align: "center" | "start";
}) {
  const children = node.children ?? [];
  const isLeaf = children.length === 0;
  const isCollapsed = collapsedIds.has(node.id);
  const visibleChildren = isCollapsed ? [] : children;

  const ctx: TreeNodeContext = {
    depth,
    isLeaf,
    isCollapsed,
    toggle: () => toggleNode(node.id),
    childCount: children.length,
  };

  const allChildrenAreLeaves =
    leafStack && visibleChildren.length > 0 && visibleChildren.every((c) => !c.children?.length);

  return (
    <TreeBranchEl align={align} className={depth === 0 ? "w-fit items-stretch" : undefined}>
      {renderNode(node, ctx)}
      {connectors && visibleChildren.length > 0 && <TreeVerticalLineEl size={size} />}
      {allChildrenAreLeaves ? (
        <div className="flex flex-col gap-2 w-full">
          {visibleChildren.map((child) => {
            const leafCtx: TreeNodeContext = {
              depth: depth + 1,
              isLeaf: true,
              isCollapsed: false,
              toggle: () => toggleNode(child.id),
              childCount: 0,
            };
            return (
              <Div key={child.id} className="w-full">
                {renderNode(child, leafCtx)}
              </Div>
            );
          })}
        </div>
      ) : visibleChildren.length > 0 ? (
        <TreeChildrenEl align={align}>
          {visibleChildren.map((child, i) => (
            <TreeChildWrapperEl
              key={child.id}
              position={getPosition(i, visibleChildren.length)}
              size={size}
              connectors={connectors}
            >
              <TreeBranchNode
                node={child}
                renderNode={renderNode}
                collapsedIds={collapsedIds}
                toggleNode={toggleNode}
                size={size}
                connectors={connectors}
                leafStack={leafStack}
                depth={depth + 1}
                align={align}
              />
            </TreeChildWrapperEl>
          ))}
        </TreeChildrenEl>
      ) : undefined}
    </TreeBranchEl>
  );
}

export function Tree<T>({
  data,
  renderNode,
  defaultCollapsedIds,
  size = "md",
  connectors = true,
  leafStack,
  EmptyComponent,
  align = "center",
}: TreeProps<T>) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(
    () => defaultCollapsedIds ?? new Set(),
  );

  const roots = Array.isArray(data) ? data : [data];

  if (roots.length === 0 && EmptyComponent) {
    return <>{EmptyComponent}</>;
  }

  const toggleNode = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (roots.length === 1) {
    return (
      <TreeRootEl size={size}>
        <TreeBranchNode
          node={roots[0]}
          renderNode={renderNode}
          collapsedIds={collapsedIds}
          toggleNode={toggleNode}
          size={size}
          connectors={connectors}
          leafStack={leafStack}
          depth={0}
          align={align}
        />
      </TreeRootEl>
    );
  }

  return (
    <TreeRootEl size={size}>
      <TreeChildrenEl align={align}>
        {roots.map((root, i) => (
          <TreeChildWrapperEl
            key={root.id}
            position={getPosition(i, roots.length)}
            size={size}
            connectors={connectors}
          >
            <TreeBranchNode
              node={root}
              renderNode={renderNode}
              collapsedIds={collapsedIds}
              toggleNode={toggleNode}
              size={size}
              connectors={connectors}
              leafStack={leafStack}
              depth={0}
              align={align}
            />
          </TreeChildWrapperEl>
        ))}
      </TreeChildrenEl>
    </TreeRootEl>
  );
}

export type { TreeNodeData, TreeNodeContext, TreeProps };
