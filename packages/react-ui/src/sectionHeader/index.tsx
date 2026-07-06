import type { ReactNode } from "react";
import { SectionHeaderEl, SectionHeaderTitleGroupEl, SectionHeaderActionsEl } from "../html";
import { H, P } from "../html";

type ISectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode[];
};

export function SectionHeader({ title, description, actions = [] }: ISectionHeaderProps) {
  return (
    <SectionHeaderEl>
      <SectionHeaderTitleGroupEl>
        <H as="h2" variant="sectionTitle" truncate>
          {title}
        </H>
        {description && <P variant="muted">{description}</P>}
      </SectionHeaderTitleGroupEl>
      {actions?.length > 0 && <SectionHeaderActionsEl>{actions}</SectionHeaderActionsEl>}
    </SectionHeaderEl>
  );
}

export * from "./variants";
