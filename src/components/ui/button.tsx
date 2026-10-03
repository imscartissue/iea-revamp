import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Re-themed from the shadcn new-york default to docs/02-DESIGN-SYSTEM.md.
 *
 * Changes from the stock version:
 *   - `default` is an ink-navy fill, not a brand blue
 *   - added `link` (bronze, underlined) and `subtle` (bronze tint) variants —
 *     the stock `link` is a plain primary-coloured text with no underline
 *   - removed `destructive`; nothing in this design deletes, and a red fill
 *     would drag traffic-light semantics into an editorial palette
 *   - no shadows, radius 4px, `type-ui` instead of `text-sm font-medium`
 *   - focus is the global 2px bronze outline, so no ring gymnastics here
 *
 * Rule: add variants to this file, never bolt a long `className` onto a call
 * site. That is what keeps the site looking like one thing.
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-sans font-normal",
    "transition-colors duration-[120ms]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
    "disabled:pointer-events-none disabled:opacity-50",
    // Icons inherit sizing unless explicitly sized.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // Ink fill. The primary action on a page. One per screen, at most.
        default: "bg-ink text-ink-inverse hover:bg-ink/90 active:bg-ink/95",
        // 1px rule, no fill. The secondary action.
        outline:
          "border border-rule bg-transparent text-ink hover:bg-bronze-wash active:bg-bronze-soft",
        // Text that behaves like a button — used on tinted surfaces.
        ghost: "text-ink-muted hover:bg-bronze-wash hover:text-ink",
        // A real link. Underlined, bronze, offset — the site's one accent.
        link: "text-bronze-ink underline decoration-1 underline-offset-4 hover:decoration-2",
        // Quiet tinted chip: filters, tags, inactive toggles.
        subtle: "bg-bronze-soft text-bronze-ink hover:bg-bronze-soft/70",
      },
      size: {
        sm: "h-8 px-3 type-label has-[>svg]:px-2",
        md: "h-10 px-4 type-ui has-[>svg]:px-3",
        lg: "h-12 px-6 type-ui has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the single child element instead of a <button>. Use for links. */
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
