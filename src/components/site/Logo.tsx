import { cn } from "@/lib/utils";

/**
 * The site logo — `/public/brand/`.
 *
 * `light` (default) is for the canvas header; `dark` is for the ink-dark
 * overlay nav. Rendered as an `img` so it prints, survives forced-colors
 * mode, and exposes an accessible name via `alt`.
 */
export function Logo({
  size = "md",
  variant = "light",
  className,
}: {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <img
      src={`/brand/horizontal-${variant}.webp`}
      alt="IEA — Institute for Educational Accountability"
      loading="eager"
      decoding="async"
      className={cn(
        "block w-auto max-w-full object-contain",
        size === "sm" && "h-8",
        size === "md" && "h-10 md:h-12",
        size === "lg" && "h-12 md:h-16",
        className,
      )}
    />
  );
}
