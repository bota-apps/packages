import { describe, expect, it } from "vitest";
import type { Equal, Expect } from "./index";

// The helpers are type-level: the assertions below fail the BUILD, not the run.
type Assertions = [
  Expect<Equal<string, string>>,
  Expect<Equal<{ a: 1 }, { a: 1 }>>,
  // Equal is exact, not merely mutually-assignable.
  Expect<Equal<Equal<{ a: 1 }, { a: 1; b?: 2 }>, false>>,
  Expect<Equal<Equal<string, string | number>, false>>,
  Expect<Equal<Equal<{ readonly a: 1 }, { a: 1 }>, false>>,
];

describe("Equal/Expect", () => {
  it("compile-time assertions above hold", () => {
    const holds: Assertions extends readonly true[] ? true : false = true;
    expect(holds).toBe(true);
  });
});
