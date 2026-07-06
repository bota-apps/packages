import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  AccordionContainerEl,
  AccordionItemEl,
  AccordionTriggerEl,
  AccordionContentEl,
  AccordionInnerEl,
} from "../html";

const AccordionContext = React.createContext<{
  value: string | null;
  onValueChange: (value: string) => void;
}>({
  value: null,
  onValueChange: () => {},
});

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    collapsible?: boolean;
  }
>(
  (
    {
      children,
      type = "single",
      value,
      defaultValue,
      onValueChange,
      collapsible = false,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | null>(
      value !== undefined ? value : defaultValue || null,
    );

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue((prevValue) => {
            if (type === "single") {
              return prevValue === newValue && collapsible ? null : newValue;
            }
            return newValue;
          });
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange, type, collapsible],
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    return (
      <AccordionContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
        <AccordionContainerEl ref={ref} {...props}>
          {children}
        </AccordionContainerEl>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value: _value, ...props }, ref) => {
  return <AccordionItemEl ref={ref} {...props} />;
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(({ children, value, ...props }, ref) => {
  const { value: accordionValue, onValueChange } = React.useContext(AccordionContext);
  const isOpen = value ? accordionValue === value : false;

  return (
    <AccordionTriggerEl
      ref={ref}
      onClick={() => value && onValueChange(value)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionTriggerEl>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ children, value, ...props }, ref) => {
  const { value: accordionValue } = React.useContext(AccordionContext);
  const isOpen = value ? accordionValue === value : false;

  if (!isOpen) {
    return null;
  }

  return (
    <AccordionContentEl ref={ref} data-state={isOpen ? "open" : "closed"} {...props}>
      <AccordionInnerEl>{children}</AccordionInnerEl>
    </AccordionContentEl>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

export * from "./variants";
