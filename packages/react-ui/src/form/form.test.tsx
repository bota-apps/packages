import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { Input } from "../input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  formItemVariants,
} from "./index";

afterEach(cleanup);

type ProfileValues = {
  username: string;
};

function ProfileForm({ onValid }: { onValid: (values: ProfileValues) => void }) {
  const form = useForm<ProfileValues>({ defaultValues: { username: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem data-testid="item">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Save</button>
      </form>
    </Form>
  );
}

describe("Form (react-hook-form)", () => {
  it("wires label, control, and description together", () => {
    render(<ProfileForm onValid={() => {}} />);
    const input = screen.getByRole("textbox");
    const control = input.parentElement as HTMLElement;
    const label = screen.getByText("Username");
    expect(label.getAttribute("for")).toBe(control.id);
    const describedBy = control.getAttribute("aria-describedby") ?? "";
    const description = screen.getByText("This is your public display name.");
    expect(describedBy).toContain(description.id);
    expect(screen.getByTestId("item").className).toContain(formItemVariants());
  });

  it("shows a validation message and flags the control invalid", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<ProfileForm onValid={onValid} />);

    await user.click(screen.getByRole("button", { name: "Save" }));
    const message = await screen.findByText("Username is required");
    expect(message.className).toContain("text-destructive");
    expect(onValid).not.toHaveBeenCalled();

    const control = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(control.getAttribute("aria-invalid")).toBe("true");
    // The error message id is announced alongside the description.
    expect(control.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<ProfileForm onValid={onValid} />);

    await user.type(screen.getByRole("textbox"), "musema");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0]).toEqual({ username: "musema" });
  });
});
