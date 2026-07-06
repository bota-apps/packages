import { Palette } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  VisuallyHidden,
} from "@bota-apps/react-ui";
import { useAppearance } from "../appearanceProvider";

type PresetSelectProps = {
  /** Accessible name for the icon-only trigger. */
  label?: string;
};

/**
 * Appearance-preset picker fed by the ambient AppearanceProvider — one
 * selection applies a pre-assembled look (brand tokens, shell layout, density)
 * in a single click. Granular toggles move the appearance off any preset, in
 * which case nothing shows as checked. Renders nothing for single-preset apps,
 * so shells can mount it unconditionally.
 */
export function PresetSelect({ label = "Change theme" }: PresetSelectProps = {}) {
  const { presets, preset, applyPreset } = useAppearance();

  if (presets.length < 2) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette />
          <VisuallyHidden>{label}</VisuallyHidden>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          // A custom axis mix matches no preset — the group renders unchecked.
          value={preset ?? ""}
          onValueChange={(next) => {
            // Radix hands back a plain string — only forward listed presets.
            const selected = presets.find((option) => option.value === next);
            if (selected) {
              applyPreset(selected.value);
            }
          }}
        >
          {presets.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
