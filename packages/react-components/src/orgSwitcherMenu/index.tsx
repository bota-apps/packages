import type { ReactNode } from "react";
import { Building2, Plus } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Inline,
  Text,
} from "@bota-apps/react-ui";

/**
 * The minimal organization shape the menu reads — a constraint, not a schema.
 * The full organization type is API-owned; apps pass their own and get it back
 * in `onSelect`/`renderSuffix`.
 */
export type OrgSwitcherOrganization = {
  id: string;
  name: string;
};

type OrgSwitcherMenuProps<TOrganization extends OrgSwitcherOrganization> = {
  /** Every organization the user belongs to — data-injected; the menu fetches nothing. */
  organizations: readonly TOrganization[];
  /** Filtered out of the list — you don't switch to where you already are. */
  currentOrganizationId?: string;
  /**
   * Switch handler — typically `useAuth().switchOrganization(organization.id)`
   * for same-session tenants, or a subdomain redirect for isolated sessions.
   */
  onSelect: (organization: TOrganization) => void | Promise<void>;
  label?: string;
  /** Right-side adornment per organization (role badge, external-link icon, …). */
  renderSuffix?: (organization: TOrganization) => ReactNode;
  /** When set, appends a "create organization" item invoking this handler. */
  onCreate?: () => void;
  createLabel?: string;
};

/**
 * Organization-switching menu items, composed inside a DropdownMenuContent
 * (the UserMenu's children slot). Renders nothing when there is nowhere to
 * switch and nothing to create.
 */
export function OrgSwitcherMenu<TOrganization extends OrgSwitcherOrganization>({
  organizations,
  currentOrganizationId,
  onSelect,
  label = "Organizations",
  renderSuffix,
  onCreate,
  createLabel = "Create Organization",
}: OrgSwitcherMenuProps<TOrganization>) {
  const otherOrganizations = organizations.filter(
    (organization) => organization.id !== currentOrganizationId,
  );

  if (otherOrganizations.length === 0 && !onCreate) {
    return null;
  }

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      {otherOrganizations.length > 0 ? (
        <DropdownMenuGroup>
          {otherOrganizations.map((organization) => (
            <DropdownMenuItem key={organization.id} onClick={() => void onSelect(organization)}>
              <Inline gap="sm" justify="between">
                <Inline gap="xs">
                  <Building2 />
                  <Text size="sm">{organization.name}</Text>
                </Inline>
                {renderSuffix?.(organization)}
              </Inline>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      ) : null}
      {onCreate ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCreate}>
            <Inline gap="xs">
              <Plus />
              <Text size="sm">{createLabel}</Text>
            </Inline>
          </DropdownMenuItem>
        </>
      ) : null}
    </>
  );
}
