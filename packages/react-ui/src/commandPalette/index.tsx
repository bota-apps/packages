/**
 * commandPalette — a keyboard-first action launcher (⌘K pattern).
 *
 * Wraps cmdk for filtering, ranking, and roving-focus behavior. Two entry
 * points:
 *   - `CommandPalette` — the dialog form: mount once, control with
 *     `open`/`onOpenChange` (pair with `useCommandPaletteShortcut`).
 *   - `Command` + subcomponents — the bare surface, for embedding the same
 *     list inside a popover or page.
 */
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import { VisuallyHidden } from "../visuallyHidden";
import {
  commandEmptyVariants,
  commandGroupVariants,
  commandInputVariants,
  commandInputWrapperVariants,
  commandItemVariants,
  commandListVariants,
  commandSeparatorVariants,
  commandShortcutVariants,
  commandVariants,
} from "./variants";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={cn(commandVariants(), className)} {...props} />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className={commandInputWrapperVariants()} cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(commandInputVariants(), className)}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={cn(commandListVariants(), className)} {...props} />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty ref={ref} className={cn(commandEmptyVariants(), className)} {...props} />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group ref={ref} className={cn(commandGroupVariants(), className)} {...props} />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(commandSeparatorVariants(), className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item ref={ref} className={cn(commandItemVariants(), className)} {...props} />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(commandShortcutVariants(), className)} {...props} />;
}
CommandShortcut.displayName = "CommandShortcut";

export type CommandPaletteProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible dialog title (screen readers only). Override for non-English apps. */
  label?: string;
  /** Accessible dialog description (screen readers only). */
  description?: string;
};

/** The ⌘K dialog: a floating command surface on the overlay tier. */
function CommandPalette({
  open,
  onOpenChange,
  label = "Command palette",
  description = "Type a command or search",
  children,
  ...props
}: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <VisuallyHidden>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
        <Command
          className="[&_[cmdk-input-wrapper]]:pr-10 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0"
          {...props}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
CommandPalette.displayName = "CommandPalette";

/**
 * Global keyboard shortcut for a command palette (⌘K / Ctrl+K by default).
 * Returns nothing — pass the same state setter that controls `open`.
 */
function useCommandPaletteShortcut(
  onToggle: (updater: (open: boolean) => boolean) => void,
  key = "k",
) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onToggle((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onToggle, key]);
}

export * from "./variants";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandPalette,
  useCommandPaletteShortcut,
};
