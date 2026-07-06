import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ButtonEl, type ButtonElProps } from "../html";
import { buttonVariants } from "./variants";

export type ButtonProps = ButtonElProps & { asChild?: boolean };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    if (asChild) {
      const { variant, size, fullWidth, className, ...rest } = props;
      return (
        <Slot
          ref={ref}
          className={buttonVariants({ variant, size, fullWidth, className })}
          {...rest}
        />
      );
    }
    return <ButtonEl ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button };
export * from "./variants";
