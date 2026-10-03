import { cn } from "@/lib/utils";

/**
 * A 0-100 score as a bar.
 *
 * Hand-rolled SVG-free: a track div and a fill div. Replaces a chart library
 * for the single most-repeated visual on the site.
 *
 * The fill animates with `scale-x`, NOT `width`. Animating `width` forces the
 * browser to relayout on every frame; `transform` is composited. That single
 * choice is the difference between a bar that animates and a page that janks —
 * see docs/02-DESIGN-SYSTEM.md § The animation rule.
 *
 * The animation runs once on mount via a CSS class, so it costs no JavaScript
 * and is skipped entirely under `prefers-reduced-motion`.
 */
export function ScoreBar({
  value,
  max = 100,
  size = "md",
  tone,
  label,
  className,
  /** Stagger this bar. Only ever used for a short list, never 42 rows. */
  delayMs = 0,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Defaults to the band implied by `value`. */
  tone?: "strong" | "fair" | "weak";
  /** Accessible name. Pass it whenever the number is not adjacent in text. */
  label?: string;
  className?: string;
  delayMs?: number;
}) {
  const pct = max === 0 ? 0 : Math.max(0, Math.min(1, value / max)) * 100;
  const band = tone ?? (value >= 75 ? "strong" : value >= 50 ? "fair" : "weak");

  return (
    <div
      role="img"
      aria-label={label ?? `${value.toFixed(1)} out of ${max}`}
      className={cn(
        "w-full overflow-hidden rounded-full bg-sunken",
        size === "sm" && "h-[3px]",
        size === "md" && "h-1",
        size === "lg" && "h-1.5",
        className,
      )}
    >
      <div
        className={cn(
          "h-full origin-left rounded-full",
          // `animate-[grow-x_...]` with `transform` only.
          "animate-[score-bar-grow_600ms_cubic-bezier(0.16,1,0.3,1)_both]",
          band === "strong" && "bg-band-strong",
          band === "fair" && "bg-band-fair",
          band === "weak" && "bg-band-weak",
        )}
        style={{ width: `${pct}%`, animationDelay: `${delayMs}ms` }}
      />
    </div>
  );
}
