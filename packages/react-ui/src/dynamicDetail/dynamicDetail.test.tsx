import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Money, TypedDetailSchema } from "@bota-apps/types";
import { formatMoneyShort } from "@bota-apps/schema-utils";
import { DynamicDetail } from "./index";
import { TooltipProvider } from "../tooltip";

type Project = {
  fullName: string;
  phone: string;
  status: string;
  baseBudget: Money;
  dependents: number;
  remote: boolean;
};

const project: Project = {
  fullName: "Jane Doe",
  phone: "+14155550123",
  status: "active",
  baseBudget: { amount: 45000, currency: "USD" },
  dependents: 2,
  remote: true,
};

const schema: TypedDetailSchema<Project> = {
  id: "project-detail",
  name: "Project detail",
  sections: [
    { key: "profile", title: "Profile" },
    { key: "budget", title: "Budget" },
  ],
  fields: [
    { name: "fullName", label: "Full name", type: "text", section: "profile" },
    { name: "phone", label: "Phone", type: "phone", section: "profile" },
    {
      name: "status",
      label: "Status",
      type: "select",
      section: "profile",
      options: [
        { label: "Active", value: "active" },
        { label: "On hold", value: "on-hold" },
      ],
    },
    { name: "baseBudget", label: "Base budget", type: "currency", section: "budget" },
    { name: "dependents", label: "Dependents", type: "number", section: "budget" },
    { name: "remote", label: "Remote", type: "switch", section: "budget" },
  ],
};

function renderDetail(variant?: "card" | "flat" | "inline") {
  return render(
    <TooltipProvider>
      <DynamicDetail schema={schema} data={project} variant={variant} />
    </TooltipProvider>,
  );
}

afterEach(cleanup);

describe("DynamicDetail", () => {
  it("renders every field label with its formatted value", () => {
    renderDetail();
    expect(screen.getByText("Full name")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    // Select values render their option label, not the raw value.
    expect(screen.getByText("Active")).toBeTruthy();
    // Phone values are normalized and formatted.
    expect(screen.getByText("+14155550123")).toBeTruthy();
    // Currency values are formatted through CurrencyText.
    expect(screen.getByText(formatMoneyShort(project.baseBudget))).toBeTruthy();
    // Numbers render through NumericText, booleans as Yes/No.
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("Yes")).toBeTruthy();
  });

  it("renders section titles in the card variant", () => {
    renderDetail();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Budget")).toBeTruthy();
  });

  it("renders the flat variant with section headings and fields", () => {
    renderDetail("flat");
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
  });

  it("renders the inline variant as key-value pairs", () => {
    renderDetail("inline");
    expect(screen.getByText("Full name")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    // Inline variant drops section chrome entirely.
    expect(screen.queryByText("Profile")).not.toBeTruthy();
  });
});
