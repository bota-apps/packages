import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RegistrationSchema } from "@bota-apps/types";
import { DynamicForm } from "./index";

afterEach(cleanup);

const schema: RegistrationSchema = {
  id: "project-registration",
  key: "project",
  name: "Project registration",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, section: "profile" },
    { name: "email", label: "Email", type: "email", required: true, section: "profile" },
    { name: "notes", label: "Notes", type: "textarea", section: "profile" },
  ],
  sections: [{ key: "profile", title: "Profile" }],
};

describe("DynamicForm", () => {
  it("renders a labeled input for every field in the schema", () => {
    render(<DynamicForm schema={schema} onSubmit={() => {}} />);

    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByLabelText("Full name *")).toBeTruthy();
    expect(screen.getByLabelText("Email *")).toBeTruthy();
    expect(screen.getByLabelText("Notes")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });

  it("shows validation messages and blocks submit when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Full name is required")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits normalized values when the form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Full name *"), "Jane Doe");
    await user.type(screen.getByLabelText("Email *"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Jane Doe", email: "jane@example.com" }),
    );
  });

  it("runs a valid submit through the featureScope boundary, which owns the outcome", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ id: "e1" });
    // The shape scope.boundary(...) returns: merged options + a pre-bound run.
    const featureScope = {
      featureId: "projects:create",
      error: {},
      success: {},
      run: vi.fn(async (action: () => Promise<unknown>) => action()),
    };
    render(<DynamicForm schema={schema} onSubmit={onSubmit} featureScope={featureScope} />);

    await user.type(screen.getByLabelText("Full name *"), "Jane Doe");
    await user.type(screen.getByLabelText("Email *"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(featureScope.run).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Jane Doe", email: "jane@example.com" }),
    );
  });

  it("submits currency fields as plain numbers (the widget's data contract)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const currencySchema: RegistrationSchema = {
      id: "position-registration",
      key: "position",
      name: "Position registration",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, section: "main" },
        {
          name: "budgetAmount",
          label: "Budget",
          type: "currency",
          required: true,
          section: "main",
        },
      ],
      sections: [{ key: "main", title: "Main" }],
    };
    render(<DynamicForm schema={currencySchema} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Title *"), "Engineer");
    await user.type(screen.getByLabelText("Budget *"), "45000.5");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Engineer", budgetAmount: 45000.5 }),
    );
  });

  it("does not enter the featureScope boundary when validation fails", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const featureScope = {
      featureId: "projects:create",
      error: {},
      success: {},
      run: vi.fn(async (action: () => Promise<unknown>) => action()),
    };
    render(<DynamicForm schema={schema} onSubmit={onSubmit} featureScope={featureScope} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Full name is required")).toBeTruthy();
    expect(featureScope.run).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
