// The generation policy for a field's widget — deliberately boring and
// explicit. This is NOT "smart defaults": the generator may infer from GraphQL
// *types* (structural, safe), but it never infers business meaning from field
// *names* (a rename would silently change the UI with no compile-time signal).
//
//   @widget(type:) directive   -> the chosen widget (semantic widgets live here)
//     ↓ enum type              -> select
//     ↓ Boolean                -> checkbox
//     ↓ Money                  -> currency
//     ↓ Int / Float            -> number
//     ↓ everything else        -> text
//
// Specialized string widgets (email, phone, date, textarea, password, radio)
// are intentional: they MUST be requested with @widget in the SDL. They map onto
// the DynamicFieldType union in @bota-apps/types.
import type { DomainScalar, DomainWidget } from "@bota-apps/types";

type WidgetInput = {
  scalar: DomainScalar;
  /** The value of an explicit @widget directive, if any. */
  widget?: string;
};

export function widgetForField({ scalar, widget }: WidgetInput): DomainWidget {
  if (widget && isDomainWidget(widget)) {
    return widget;
  }
  if (scalar === "Enum") {
    return "select";
  }
  if (scalar === "Boolean") {
    return "checkbox";
  }
  if (scalar === "Money") {
    return "currency";
  }
  if (scalar === "Int" || scalar === "Float") {
    return "number";
  }
  return "text";
}

const allWidgets: readonly DomainWidget[] = [
  "text",
  "password",
  "textarea",
  "number",
  "email",
  "phone",
  "date",
  "select",
  "combobox",
  "radio",
  "checkbox",
  "switch",
  "currency",
];

export function isDomainWidget(value: string): value is DomainWidget {
  return (allWidgets as readonly string[]).includes(value);
}

// Which widgets are valid for which scalar kind. Specialized widgets are
// intentional, so an @widget that doesn't fit the scalar is reported as an
// error — not silently coerced. Note `currency` on Int/Float: the DynamicForm
// currency field's data contract is a plain number (the Money-shaped object is
// renderer-local UI state; the normalizer collapses it back to a number).
const stringWidgets: ReadonlySet<string> = new Set([
  "text",
  "password",
  "textarea",
  "email",
  "phone",
  "date",
]);
const enumWidgets: ReadonlySet<string> = new Set(["select", "radio", "combobox"]);
const booleanWidgets: ReadonlySet<string> = new Set(["checkbox", "switch"]);
const numberWidgets: ReadonlySet<string> = new Set(["number", "currency"]);

export function widgetAllowed(widget: string, scalar: DomainScalar): boolean {
  switch (scalar) {
    case "Enum": {
      return enumWidgets.has(widget);
    }
    case "Boolean": {
      return booleanWidgets.has(widget);
    }
    case "Money": {
      return widget === "currency";
    }
    case "Int":
    case "Float": {
      return numberWidgets.has(widget);
    }
    case "ID":
    case "String": {
      return stringWidgets.has(widget);
    }
  }
}
