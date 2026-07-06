import { cva } from "class-variance-authority";
import { modalContentVariants } from "../html/overlay";

export { overlayVariants as alertDialogOverlayVariants } from "../html/overlay";

/** Shared modal panel plus the alert-dialog slide-in/out motion. */
export const alertDialogContentVariants = cva(
  modalContentVariants({
    className:
      "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  }),
);
