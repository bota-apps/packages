import type { ReactNode } from "react";
import { Div, H, P, SectionEl } from "../html";
import { cn } from "../lib/utils";
import {
  heroAuroraBlobVariants,
  heroContentVariants,
  heroTreatmentVariants,
  heroVariants,
  type HeroAlign,
  type HeroTreatment,
} from "./variants";

export * from "./variants";

export type HeroProps = {
  /** Decorative background treatment layered behind the content. */
  treatment?: HeroTreatment;
  /** Horizontal alignment of the composed content. */
  align?: HeroAlign;
  /** Headline for the standard hero layout. Compose `children` instead for full control. */
  title?: ReactNode;
  /** Supporting copy under the headline. */
  description?: string;
  /** Call-to-action row under the description. */
  actions?: ReactNode;
  /** Free-form content, rendered after the structured slots (or alone). */
  children?: ReactNode;
  className?: string;
};

/**
 * Hero — the marketing/landing section: an h1-led content block over an
 * optional tokenized background treatment (glow / grid / tint / aurora). The
 * treatment layer is purely visual: aria-hidden, absolutely positioned,
 * pointer-events-none — and because it resolves through the numeric ramps it
 * adapts to brands and dark mode with no extra variants. The animated aurora
 * treatment is transform-only and stills itself under reduced motion.
 */
export function Hero({
  treatment = "none",
  align = "center",
  title,
  description,
  actions,
  children,
  className,
}: HeroProps) {
  const centered = align === "center";
  return (
    <SectionEl className={cn(heroVariants({ align }), className)}>
      {treatment !== "none" && (
        <Div aria-hidden="true" className={heroTreatmentVariants({ treatment })}>
          {treatment === "aurora" && (
            <>
              <Div className={heroAuroraBlobVariants({ blob: "primary" })} />
              <Div className={heroAuroraBlobVariants({ blob: "accent" })} />
            </>
          )}
        </Div>
      )}
      <Div className={heroContentVariants({ align })}>
        {title !== undefined && (
          <H as="h1" variant="display" className="mb-6">
            {title}
          </H>
        )}
        {description !== undefined && (
          <P
            className={cn("text-lg md:text-xl text-muted-foreground max-w-2xl mb-8", {
              "mx-auto": centered,
            })}
          >
            {description}
          </P>
        )}
        {actions !== undefined && (
          <Div layout="row" gap="md" className={cn({ "justify-center": centered })}>
            {actions}
          </Div>
        )}
        {children}
      </Div>
    </SectionEl>
  );
}
