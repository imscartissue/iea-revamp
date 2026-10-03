import { cn } from "@/lib/utils";

/**
 * One figure, with a label above it and an optional qualifier below.
 *
 * Separated from its neighbour by a vertical hairline rather than a card
 * border — the numbers read as one related group, not three separate widgets.
 */
export function StatBlock({
  value,
  label,
  sublabel,
  className,
}: {
  value: string | number;
  label: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="type-numeric-lg text-ink">{value}</span>
      <span className="type-label text-ink-muted">{label}</span>
      {sublabel ? <span className="type-caption text-ink-faint">{sublabel}</span> : null}
    </div>
  );
}

/**
 * A row of `StatBlock`s divided by hairlines. Collapses to a wrapped row on
 * mobile where vertical rules would be meaningless.
 */
export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start gap-x-10 gap-y-6", className)}>{children}</div>
  );
}
