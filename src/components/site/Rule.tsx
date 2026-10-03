import { cn } from "@/lib/utils";

/**
 * The hairline.
 *
 * The most-used component in the codebase, and the thing that makes the site
 * look printed rather than web-app. It replaces nearly every border and every
 * shadow: 90% of surfaces in this design are separated by a 1px rule, not by
 * elevation.
 *
 * `soft`   — internal dividers, table row separators
 * `rule`   — structural: between page sections
 * `strong` — bronze accent, active indicators
 *
 * Wraps the shadcn `Separator` (Radix) rather than a plain `<div>`, so it is
 * correctly marked up for assistive technology and inherits orientation
 * semantics. `decorative` defaults to true: these lines carry no meaning.
 */
export function Rule({
  orientation = "horizontal",
  tone = "soft",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  tone?: "soft" | "rule" | "strong";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        tone === "soft" && "bg-rule-soft",
        tone === "rule" && "bg-rule",
        tone === "strong" && "bg-rule-strong",
        className,
      )}
    />
  );
}

/**
 * The short bronze rule that sits above a section eyebrow. 28px wide, 2px —
 * the smallest bronze element on the site, and the reason every section reads
 * as part of the same publication.
 */
export function AccentRule({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("h-0.5 w-7 bg-bronze", className)} />;
}
