import {
  Badge,
  CurrencyText,
  DateTime,
  NumericText,
  PhoneDisplay,
  Text,
} from "@bota-apps/react-ui";
import { moneySchema } from "@bota-apps/schema-utils";

type FieldValueProps = {
  value: unknown;
  valueType?: string;
  size?: "sm" | "md";
  tone?: "default" | "muted";
};

/**
 * One before/after audit value, rendered by its `valueType` hint. The hint is
 * advisory: a value that doesn't actually match the hinted shape falls back to
 * plain text — never a fabricated default.
 */
export function FieldValue({ value, valueType, size = "sm", tone = "default" }: FieldValueProps) {
  if (value === null || value === undefined) {
    return (
      <Text as="span" tone="muted" size={size}>
        —
      </Text>
    );
  }

  switch (valueType) {
    case "currency": {
      const money = moneySchema.safeParse(value);
      if (money.success) {
        return <CurrencyText value={money.data} format="short" size={size} tone={tone} />;
      }
      break;
    }
    case "number": {
      if (typeof value === "number" && Number.isFinite(value)) {
        return <NumericText value={value} variant="count" size={size} tone={tone} />;
      }
      break;
    }
    case "phone":
      return <PhoneDisplay phone={String(value)} size={size} />;
    case "date":
      return <DateTime variant="date" value={String(value)} size={size} />;
    case "boolean":
      return (
        <Text as="span" size={size} tone={tone}>
          {value ? "Yes" : "No"}
        </Text>
      );
    case "enum":
      return <Badge variant="muted">{String(value)}</Badge>;
  }

  return (
    <Text as="span" size={size} tone={tone}>
      {String(value)}
    </Text>
  );
}
