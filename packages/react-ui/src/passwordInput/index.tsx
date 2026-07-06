import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "../input";
import { Div } from "../html";
import { passwordInputToggleVariants } from "./variants";

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  function PasswordInput(props, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Div layout="relative">
        <Input {...props} ref={ref} type={showPassword ? "text" : "password"} />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className={passwordInputToggleVariants()}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </Div>
    );
  },
);

export * from "./variants";
