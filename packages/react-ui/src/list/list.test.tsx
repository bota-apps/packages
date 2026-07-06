import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { List, listItemVariants } from "./index";

type Task = { id: string; title: string };

const tasks: Task[] = [
  { id: "t1", title: "Review project plan" },
  { id: "t2", title: "Approve design draft" },
];

afterEach(cleanup);

describe("List", () => {
  it("renders one entry per data item", () => {
    render(
      <List data={tasks} keyExtractor={(t) => t.id} renderItem={(t) => <span>{t.title}</span>} />,
    );
    expect(screen.getByText("Review project plan")).toBeTruthy();
    expect(screen.getByText("Approve design draft")).toBeTruthy();
  });

  it("renders the empty component when there is no data", () => {
    render(
      <List<Task>
        data={[]}
        keyExtractor={(t) => t.id}
        renderItem={(t) => <span>{t.title}</span>}
        ListEmptyComponent={<p>No tasks yet</p>}
      />,
    );
    expect(screen.getByText("No tasks yet")).toBeTruthy();
  });

  it("applies the divided variant class to items", () => {
    render(
      <List
        data={tasks}
        variant="divided"
        keyExtractor={(t) => t.id}
        renderItem={(t) => <span>{t.title}</span>}
      />,
    );
    const item = screen.getByText("Review project plan").parentElement;
    expect(item?.className).toContain("border-b");
    expect(item?.className).toContain(listItemVariants({ variant: "divided" }).trim());
  });

  it("makes items clickable and keyboard-activatable when onItemClick is set", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(
      <List
        data={tasks}
        onItemClick={onItemClick}
        keyExtractor={(t) => t.id}
        renderItem={(t) => <span>{t.title}</span>}
      />,
    );
    const item = screen.getByText("Review project plan").parentElement as HTMLElement;
    expect(item.getAttribute("role")).toBe("button");
    expect(item.className).toContain("cursor-pointer");
    await user.click(item);
    expect(onItemClick).toHaveBeenCalledWith(tasks[0]);
  });
});
