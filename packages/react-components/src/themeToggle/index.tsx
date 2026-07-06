import { Button, ThemeToggleIcon, VisuallyHidden } from "@bota-apps/react-ui";
import { useAppearance } from "../appearanceProvider";

type ThemeToggleProps = {
  /** Accessible name for the icon-only button. */
  label?: string;
};

/** Icon button flipping between light and dark via the ambient AppearanceProvider. */
export function ThemeToggle({ label = "Toggle theme" }: ThemeToggleProps = {}) {
  const { toggleMode } = useAppearance();

  return (
    <Button variant="outline" size="icon" onClick={toggleMode}>
      <ThemeToggleIcon />
      <VisuallyHidden>{label}</VisuallyHidden>
    </Button>
  );
}
