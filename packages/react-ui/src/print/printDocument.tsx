import type { ReactNode } from "react";

type PrintDocumentProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function PrintDocument({ children }: PrintDocumentProps) {
  return <div className="print-document">{children}</div>;
}
