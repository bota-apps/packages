// Type-level utilities (no runtime). Use to assert two types are identical:
//   type _ = Expect<Equal<z.infer<typeof schema>, SomeType>>;

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type Expect<T extends true> = T;
