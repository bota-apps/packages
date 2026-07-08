import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { openPageMenu } from "./openPageMenu";

describe("openPageMenu", () => {
  it("clicks the trigger by its default accessible name", async () => {
    render(
      <button aria-label="Page actions" type="button">
        <svg />
      </button>,
    );
    const click = vi.fn(async () => {});
    await openPageMenu({ click });
    expect(click).toHaveBeenCalledWith(screen.getByRole("button", { name: "Page actions" }));
  });

  it("targets a translated trigger name", async () => {
    render(
      <button aria-label="የገፅ ተግባራት" type="button">
        <svg />
      </button>,
    );
    const click = vi.fn(async () => {});
    await openPageMenu({ click }, { name: "የገፅ ተግባራት" });
    expect(click).toHaveBeenCalledTimes(1);
  });
});
