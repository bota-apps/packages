import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ListItem, listItemRowVariants } from "./index";

afterEach(cleanup);

describe("ListItem", () => {
  it("renders title, description, and slots", () => {
    render(
      <ListItem
        left={<span>L</span>}
        title="Jane Doe"
        description="Software Engineer"
        right={<span>R</span>}
        extra={<span>badge</span>}
      />,
    );
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("Software Engineer")).toBeTruthy();
    expect(screen.getByText("L")).toBeTruthy();
    expect(screen.getByText("R")).toBeTruthy();
    expect(screen.getByText("badge")).toBeTruthy();
  });

  it("omits the description when not provided", () => {
    render(<ListItem title="Only title" />);
    expect(screen.getByText("Only title")).toBeTruthy();
    expect(screen.queryByText("Software Engineer")).toBeNull();
  });

  it("applies the clickable affordance and fires onClick", () => {
    const onClick = vi.fn();
    render(<ListItem title="Clickable" onClick={onClick} className="probe" />);
    const row = screen.getByText("Clickable").closest(".probe") as HTMLElement;
    expect(row.className).toContain("cursor-pointer");
    fireEvent.click(row);
    expect(onClick).toHaveBeenCalledOnce();
    expect(listItemRowVariants({ clickable: true })).toContain("hover:bg-muted/50");
  });
});
