import { Button, type ButtonProps, ThemeToggleIcon, VisuallyHidden } from "@bota-apps/react-ui";
import { useAppearance } from "../appearanceProvider";

type ThemeToggleProps = {
  /** Accessible name for the icon-only button. */
  label?: string;
  /** Button variant — pass "chrome" when mounted on the shell chrome. */
  variant?: ButtonProps["variant"];
};

/** Icon button flipping between light and dark via the ambient AppearanceProvider. */
export function ThemeToggle({
  label = "Toggle theme",
  variant = "outline",
}: ThemeToggleProps = {}) {
  const { toggleMode } = useAppearance();

  return (
    <Button variant={variant} size="icon" onClick={toggleMode}>
      <ThemeToggleIcon />
      <VisuallyHidden>{label}</VisuallyHidden>
    </Button>
  );
}
