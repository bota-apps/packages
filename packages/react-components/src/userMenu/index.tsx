import type { ReactNode } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useAuth } from "@bota-apps/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Stack,
  Text,
} from "@bota-apps/react-ui";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

type UserMenuProps = {
  /**
   * Extra menu content rendered between the identity label and the sign-out
   * item — the OrgSwitcherMenu slot.
   */
  children?: ReactNode;
  /** Avatar image URL — SessionUser carries none; apps derive it from their registered user type. */
  imageUrl?: string;
  signOutLabel?: string;
  /** Replaces the default sign-out (logout + bounce to the auth client's login URL). */
  onSignOut?: () => void | Promise<void>;
};

/**
 * The signed-in identity menu: avatar + name/email trigger, app-provided menu
 * content, and sign-out. Renders nothing while the session is unresolved or
 * absent — identity comes from the ambient auth client.
 */
export function UserMenu({
  children,
  imageUrl,
  signOutLabel = "Sign out",
  onSignOut,
}: UserMenuProps) {
  const { user, logout, loginUrl } = useAuth();

  if (!user) {
    return null;
  }

  async function handleSignOut() {
    if (onSignOut) {
      await onSignOut();
      return;
    }
    await logout();
    // Back to the gateway login, which bounces here once re-authenticated.
    window.location.href = loginUrl(window.location.origin);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Account">
          <Avatar>
            {imageUrl ? <AvatarImage src={imageUrl} alt={user.name} /> : null}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <Stack gap="none" align="start">
            <Text as="span" weight="semibold" size="sm" truncate>
              {user.name}
            </Text>
            <Text as="span" size="sm" tone="muted" truncate>
              {user.email}
            </Text>
          </Stack>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuLabel>
          <Stack gap="xs">
            <Text as="span" size="sm" weight="semibold">
              {user.name}
            </Text>
            <Text as="span" size="sm" tone="muted">
              {user.email}
            </Text>
          </Stack>
        </DropdownMenuLabel>
        {children}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleSignOut()}>
          <LogOut />
          <span>{signOutLabel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
