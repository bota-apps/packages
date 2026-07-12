import { cva, type VariantProps } from "class-variance-authority";

/**
 * Hero section wrapper — relative + overflow-hidden so the decorative
 * treatment layer clips to the section bounds.
 */
export const heroVariants = cva("relative overflow-hidden py-20 md:py-32", {
  variants: {
    align: {
      center: "text-center",
      start: "text-left",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

/** Content wrapper — stacks above the treatment layer and aligns caller content. */
export const heroContentVariants = cva("container relative mx-auto flex flex-col px-4", {
  variants: {
    align: {
      center: "items-center",
      start: "items-start",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

/**
 * Decorative background treatment — every value derives from theme tokens so
 * brand overrides and the reversed dark-mode ramps flow through with no
 * `dark:` variants. Tailwind v3 constraint: never write `var()` with a
 * space-separated fallback inside a color function here.
 */
export const heroTreatmentVariants = cva("pointer-events-none absolute inset-0", {
  variants: {
    treatment: {
      none: "",
      // Soft radial wash from the primary ramp; the reversed dark ramp turns
      // it into a deep tint automatically.
      glow: "bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-100))_0%,transparent_60%)]",
      // Subtle dot grid from the border token, fading out toward the bottom.
      grid: "bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]",
      // Flat primary-tint wash.
      tint: "bg-primary-50",
      // Animated: two blurred ramp-tinted blobs drifting slowly (blob styles
      // live in heroAuroraBlobVariants; Hero renders them inside this layer).
      aurora: "",
    },
  },
  defaultVariants: {
    treatment: "none",
  },
});

/**
 * Aurora blobs — soft color fields behind the hero content, drifting on the
 * preset's `drift` keyframes. Transform-only animation (compositor-friendly)
 * and `motion-reduce:animate-none`, so reduced-motion users get a static
 * gradient wash. Colors resolve through the numeric ramps: brands and the
 * reversed dark ramps restyle them with no extra variants.
 */
export const heroAuroraBlobVariants = cva(
  "absolute rounded-full blur-3xl motion-reduce:animate-none",
  {
    variants: {
      blob: {
        primary: "-top-1/4 left-[8%] h-[70%] w-[55%] bg-primary-200/60 animate-drift",
        accent: "-bottom-1/4 right-[4%] h-[65%] w-1/2 bg-accent-100/60 animate-drift-reverse",
      },
    },
  },
);

export type HeroTreatment = NonNullable<VariantProps<typeof heroTreatmentVariants>["treatment"]>;
export type HeroAlign = NonNullable<VariantProps<typeof heroVariants>["align"]>;
