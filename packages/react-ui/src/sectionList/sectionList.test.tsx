import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SectionList, sectionListItemVariants, type SectionListSection } from "./index";

type Project = { id: string; name: string };

const sections: SectionListSection<Project>[] = [
  {
    key: "engineering",
    title: "Engineering",
    description: "Product team",
    data: [
      { id: "e1", name: "Jane Doe" },
      { id: "e2", name: "John Smith" },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    data: [{ id: "f1", name: "Ada Lovelace" }],
  },
];

function renderList(props: { onItemClick?: (item: Project) => void; divided?: boolean } = {}) {
  return render(
    <SectionList<Project>
      sections={sections}
      renderItem={(item) => <span>{item.name}</span>}
      keyExtractor={(item) => item.id}
      {...props}
    />,
  );
}

afterEach(cleanup);

describe("SectionList", () => {
  it("renders section titles, descriptions, and items", () => {
    renderList();
    expect(screen.getByRole("heading", { name: "Engineering" })).toBeTruthy();
    expect(screen.getByText("Product team")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Finance" })).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  });

  it("collapses and expands a section from its header", async () => {
    const user = userEvent.setup();
    renderList();
    const header = screen.getByRole("heading", { name: "Engineering" }).closest("button");
    expect(header).toBeTruthy();

    await user.click(header!);
    expect(screen.queryByText("Jane Doe")).toBe(null);
    // Other sections are unaffected.
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();

    await user.click(header!);
    expect(screen.getByText("Jane Doe")).toBeTruthy();
  });

  it("makes items interactive when onItemClick is provided", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderList({ onItemClick });

    const item = screen.getByText("John Smith").closest('[role="button"]') as HTMLElement;
    expect(item.className).toContain("cursor-pointer");
    await user.click(item);
    expect(onItemClick).toHaveBeenCalledWith({ id: "e2", name: "John Smith" });

    item.focus();
    await user.keyboard("{Enter}");
    expect(onItemClick).toHaveBeenCalledTimes(2);
  });

  it("applies divider classes between items in divided mode", () => {
    renderList({ divided: true });
    const first = screen.getByText("Jane Doe").parentElement as HTMLElement;
    const last = screen.getByText("John Smith").parentElement as HTMLElement;
    expect(first.className).toContain("border-b");
    expect(last.className).not.toContain("border-b");
    expect(sectionListItemVariants({ divided: true })).toContain("border-border/40");
  });

  it("renders the empty component when there are no sections", () => {
    render(
      <SectionList<Project>
        sections={[]}
        renderItem={(item) => <span>{item.name}</span>}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<p>No sections yet</p>}
      />,
    );
    expect(screen.getByText("No sections yet")).toBeTruthy();
  });
});
