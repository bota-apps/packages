import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Inline,
  Heading,
  Text,
  Badge,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@bota-apps/react-ui";

/** One navigable page in an extension's standalone sidebar. */
export type ExtensionPage = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export type ExtensionShellProps = {
  appName: string;
  appIcon: LucideIcon;
  appVersion: string;
  pages: readonly ExtensionPage[];
  currentPath: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
};

/**
 * The standalone chrome for an extension: a collapsible sidebar with the app's
 * pages, a version footer, and the page content in the inset. Only rendered when
 * the extension runs standalone — embedded in a host, the host provides the
 * chrome and the extension renders bare.
 */
export function ExtensionShell({
  appName,
  appIcon: AppIcon,
  appVersion,
  pages,
  currentPath,
  onNavigate,
  children,
}: ExtensionShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Inline gap="sm" align="center">
            <AppIcon size={20} />
            <Heading as="h1" size="sm">
              {appName}
            </Heading>
          </Inline>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarMenu>
              {pages.map((page) => (
                <SidebarMenuItem key={page.path}>
                  <SidebarMenuButton
                    isActive={currentPath === page.path}
                    onClick={() => onNavigate(page.path)}
                    tooltip={page.label}
                  >
                    <page.icon />
                    <span>{page.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Inline gap="xs" align="center">
            <Badge variant="muted">{appVersion}</Badge>
            <Text tone="muted" size="sm">
              standalone
            </Text>
          </Inline>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Inline as="header" gap="sm" align="center" className="h-12 px-4 border-b">
          <SidebarTrigger />
        </Inline>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
