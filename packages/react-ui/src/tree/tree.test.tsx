import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Tree, treeRootVariants, type TreeNodeData } from "./index";

type Unit = { name: string };

const orgChart: TreeNodeData<Unit> = {
  id: "ceo",
  data: { name: "CEO" },
  children: [
    { id: "cto", data: { name: "CTO" } },
    { id: "cfo", data: { name: "CFO" } },
  ],
};

afterEach(cleanup);

describe("Tree", () => {
  it("renders every node with tree semantics", () => {
    render(
      <Tree
        data={orgChart}
        renderNode={(node, ctx) => (
          <button type="button" onClick={ctx.toggle}>
            {node.data.name}
          </button>
        )}
      />,
    );
    expect(screen.getByRole("tree")).toBeTruthy();
    expect(screen.getAllByRole("treeitem")).toHaveLength(3);
    expect(screen.getByText("CEO")).toBeTruthy();
    expect(screen.getByText("CTO")).toBeTruthy();
    expect(screen.getByText("CFO")).toBeTruthy();
  });

  it("collapses and expands children via the toggle in the node context", async () => {
    const user = userEvent.setup();
    render(
      <Tree
        data={orgChart}
        renderNode={(node, ctx) => (
          <button type="button" onClick={ctx.toggle}>
            {node.data.name}
          </button>
        )}
      />,
    );
    await user.click(screen.getByText("CEO"));
    expect(screen.queryByText("CTO")).not.toBeTruthy();
    await user.click(screen.getByText("CEO"));
    expect(screen.getByText("CTO")).toBeTruthy();
  });

  it("renders the empty component for an empty forest", () => {
    render(
      <Tree<Unit>
        data={[]}
        renderNode={(node) => <span>{node.data.name}</span>}
        EmptyComponent={<p>Nothing to show</p>}
      />,
    );
    expect(screen.getByText("Nothing to show")).toBeTruthy();
  });

  it("applies the size variant on the tree root", () => {
    render(<Tree data={orgChart} size="sm" renderNode={(node) => <span>{node.data.name}</span>} />);
    const root = screen.getByRole("tree");
    expect(root.className).toContain("py-2");
    expect(root.className).toContain(treeRootVariants({ size: "sm" }).split(" ")[0]);
  });
});
