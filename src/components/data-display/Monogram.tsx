import { cn } from "@/lib/utils";
import { monogramColor } from "@/lib/scoring";

/**
 * A person's or school's initials in a circle.
 *
 * Used in the intro, the top ten, the table's school column, and the school
 * hero. Colour comes from a **deterministic hash of the name**, so "Ullens
 * School" is always the same swatch everywhere. `Math.random()` here would
 * reshuffle colours on every render, which reads as a bug.
 *
 * The six palette entries in `lib/scoring.ts` all sit at similar value and
 * chroma to the brand, so a row of monograms looks designed rather than like a
 * bag of skittles.
 */
export function Monogram({
  name,
  label,
  size = "md",
  /** Renders nothing and reserves the space when the name is not known yet. */
  blank = false,
  className,
}: {
  /** The full name the monogram is derived from. */
  name: string;
  /** Initials to show. Defaults to initials of `name`. */
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Reserved blank slot — see docs/04-COMPONENTS.md. */
  blank?: boolean;
  className?: string;
}) {
  const initials = label ?? initialsOf(name);

  return (
    <span
      // Decorative: the real name is always adjacent in text, so announcing
      // "BN, BNKS" again is noise for a screen reader.
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "font-serif font-bold",
        size === "sm" && "size-7 text-[0.625rem]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-12 text-sm",
        size === "xl" && "size-16 text-lg",
        className,
      )}
      style={blank ? { backgroundColor: "var(--color-sunken)" } : { backgroundColor: monogramColor(name) }}
    >
      {blank ? null : <span style={{ color: "rgba(255,255,255,0.92)" }}>{initials}</span>}
    </span>
  );
}

/** "Ullens School" -> "US", "St. Xavier's College, Jawlakhel" -> "SX". */
export function initialsOf(name: string): string {
  const words = name
    .replace(/[,'’.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^(the|of|and|at|in)$/i.test(w));
  if (words.length === 0) return "?";
  if (words.length === 1) return (words[0] as string).slice(0, 2).toUpperCase();
  return ((words[0] as string)[0] + (words[1] as string)[0]).toUpperCase();
}
