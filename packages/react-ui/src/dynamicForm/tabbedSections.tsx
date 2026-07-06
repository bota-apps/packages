import { useState } from "react";
import type { DynamicFieldSchema } from "@bota-apps/types";
import { FieldRenderer } from "./fieldRenderer";
import { FormGrid } from "../formLayout";
import { Stack } from "../layout";
import { Text } from "../typography";
import { TabNav, tabNavLinkClass } from "../tabNav";

type SectionGroup = {
  key: string;
  title?: string;
  description?: string;
  fields: DynamicFieldSchema[];
};

type TabbedSectionsProps = {
  sections: SectionGroup[];
};

export function TabbedSections({ sections }: TabbedSectionsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sections[activeIndex];

  return (
    <Stack gap="md">
      <TabNav>
        {sections.map((section, i) => (
          <button
            key={section.key}
            type="button"
            className={tabNavLinkClass(i === activeIndex)}
            onClick={() => setActiveIndex(i)}
          >
            {section.title ?? `Section ${i + 1}`}
          </button>
        ))}
      </TabNav>
      {active && (
        <Stack gap="md">
          {active.description && (
            <Text tone="muted" size="sm">
              {active.description}
            </Text>
          )}
          <FormGrid columns={3} gap="lg">
            {active.fields.map((field) => (
              <FieldRenderer key={field.name} field={field} />
            ))}
          </FormGrid>
        </Stack>
      )}
    </Stack>
  );
}
