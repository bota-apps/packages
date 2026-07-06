import type { ReactNode } from "react";
import { Div, Nav } from "../html";

type SidebarLayoutProps = {
  brand: ReactNode;
  nav: ReactNode;
};

export function SidebarLayout({ brand, nav }: SidebarLayoutProps) {
  return (
    <Div layout="col" height="full" background="surface">
      <Div padding="lg">{brand}</Div>
      <Nav variant="sidebar">{nav}</Nav>
    </Div>
  );
}

export * from "./variants";
