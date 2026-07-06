import { PanelLeft, PanelTop } from "lucide-react";
import { Button, VisuallyHidden } from "@bota-apps/react-ui";
import { useAppearance } from "../appearanceProvider";

type LayoutToggleProps = {
  /** Accessible name for the icon-only button. */
  label?: string;
};

/**
 * One-click shell layout flip via the ambient AppearanceProvider — the icon
 * previews the arrangement the click switches to.
 */
export function LayoutToggle({ label = "Switch layout" }: LayoutToggleProps = {}) {
  const { layout, toggleLayout } = useAppearance();

  return (
    <Button variant="outline" size="icon" onClick={toggleLayout}>
      {layout === "sidebar" ? <PanelTop /> : <PanelLeft />}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Button>
  );
}
