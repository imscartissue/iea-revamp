import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Re-themed from the shadcn new-york default.
 *
 * Changes: sharp corners (2px), `type-label` instead of `text-xs font-medium`,
 * no ring gymnastics (the global bronze outline covers focus), and three
 * `band-*` variants for score colours.
 *
 * The `band-*` variants are the important ones: a score band is a categorical
 * encoding, so it gets a muted tint plus the band colour as text. Never pair a
 * band with a filled saturated background — that reads as a status light.
 */
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap",
    "rounded-sm border font-sans",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-ink-inverse",
        // Tinted chip for type (Public/Private), grades, locations.
        outline: "border-rule-soft text-ink-muted",
        muted: "border-transparent bg-sunken text-ink-muted",
        // Bronze-tinted: rank pills, active filters.
        bronze: "border-transparent bg-bronze-soft text-bronze-ink",

        "band-strong": "border-transparent bg-band-strong/10 text-band-strong",
        "band-fair": "border-transparent bg-band-fair/10 text-band-fair",
        "band-weak": "border-transparent bg-band-weak/10 text-band-weak",
      },
      size: {
        sm: "px-1.5 py-0.5 type-label",
        md: "px-2 py-0.5 type-caption font-normal",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

function Badge({
  className,
  variant = "outline",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
