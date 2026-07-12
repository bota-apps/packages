import type { ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Div, P, Span } from "../html";
import { Text } from "../html/typography";
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
      {/* min-w-0 lets the value column shrink inside the flex row so long
          values wrap instead of pushing the field wider than its container. */}
      <Div className="min-w-0">
        <P variant="label">{label}</P>
        <Div layout="row" gap="xs" className="items-center">
          {/* A div host: `value` accepts arbitrary nodes, and block-level
              content (e.g. a Text paragraph) may not nest inside <p>. */}
          <Text as="div" size="sm" tone="muted" className="min-w-0 break-words">
            {value}
          </Text>
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
