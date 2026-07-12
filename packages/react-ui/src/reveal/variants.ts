import { cva, type VariantProps } from "class-variance-authority";

/**
 * Reveal wrapper — transitions opacity/transform from a hidden entrance pose
 * to the resting state on the motion tokens.
 *
 * `state` is machine-driven, not caller-driven:
 * - `initial` — resting state with no pose applied. This is what servers,
 *   reduced-motion users, and environments without IntersectionObserver
 *   render: content is simply visible.
 * - `hidden` — the pre-entrance pose, applied only after mount when an
 *   entrance can actually run.
 * - `shown` — transitions back to rest.
 *
 * The transition classes live in the base so the hidden→shown flip animates;
 * motion-reduce:transition-none is a second line of defense behind the
 * token collapse in theme.css.
 */
export const revealVariants = cva(
  "transition-[opacity,transform] duration-slow ease-standard motion-reduce:transition-none",
  {
    variants: {
      effect: {
        fade: "",
        fadeUp: "",
        fadeDown: "",
        zoom: "",
      },
      state: {
        initial: "",
        hidden: "opacity-0",
        shown: "opacity-100 translate-y-0 scale-100",
      },
    },
    compoundVariants: [
      { effect: "fadeUp", state: "hidden", class: "translate-y-6" },
      { effect: "fadeDown", state: "hidden", class: "-translate-y-6" },
      { effect: "zoom", state: "hidden", class: "scale-95" },
    ],
    defaultVariants: {
      effect: "fadeUp",
      state: "initial",
    },
  },
);

export type RevealEffect = NonNullable<VariantProps<typeof revealVariants>["effect"]>;
