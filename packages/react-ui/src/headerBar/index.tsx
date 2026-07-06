import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import { VisuallyHidden } from "../visuallyHidden";
import {
  Header,
  HeaderBarContentEl,
  HeaderBarBrandEl,
  HeaderBarNavEl,
  HeaderBarActionsEl,
  ButtonEl,
} from "../html";

type HeaderBarProps = {
  brand: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
  mobileNav?: ReactNode;
};

export function HeaderBar({ brand, nav, actions, mobileNav }: HeaderBarProps) {
  return (
    <Header variant="sticky">
      <HeaderBarContentEl>
        {mobileNav && (
          <Sheet>
            <SheetTrigger asChild>
              <ButtonEl variant="ghost" size="icon" responsive="mobileOnly">
                <Menu />
                <VisuallyHidden>Toggle menu</VisuallyHidden>
              </ButtonEl>
            </SheetTrigger>
            <SheetContent side="left" padding="none" title="" description="">
              {mobileNav}
            </SheetContent>
          </Sheet>
        )}

        <HeaderBarBrandEl>{brand}</HeaderBarBrandEl>

        {nav && <HeaderBarNavEl>{nav}</HeaderBarNavEl>}

        <HeaderBarActionsEl>{actions}</HeaderBarActionsEl>
      </HeaderBarContentEl>
    </Header>
  );
}

export * from "./variants";
