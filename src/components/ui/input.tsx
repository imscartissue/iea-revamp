import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Re-themed: 44px tall (the mobile touch-target minimum — the stock `h-9` is
 * 36px and fails the touch guideline), 2px radius, no shadow, and a 1px rule
 * border instead of the stock translucent `border-input` + `dark:bg-input/30`.
 *
 * Placeholder and selection use the palette, not `primary`.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-sm border border-rule-soft bg-surface px-3 py-2",
        "font-sans type-ui text-ink",
        "transition-colors duration-[120ms]",
        "placeholder:text-ink-faint",
        "selection:bg-bronze-soft selection:text-ink",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-band-weak",
        "md:h-10",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
