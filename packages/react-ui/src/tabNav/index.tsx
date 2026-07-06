import type { ReactNode } from "react";
import { TabNavContainerEl, Nav } from "../html";

export * from "./variants";

type TabNavProps = {
  children: ReactNode;
};

export function TabNav({ children }: TabNavProps) {
  return (
    <TabNavContainerEl>
      <Nav variant="tabBar">{children}</Nav>
    </TabNavContainerEl>
  );
}
