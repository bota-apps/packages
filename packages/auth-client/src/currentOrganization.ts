import type { RegisteredAuthUser } from "@bota-apps/types/auth";

/**
 * The organization type carried on the app-registered user's `currentOrg`
 * field, inferred from the `AuthRegister` registration (see
 * `@bota-apps/types/auth`). `currentOrg` is an APP-level field — the base
 * `SessionUser` constraint doesn't know it — so this resolves to `never` until
 * an app registers a user type that declares it:
 *
 * ```ts
 * declare module "@bota-apps/types/auth" {
 *   interface AuthRegister {
 *     user: ApiUser; // { …; currentOrg?: CurrentOrganization | null }
 *   }
 * }
 * ```
 */
export type RegisteredCurrentOrganization = RegisteredAuthUser extends {
  currentOrg?: infer TOrg;
}
  ? NonNullable<TOrg>
  : never;

/**
 * Narrows the registered user to "carries an active organization". The runtime
 * check is structural (`in` + non-null) so it compiles against the unresolved
 * registration without casts; the predicate binds what the check establishes
 * to the registration-inferred org type.
 */
export function hasCurrentOrganization(
  user: RegisteredAuthUser,
): user is RegisteredAuthUser & { currentOrg: RegisteredCurrentOrganization } {
  return "currentOrg" in user && user.currentOrg !== null && user.currentOrg !== undefined;
}
