import type { RegistrationSchema } from "@bota-apps/types";
import { Text } from "../typography";
import { Badge } from "../badge";
import { Inline, Stack } from "../layout";
import { List } from "../list";
import { CardButtonEl } from "../html";

type SchemaSelectorProps = {
  schemas: RegistrationSchema[];
  onSelect: (schema: RegistrationSchema) => void;
};

export function SchemaSelector({ schemas, onSelect }: SchemaSelectorProps) {
  return (
    <List
      data={schemas}
      keyExtractor={(s) => s.id}
      gap="md"
      renderItem={(schema) => (
        <CardButtonEl onClick={() => onSelect(schema)}>
          <Stack gap="xs">
            <Inline justify="between">
              <Text weight="semibold">{schema.name}</Text>
              {schema.isDefault && <Badge variant="secondary">Default</Badge>}
            </Inline>
            {schema.description && (
              <Text size="sm" tone="muted">
                {schema.description}
              </Text>
            )}
            <Text size="sm" tone="muted">
              {schema.fields.length} fields
            </Text>
          </Stack>
        </CardButtonEl>
      )}
    />
  );
}
