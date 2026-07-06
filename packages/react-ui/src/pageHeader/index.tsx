import type { ReactNode } from "react";
import { PageHeaderEl, PageHeaderContentEl, PageHeaderActionEl, P } from "../html";
import { Heading } from "../html/typography";

type PageHeaderProps = {
  title?: string;
  description?: string;
  metadata?: ReactNode;
  action?: ReactNode;
};

export function PageHeader({ title, description, metadata, action }: PageHeaderProps) {
  if (!title && !description && !metadata && !action) {
    return null;
  }

  return (
    <PageHeaderEl>
      <PageHeaderContentEl>
        {title && <Heading size="lg">{title}</Heading>}
        {description && (
          <P variant="muted" mt="1">
            {description}
          </P>
        )}
        {metadata}
      </PageHeaderContentEl>
      {action && <PageHeaderActionEl>{action}</PageHeaderActionEl>}
    </PageHeaderEl>
  );
}

export * from "./variants";
