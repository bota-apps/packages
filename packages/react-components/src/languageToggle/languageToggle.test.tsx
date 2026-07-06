import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageToggle, type LanguageOption } from "./index";

type AppLanguage = "en" | "am";

const languages: readonly LanguageOption<AppLanguage>[] = [
  { value: "en", label: "English" },
  { value: "am", label: "አማርኛ" },
];

describe("LanguageToggle", () => {
  it("lists the app's languages and reports the typed selection", async () => {
    const onChange = vi.fn();
    render(<LanguageToggle languages={languages} value="en" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Change language" }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "አማርኛ" }));

    expect(onChange).toHaveBeenCalledWith("am");
  });

  it("marks the current language as checked", async () => {
    render(<LanguageToggle languages={languages} value="am" onChange={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "Change language" }));
    const checked = await screen.findByRole("menuitemradio", { name: "አማርኛ" });
    expect(checked.getAttribute("aria-checked")).toBe("true");
  });
});
