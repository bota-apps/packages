import type { RefObject } from "react";

export type PrintDocumentType =
  | "task-summary"
  | "project-summary"
  | "member-summary"
  | "organization-profile"
  | "report"
  | "generic";

export type PrintPaperSize = "A4" | "Letter";
export type PrintOrientation = "portrait" | "landscape";

export type PrintLayoutOptions = {
  paperSize?: PrintPaperSize;
  orientation?: PrintOrientation;
  margin?: string;
};

export type PrintDocumentMetadata = {
  title?: string;
  subtitle?: string;
  organizationName?: string;
  entityName?: string;
  generatedAt?: string;
  generatedBy?: string;
};

export type UsePrintOptions = {
  title?: string;
  copyGlobalStyles?: boolean;
  pageStyle?: string;
  layout?: PrintLayoutOptions;
  documentType?: PrintDocumentType;
  featureId?: string;
  metadata?: PrintDocumentMetadata;
  onBeforePrint?: () => void | Promise<void>;
  onAfterPrint?: () => void;
  onPrintError?: (error: unknown) => void;
  waitFor?: () => Promise<void>;
};

export type UsePrintResult<T extends HTMLElement> = {
  printRef: RefObject<T | null>;
  print: () => Promise<void>;
  isPrinting: boolean;
  canPrint: boolean;
};
