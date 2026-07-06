import { Div, Img, Span } from "../html";
import { logoVariants } from "./variants";

export function Logo() {
  return (
    <Div layout="row" gap="sm">
      <Img variant="logo" src="/images/logo.png" alt="Demoz Logo" />
      <Span className={logoVariants()}>Demoz</Span>
    </Div>
  );
}

export * from "./variants";
