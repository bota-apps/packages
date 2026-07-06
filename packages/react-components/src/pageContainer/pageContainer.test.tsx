import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageContainer } from "./index";

describe("PageContainer", () => {
  it("sets the document title and renders heading, description, and ready content", () => {
    render(
      <PageContainer
        title="Projects — Bota Console"
        heading="Projects"
        description="Everyone in your organization"
        state={{ kind: "ready" }}
      >
        <p>List content</p>
      </PageContainer>,
    );

    expect(document.title).toBe("Projects — Bota Console");
    expect(screen.getByText("Projects")).toBeTruthy();
    expect(screen.getByText("Everyone in your organization")).toBeTruthy();
    expect(screen.getByText("List content")).toBeTruthy();
  });

  it("shows the stale-data warning alongside ready content", () => {
    render(
      <PageContainer title="Projects" state={{ kind: "ready", warning: "Showing stale data" }}>
        <p>List content</p>
      </PageContainer>,
    );

    expect(screen.getByRole("alert").textContent).toContain("Showing stale data");
    expect(screen.getByText("List content")).toBeTruthy();
  });

  it("renders the loading state instead of children", () => {
    render(
      <PageContainer title="Projects" state={{ kind: "loading" }}>
        <p>List content</p>
      </PageContainer>,
    );

    expect(screen.queryByText("List content")).toBeNull();
  });

  it("renders the error state with a retry action", async () => {
    const onRetry = vi.fn();
    render(
      <PageContainer
        title="Projects"
        state={{ kind: "error", title: "Failed to load", onRetry, retryLabel: "Retry" }}
      />,
    );

    expect(screen.getByText("Failed to load")).toBeTruthy();
    screen.getByRole("button", { name: /Retry/ }).click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders the empty state config", () => {
    render(
      <PageContainer
        title="Projects"
        state={{ kind: "empty", title: "No projects", description: "Add your first project." }}
      />,
    );

    expect(screen.getByText("No projects")).toBeTruthy();
    expect(screen.getByText("Add your first project.")).toBeTruthy();
  });

  it("hides the footer outside ready by default and honors showFooterWhen", () => {
    const { rerender } = render(
      <PageContainer title="T" state={{ kind: "loading" }} footer={<p>Footer</p>} />,
    );
    expect(screen.queryByText("Footer")).toBeNull();

    rerender(
      <PageContainer
        title="T"
        state={{ kind: "loading" }}
        footer={<p>Footer</p>}
        showFooterWhen="always"
      />,
    );
    expect(screen.getByText("Footer")).toBeTruthy();
  });
});
