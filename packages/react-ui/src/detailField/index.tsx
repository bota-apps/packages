import type { ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Div, P, Span } from "../html";
import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { useCopyToClipboard } from "../lib/useCopyToClipboard";
import { detailFieldIconVariants, infoRowVariants } from "./variants";

export * from "./variants";

type DetailFieldProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  copyable?: boolean;
  copyValue?: string;
};

export function DetailField({ icon, label, value, copyable, copyValue }: DetailFieldProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Div layout="rowStart" gap="md">
      {icon && <Div className={detailFieldIconVariants()}>{icon}</Div>}
      <Div>
        <P variant="label">{label}</P>
        <Div layout="row" gap="xs" className="items-center">
          <P variant="muted">{value}</P>
          {copyable && copyValue && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 [&_svg]:size-3"
                  onClick={() => copy(copyValue)}
                >
                  {copied ? <Check /> : <Copy />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
            </Tooltip>
          )}
        </Div>
      </Div>
    </Div>
  );
}

type InfoRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <Div layout="row" gap="sm" className={infoRowVariants()}>
      <Div className="[&>svg]:h-4 [&>svg]:w-4">{icon}</Div>
      <Span>{children}</Span>
    </Div>
  );
}
