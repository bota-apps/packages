import { describe, expect, it } from "vitest";
import { classifyError } from "./classify";
import { ApiError, BusinessRuleError, GraphQLError } from "./types";

// Seed test for package logic (pure, no DOM). Exercises the error classifier —
// the part the whole boundary depends on. Copy this shape for your own unit tests.
describe("classifyError", () => {
  it("classifies a typed ApiError by its kind", () => {
    expect(classifyError(new ApiError("boom", 500)).kind).toBe("api");
  });

  it("honours an `expected` status remap (409 → business)", () => {
    const classified = classifyError(new ApiError("conflict", 409), { 409: "business" });
    expect(classified.kind).toBe("business");
    expect(classified.error).toBeInstanceOf(BusinessRuleError);
  });

  it("reads a graphql-request ClientError shape", () => {
    const classified = classifyError({
      response: {
        status: 400,
        errors: [{ message: "bad input", extensions: { code: "BAD_USER_INPUT" } }],
      },
    });
    expect(classified.kind).toBe("graphql");
    expect(classified.error).toBeInstanceOf(GraphQLError);
  });

  it("falls back to unexpected for unknown values", () => {
    expect(classifyError("nope").kind).toBe("unexpected");
  });
});
