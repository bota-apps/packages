import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Download } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { toRoutePath } from "../routeLink";
import { DeleteAction } from "./deleteAction";
import { EditAction } from "./editAction";
import { PageActions } from "./pageActions";
import { RowActionButton } from "./rowActionButton";
import { RowActions } from "./rowActions";

function renderInRouter(ui: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("RowActionButton", () => {
  it("announces its label and fires onClick", async () => {
    const onClick = vi.fn();
    render(
      <RowActions>
        <RowActionButton icon={Download} onClick={onClick} label="Download report" />
      </RowActions>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Download report" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("EditAction", () => {
  it("links to the edit route", async () => {
    renderInRouter(<EditAction to={toRoutePath("/projects/42/edit")} label="Edit" />);

    const link = await screen.findByRole("link", { name: /Edit/ });
    expect(link.getAttribute("href")).toBe("/projects/42/edit");
  });
});

describe("DeleteAction", () => {
  it("confirms before invoking onConfirm", async () => {
    const onConfirm = vi.fn();
    render(
      <PageActions>
        <DeleteAction
          title="Delete project?"
          description="This cannot be undone."
          confirmLabel="Delete"
          onConfirm={onConfirm}
        />
      </PageActions>,
    );

    await userEvent.click(screen.getByRole("button", { name: /Delete/ }));
    expect(onConfirm).not.toHaveBeenCalled();

    // The trigger is also named "Delete" — scope the click to the dialog.
    const dialog = await screen.findByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
