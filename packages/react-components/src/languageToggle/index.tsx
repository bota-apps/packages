import { Languages } from "lucide-react";
import {
  Button,
  type ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  VisuallyHidden,
} from "@bota-apps/react-ui";

export type LanguageOption<TLanguage extends string = string> = {
  value: TLanguage;
  /** Display name in its own language (e.g. "አማርኛ"). */
  label: string;
};

type LanguageToggleProps<TLanguage extends string> = {
  languages: readonly LanguageOption<TLanguage>[];
  value: TLanguage;
  onChange: (value: TLanguage) => void;
  /** Accessible name for the icon-only trigger. */
  label?: string;
  /** Trigger button variant — pass "chrome" when mounted on the shell chrome. */
  variant?: ButtonProps["variant"];
};

/**
 * Language picker with no i18n-library coupling: the app passes its supported
 * languages and current value, and wires `onChange` to its i18n runtime
 * (e.g. `i18n.changeLanguage`).
 */
export function LanguageToggle<TLanguage extends string>({
  languages,
  value,
  onChange,
  label = "Change language",
  variant = "outline",
}: LanguageToggleProps<TLanguage>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon">
          <Languages />
          <VisuallyHidden>{label}</VisuallyHidden>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            // Radix hands back a plain string — resolve it to the typed option.
            const selected = languages.find((language) => language.value === next);
            if (selected) {
              onChange(selected.value);
            }
          }}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value}>
              {language.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
