/**
 * EntityWorkspace — a reusable entity-detail composition: a page header
 * (title, subtitle, status, primary actions) above a tabbed body. The tabs are
 * generic, named composition slots — the app supplies the tab set and their
 * content; no domain tabs are defined here.
 *
 * Route-controlled tabs: pass `activeTab` + `onTabChange` to bind the selected
 * tab to the router (search param or path segment); omit them for uncontrolled
 * local state seeded by `defaultTab`. This is the adapter seam — routing lives
 * in the app, tab presentation lives here.
 *
 * Composition over react-ui: PageHeader for the header, Tabs (Radix) for the
 * body. Loading/error/suspense stay the caller's concern (wrap tab content in
 * the app's PageContainer/Suspense as needed).
 */
import type { ReactNode } from "react";
import { Div, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@bota-apps/react-ui";

export type EntityWorkspaceTab = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type EntityWorkspaceProps = {
  title: string;
  /** Secondary line under the title (a route, a reference, a period). */
  subtitle?: ReactNode;
  /** Status indicator (e.g. a Badge) shown beside the subtitle. */
  status?: ReactNode;
  /** Primary actions for the entity (e.g. a submit/approve button). */
  actions?: ReactNode;
  tabs: readonly EntityWorkspaceTab[];
  /** Controlled active tab id — bind to the router for route-controlled tabs. */
  activeTab?: string;
  onTabChange?: (id: string) => void;
  /** Uncontrolled starting tab; defaults to the first tab. */
  defaultTab?: string;
  ariaLabel?: string;
};

export function EntityWorkspace({
  title,
  subtitle,
  status,
  actions,
  tabs,
  activeTab,
  onTabChange,
  defaultTab,
  ariaLabel,
}: EntityWorkspaceProps) {
  const metadata =
    subtitle !== undefined || status !== undefined ? (
      <Div layout="rowStart" gap="sm" className="mt-1 flex-wrap items-center">
        {subtitle !== undefined && <Div className="text-sm text-muted-foreground">{subtitle}</Div>}
        {status}
      </Div>
    ) : undefined;

  // Radix Tabs must be consistently controlled OR uncontrolled — pick one.
  const controlled = activeTab !== undefined;
  const tabsControlProps = controlled
    ? { value: activeTab }
    : { defaultValue: defaultTab ?? tabs[0]?.id };

  return (
    <Div layout="col" gap="lg" className="min-w-0">
      <PageHeader title={title} metadata={metadata} action={actions} />

      <Tabs
        {...tabsControlProps}
        onValueChange={onTabChange}
        aria-label={ariaLabel}
        className="min-w-0"
      >
        {/* The trigger row scrolls horizontally in narrow containers rather
            than wrapping or clipping the tab set. */}
        <Div className="overflow-x-auto">
          <TabsList className={cn("w-max max-w-none")}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="min-w-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </Div>
  );
}
