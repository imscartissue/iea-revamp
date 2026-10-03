import type { ReactNode } from "react";

import { AccentRule } from "@/components/site/Rule";
import { cn } from "@/lib/utils";

/**
 * The standard section header: bronze rule, eyebrow, heading, optional lede,
 * optional trailing action.
 *
 * This one component is the main reason every section on the site feels like it
 * belongs to the same publication. Use it rather than hand-rolling an h2.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  action,
  className,
  /** The lede is capped at 60ch — a standfirst wider than that is unreadable. */
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-3">
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <AccentRule />
            <span className="type-label text-bronze-ink">{eyebrow}</span>
          </div>
        ) : null}
        <h2 className="type-heading text-ink">{title}</h2>
        {lede ? <p className="type-subheading measure-tight text-ink-muted">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
