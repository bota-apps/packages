import type { ReactNode } from "react";
import { PageEl, PageContentEl, ContentSurfaceEl } from "../html";

export * from "./variants";

type PageProps = {
  children: ReactNode;
  layout?: "flow" | "fixed";
};

export function Page({ children, layout = "flow" }: PageProps) {
  return <PageEl layout={layout}>{children}</PageEl>;
}

type PageContentProps = {
  children: ReactNode;
  variant?: "default" | "narrow" | "wide" | "full";
  region?: "header" | "body";
};

export function PageContent({ children, variant = "default", region }: PageContentProps) {
  return (
    <PageContentEl maxWidth={variant} region={region ?? "default"}>
      {children}
    </PageContentEl>
  );
}

type ContentSurfaceProps = {
  children: ReactNode;
};

export function ContentSurface({ children }: ContentSurfaceProps) {
  return <ContentSurfaceEl>{children}</ContentSurfaceEl>;
}
