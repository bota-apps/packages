import { createContext, useContext } from "react";
import type { DynamicFieldSchema } from "@bota-apps/types";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Combobox } from "../combobox";
import type { ComboboxOption } from "../combobox";
import { Checkbox } from "../checkbox";
import { Switch } from "../switch";
import { Label, Description } from "../label";
import { Div, P, RadioOptionEl, RadioInputEl } from "../html";

export type ComboboxOptionsMap = Record<string, ComboboxOption[]>;

const ComboboxOptionsContext = createContext<ComboboxOptionsMap>({});

export function ComboboxOptionsProvider({
  value,
  children,
}: {
  value: ComboboxOptionsMap;
  children: React.ReactNode;
}) {
  return (
    <ComboboxOptionsContext.Provider value={value}>{children}</ComboboxOptionsContext.Provider>
  );
}

type FieldRendererProps = {
  field: DynamicFieldSchema;
};

export function FieldRenderer({ field }: FieldRendererProps) {
  const { control } = useFormContext();
  const comboboxOptionsMap = useContext(ComboboxOptionsContext);

  return (
    <Div spaceY="2" className={field.type === "textarea" ? "col-span-full" : undefined}>
      {field.type !== "checkbox" && field.type !== "switch" && (
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && " *"}
        </Label>
      )}

      <Controller
        name={field.name}
        control={control}
        render={({ field: rhfField, fieldState }) => (
          <>
            {renderInput(field, rhfField, fieldState, comboboxOptionsMap)}
            {field.description && <Description>{field.description}</Description>}
            {fieldState.error?.message && <P variant="error">{fieldState.error.message}</P>}
          </>
        )}
      />
    </Div>
  );
}

function renderInput(
  fieldDef: DynamicFieldSchema,
  rhfField: {
    value: unknown;
    onChange: (val: unknown) => void;
    onBlur: () => void;
    name: string;
    ref: React.RefCallback<HTMLElement>;
  },
  _fieldState: { error?: { message?: string } },
  comboboxOptionsMap: ComboboxOptionsMap,
) {
  const { type, placeholder, options } = fieldDef;
  const value = rhfField.value;

  switch (type) {
    case "textarea":
      return (
        <Textarea
          id={rhfField.name}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          placeholder={placeholder}
          ref={rhfField.ref}
          rows={3}
        />
      );

    case "select": {
      const stringVal = typeof value === "string" ? value : "";
      return (
        <Select value={stringVal} onValueChange={rhfField.onChange}>
          <SelectTrigger id={rhfField.name}>
            <SelectValue placeholder={placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(options ?? []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "combobox": {
      const stringVal = typeof value === "string" ? value : "";
      const comboboxOpts = comboboxOptionsMap[rhfField.name] ?? options ?? [];
      return (
        <Combobox
          id={rhfField.name}
          value={stringVal || undefined}
          onValueChange={(v) => rhfField.onChange(v ?? "")}
          options={comboboxOpts}
          placeholder={placeholder ?? "Select..."}
          searchPlaceholder={placeholder ?? "Search..."}
          clearable
        />
      );
    }

    case "radio":
      return (
        <Div layout="col" gap="sm">
          {(options ?? []).map((opt) => (
            <RadioOptionEl key={opt.value}>
              <RadioInputEl
                name={rhfField.name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => rhfField.onChange(opt.value)}
                onBlur={rhfField.onBlur}
              />
              {opt.label}
            </RadioOptionEl>
          ))}
        </Div>
      );

    case "checkbox":
      return (
        <Div layout="row" gap="sm">
          <Checkbox
            id={rhfField.name}
            checked={Boolean(value)}
            onCheckedChange={(checked) => rhfField.onChange(Boolean(checked))}
          />
          <Label htmlFor={rhfField.name}>
            {fieldDef.label}
            {fieldDef.required && " *"}
          </Label>
        </Div>
      );

    case "switch":
      return (
        <Div layout="row" gap="sm">
          <Switch
            id={rhfField.name}
            checked={Boolean(value)}
            onCheckedChange={(checked) => rhfField.onChange(checked)}
            ref={rhfField.ref}
          />
          <Label htmlFor={rhfField.name}>
            {fieldDef.label}
            {fieldDef.required && " *"}
          </Label>
        </Div>
      );

    // Currency shares the number contract: the form value is a plain number
    // (zodBuilder/normalizer coerce it, gql-codegen's widget policy documents
    // it). Money-shaped objects are display-only — never form state.
    case "number":
    case "currency":
      return (
        <Input
          id={rhfField.name}
          type="number"
          value={value !== undefined && value !== null ? String(value) : ""}
          onChange={(e) =>
            rhfField.onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
          onBlur={rhfField.onBlur}
          placeholder={placeholder}
          ref={rhfField.ref}
          min={fieldDef.validation?.min}
          max={fieldDef.validation?.max}
          step={type === "currency" ? "0.01" : undefined}
        />
      );

    case "date":
      return (
        <Input
          id={rhfField.name}
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          ref={rhfField.ref}
        />
      );

    case "email":
      return (
        <Input
          id={rhfField.name}
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          placeholder={placeholder ?? "email@example.com"}
          ref={rhfField.ref}
        />
      );

    case "phone":
      return (
        <Input
          id={rhfField.name}
          type="tel"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          placeholder={placeholder ?? "+1..."}
          ref={rhfField.ref}
        />
      );

    case "password":
      return (
        <Input
          id={rhfField.name}
          type="password"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          placeholder={placeholder}
          ref={rhfField.ref}
        />
      );

    case "text":
    default:
      return (
        <Input
          id={rhfField.name}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => rhfField.onChange(e.target.value)}
          onBlur={rhfField.onBlur}
          placeholder={placeholder}
          ref={rhfField.ref}
          maxLength={fieldDef.validation?.maxLength}
        />
      );
  }
}
