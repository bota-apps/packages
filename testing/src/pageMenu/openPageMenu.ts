import { screen } from "@testing-library/react";

// Structural slice of a @testing-library/user-event session — only what the
// helper needs, so the package doesn't pin the consumer's user-event copy.
type UserSession = {
  click: (element: Element) => Promise<void>;
};

export type OpenPageMenuOptions = {
  /**
   * The trigger's accessible name. Defaults to PageMenuActions' English
   * default; pass the app's translated `menuActionsLabel` when it overrides it.
   */
  name?: string | RegExp;
};

/**
 * Opens the page header's actions menu (`PageContainer`'s `menuActions`) by
 * its accessible name — the same way a screen-reader user addresses it.
 */
export async function openPageMenu(
  user: UserSession,
  options: OpenPageMenuOptions = {},
): Promise<void> {
  await user.click(screen.getByRole("button", { name: options.name ?? "Page actions" }));
}
