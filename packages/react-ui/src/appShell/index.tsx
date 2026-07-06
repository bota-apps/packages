import type { ReactNode } from "react";
import { Logo } from "../logo";
import { Stack } from "../layout";
import { Text } from "../typography";
import { Div, Main } from "../html";
import { cn } from "../lib/utils";
import { appShellVariants } from "./variants";

export * from "./variants";

type AppShellDefaultProps = {
  variant?: "default";
  header: ReactNode;
  children: ReactNode;
};

type AppShellAuthProps = {
  variant: "auth";
  children: ReactNode;
  footer?: ReactNode;
};

type AppShellProps = AppShellDefaultProps | AppShellAuthProps;

export function AppShell(props: AppShellProps) {
  if (props.variant === "auth") {
    const { children, footer } = props;
    return (
      <Div layout="colCenter" className={cn(appShellVariants({ variant: "auth" }))}>
        <Stack gap="lg" className="w-full max-w-md">
          <Div layout="center">
            <Logo />
          </Div>
          {children}
          {footer !== undefined && footer !== null && (
            <Text size="sm" tone="muted" align="center">
              {footer}
            </Text>
          )}
        </Stack>
      </Div>
    );
  }

  const { header, children } = props;
  return (
    <Div layout="col" className={cn(appShellVariants({ variant: "default" }))}>
      {header}
      <Main variant="app">{children}</Main>
    </Div>
  );
}
