import { describe, expect, it } from "vitest";
import type { DynamicFieldSchema } from "@bota-apps/types";
import { buildDefaultValues, buildFormZodSchema } from "./zodBuilder";

const field = (overrides: Partial<DynamicFieldSchema>): DynamicFieldSchema =>
  ({
    name: "amount",
    label: "Amount",
    type: "currency",
    required: false,
    ...overrides,
  }) as DynamicFieldSchema;

describe("buildFormZodSchema", () => {
  it("rejects an empty required number instead of coercing '' to 0", () => {
    const schema = buildFormZodSchema([field({ type: "currency", required: true })]);
    const result = schema.safeParse({ amount: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Amount is required");
    }
  });

  it("rejects null and undefined for required numbers", () => {
    const schema = buildFormZodSchema([field({ type: "number", required: true })]);
    expect(schema.safeParse({ amount: null }).success).toBe(false);
    expect(schema.safeParse({}).success).toBe(false);
  });

  it("still coerces real numeric input", () => {
    const schema = buildFormZodSchema([field({ type: "currency", required: true })]);
    expect(schema.parse({ amount: "150.5" })).toEqual({ amount: 150.5 });
    expect(schema.parse({ amount: 0 })).toEqual({ amount: 0 });
  });

  it("lets optional numbers stay absent", () => {
    const schema = buildFormZodSchema([field({ type: "number", required: false })]);
    expect(schema.parse({ amount: "" })).toEqual({ amount: undefined });
  });

  it("rejects non-numeric input with the number message", () => {
    const schema = buildFormZodSchema([field({ type: "number", required: true })]);
    const result = schema.safeParse({ amount: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Amount must be a number");
    }
  });

  it("enforces min/max on numbers", () => {
    const schema = buildFormZodSchema([
      field({ type: "number", required: true, validation: { min: 10, max: 20 } }),
    ]);
    expect(schema.safeParse({ amount: 5 }).success).toBe(false);
    expect(schema.safeParse({ amount: 15 }).success).toBe(true);
    expect(schema.safeParse({ amount: 25 }).success).toBe(false);
  });

  it("validates required strings and email format", () => {
    const schema = buildFormZodSchema([
      field({ name: "email", label: "Email", type: "email", required: true }),
    ]);
    const empty = schema.safeParse({ email: "" });
    expect(empty.success).toBe(false);
    if (!empty.success) {
      expect(empty.error.issues[0]?.message).toBe("Email is required");
    }
    const invalid = schema.safeParse({ email: "not-an-email" });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0]?.message).toBe("Invalid email address");
    }
    expect(schema.safeParse({ email: "a@b.co" }).success).toBe(true);
  });

  it("uses injected validation messages", () => {
    const schema = buildFormZodSchema(
      [
        field({ type: "currency", required: true }),
        field({ name: "email", label: "Email", type: "email", required: false }),
      ],
      {
        messages: {
          required: (label) => `${label} ያስፈልጋል`,
          invalidEmail: () => "ልክ ያልሆነ ኢሜይል",
        },
      },
    );
    const missing = schema.safeParse({ amount: "", email: "" });
    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(missing.error.issues[0]?.message).toBe("Amount ያስፈልጋል");
    }
    const badEmail = schema.safeParse({ amount: 5, email: "nope" });
    expect(badEmail.success).toBe(false);
    if (!badEmail.success) {
      expect(badEmail.error.issues[0]?.message).toBe("ልክ ያልሆነ ኢሜይል");
    }
  });

  it("falls back to the English default when a message key is explicitly undefined", () => {
    // An optional translator produces exactly this shape: the key is present
    // but its value is undefined. The default builder must still be used.
    const schema = buildFormZodSchema([field({ type: "text", required: true })], {
      messages: { required: undefined, invalidEmail: undefined },
    });
    const missing = schema.safeParse({ amount: "" });
    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(missing.error.issues[0]?.message).toBe("Amount is required");
    }
  });
});

describe("buildDefaultValues", () => {
  it("leaves required numbers empty instead of defaulting to 0", () => {
    const defaults = buildDefaultValues([field({ type: "currency", required: true })]);
    expect(defaults.amount).toBeUndefined();
  });

  it("respects explicit defaultValue and defaults booleans/strings", () => {
    const defaults = buildDefaultValues([
      field({ name: "qty", label: "Qty", type: "number", defaultValue: 3 }),
      field({ name: "active", label: "Active", type: "switch" }),
      field({ name: "note", label: "Note", type: "text" }),
    ]);
    expect(defaults).toEqual({ qty: 3, active: false, note: "" });
  });
});
