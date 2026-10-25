import { useState, type ReactNode } from "react";

import { isoDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * A collapsible FAQ item.
 *
 * A `<button>` wrapping the question, with the answer in a region that is hidden
 * until it is opened. `aria-expanded` on the button and `aria-hidden` on the
 * answer keep the state announced; the chevron is decorative.
 *
 * Items start closed, so a page never opens with a wall of caveats. This is why
 * the dimensions on `/methodology` are a FAQ rather than an always-open list.
 */
export function FaqItem({ question, answer }: { question: string; answer: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-rule-soft last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-baseline gap-4 rounded-sm py-4 text-left transition-colors duration-[120ms] hover:bg-bronze-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      >
        <span className="type-heading flex-1 text-ink">{question}</span>
        <span
          aria-hidden="true"
          className={cn(
            "type-caption shrink-0 text-ink-faint transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-brand",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{answer}</div>
        </div>
      </div>
    </div>
  );
}

/** One term/value row inside a provenance `<dl>`. */
export function Datum({ term, value, iso }: { term: string; value: string; iso?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule-soft pb-3">
      <dt className="type-label w-24 shrink-0 text-ink-faint md:w-48">{term}</dt>
      <dd className="type-ui text-ink">{iso ? <time dateTime={isoDate(iso)}>{value}</time> : value}</dd>
    </div>
  );
}
