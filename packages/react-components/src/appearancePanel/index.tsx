/**
 * AppearancePanel — a docked SidePanel giving the appearance controls room:
 * light/dark mode, the preset list as rich cards (icon, description, and the
 * preset's `preview` color swatches), and a free color picker that tints the
 * active look via the provider's custom color. Purely presentational over
 * useAppearance(); persistence beyond localStorage (e.g. a "save to my
 * profile" action) is the app's job via the `footer` slot.
 */
import { useId, type ReactNode } from "react";
import { Check, Moon, RotateCcw, Sun } from "lucide-react";
import { Button, SidePanel, Stack, Text, cn } from "@bota-apps/react-ui";
import { useAppearance, type AppearancePreset } from "../appearanceProvider";

export type AppearancePanelProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Heading of the light/dark section. */
  modeLabel?: string;
  lightModeLabel?: string;
  darkModeLabel?: string;
  /** Heading of the preset list. */
  presetsLabel?: string;
  /** Heading of the custom color section. */
  customColorLabel?: string;
  /** One-line explanation under the custom color heading. */
  customColorHint?: string;
  /** Accessible name of the color input. */
  customColorPickerLabel?: string;
  /** Clears the custom color — shown only while one is set. */
  customColorResetLabel?: string;
  closeLabel?: string;
  widenLabel?: string;
  narrowLabel?: string;
  /** Pinned action row (e.g. the app's "save preferences" button). */
  footer?: ReactNode;
};

function PresetSwatches({ preview }: { preview: AppearancePreset["preview"] }) {
  if (!preview || preview.length === 0) {
    return null;
  }
  return (
    <span aria-hidden className="flex shrink-0 items-center gap-1">
      {preview.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="size-4 rounded-full border border-black/10 dark:border-white/20"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export function AppearancePanel({
  open,
  onOpenChange,
  title = "Appearance",
  description = "Choose how the app looks for you.",
  modeLabel = "Mode",
  lightModeLabel = "Light",
  darkModeLabel = "Dark",
  presetsLabel = "Theme",
  customColorLabel = "Custom color",
  customColorHint = "Tint the selected theme with a color of your own.",
  customColorPickerLabel = "Pick a custom color",
  customColorResetLabel = "Reset to theme colors",
  closeLabel,
  widenLabel,
  narrowLabel,
  footer,
}: AppearancePanelProps) {
  const { mode, toggleMode, presets, preset, applyPreset, customColor, setCustomColor } =
    useAppearance();
  const colorInputId = useId();

  const activePreset = presets.find((option) => option.value === preset);
  // The picker needs a concrete value while no custom color is set — the
  // active look's first swatch is the closest thing to "the current color".
  const pickerValue = customColor ?? activePreset?.preview?.[0] ?? "#808080";

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      closeLabel={closeLabel}
      widenLabel={widenLabel}
      narrowLabel={narrowLabel}
      footer={footer}
    >
      <Stack gap="lg">
        <Stack gap="xs">
          <Text as="h3" size="sm" weight="semibold">
            {modeLabel}
          </Text>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "light", label: lightModeLabel, icon: Sun },
                { value: "dark", label: darkModeLabel, icon: Moon },
              ] as const
            ).map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={mode === option.value ? "secondary" : "outline"}
                aria-pressed={mode === option.value}
                onClick={() => {
                  if (mode !== option.value) {
                    toggleMode();
                  }
                }}
              >
                <option.icon />
                {option.label}
              </Button>
            ))}
          </div>
        </Stack>

        <Stack gap="xs">
          <Text as="h3" size="sm" weight="semibold">
            {presetsLabel}
          </Text>
          <div role="radiogroup" aria-label={presetsLabel} className="flex flex-col gap-2">
            {presets.map((option) => {
              const selected = option.value === preset;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => applyPreset(option.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-primary bg-primary-50 dark:bg-primary-100"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {option.icon && <option.icon className="size-4 shrink-0 text-muted-foreground" />}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <Text as="span" size="sm" weight="semibold" className="min-w-0 truncate">
                        {option.label}
                      </Text>
                      {selected && <Check aria-hidden className="size-4 shrink-0 text-primary" />}
                    </span>
                    {option.description && (
                      <Text as="span" size="sm" tone="muted">
                        {option.description}
                      </Text>
                    )}
                  </span>
                  <PresetSwatches preview={option.preview} />
                </button>
              );
            })}
          </div>
        </Stack>

        <Stack gap="xs">
          <Text as="h3" size="sm" weight="semibold">
            {customColorLabel}
          </Text>
          <Text as="p" size="sm" tone="muted">
            {customColorHint}
          </Text>
          <div className="flex items-center gap-3">
            {/* The native picker is the whole control — styled as a swatch. */}
            <input
              id={colorInputId}
              type="color"
              aria-label={customColorPickerLabel}
              value={pickerValue}
              onChange={(event) => setCustomColor(event.target.value)}
              className="size-9 cursor-pointer appearance-none rounded-md border border-border bg-background p-1"
            />
            <Text as="span" size="sm" tone="muted" className="font-mono uppercase">
              {customColor ?? "—"}
            </Text>
            {customColor !== null && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCustomColor(null)}
              >
                <RotateCcw />
                {customColorResetLabel}
              </Button>
            )}
          </div>
        </Stack>
      </Stack>
    </SidePanel>
  );
}
