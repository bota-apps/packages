import { forwardRef, type ReactNode } from "react";
import type { PrintDocumentType } from "./types";

type PrintRootProps = {
  children: ReactNode;
  documentType?: PrintDocumentType;
};

export const PrintRoot = forwardRef<HTMLDivElement, PrintRootProps>(function PrintRoot(
  { children, documentType },
  ref,
) {
  return (
    <div ref={ref} data-document-type={documentType}>
      {children}
    </div>
  );
});
