import { Rows3, Rows4 } from "lucide-react";
import { Button, VisuallyHidden } from "@bota-apps/react-ui";
import { useAppearance } from "../appearanceProvider";

type DensityToggleProps = {
  /** Accessible name for the icon-only button. */
  label?: string;
};

/**
 * One-click UI density flip via the ambient AppearanceProvider — the icon
 * previews the density the click switches to.
 */
export function DensityToggle({ label = "Switch density" }: DensityToggleProps = {}) {
  const { density, toggleDensity } = useAppearance();

  return (
    <Button variant="outline" size="icon" onClick={toggleDensity}>
      {density === "comfortable" ? <Rows4 /> : <Rows3 />}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Button>
  );
}
