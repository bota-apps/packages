import { Div, Img, Span } from "../html";
import { logoVariants } from "./variants";

export type LogoProps = {
  /** Wordmark text rendered next to the mark. */
  name?: string;
  /** Logo image source. */
  src?: string;
  /** Image alt text — defaults to "<name> logo". */
  alt?: string;
};

export function Logo({ name = "Bota Apps", src = "/images/logo.png", alt }: LogoProps) {
  return (
    <Div layout="row" gap="sm">
      <Img variant="logo" src={src} alt={alt ?? `${name} logo`} />
      <Span className={logoVariants()}>{name}</Span>
    </Div>
  );
}

export * from "./variants";
