import { useMemo } from "react";
import { Link } from "react-router";

import { Monogram } from "@/components/data-display/Monogram";
import { redFlags } from "@/lib/data";

/**
 * Fisher–Yates shuffle over a fresh copy, so the source array is never
 * mutated and every element has an equal chance at every position.
 */
function shuffled<T>(list: readonly T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/**
 * The curated red-flag list, in a different order on every load.
 *
 * **No rank, no score.** The red-flag list is a separate set of schools with
 * published reasons, not a slice of the ranking. Shuffling is deliberate: a
 * fixed order would imply a severity ranking the site does not make, and a
 * repeat visitor should not see the same school first every time.
 *
 * Rendered on the `/rankings` red-flags view as a responsive grid of cards —
 * one column on a phone, two on `sm`, three on `lg`. The 1px `gap-px` over a
 * `rule-soft` background draws the hairline dividers between cells, matching
 * the site's printed look.
 */
export function RedFlagList() {
  // Shuffled once per mount. A full page reload is a new mount, so the order
  // changes on every reload — the behaviour the page is specified to have.
  const list = useMemo(() => shuffled(redFlags), []);

  return (
    <ul className="grid grid-cols-1 gap-px border border-rule-soft bg-rule-soft sm:grid-cols-2 lg:grid-cols-3">
      {list.map((redFlag) => (
        <li key={redFlag.id} className="bg-canvas">
          <Link
            to={`/red-flag/${redFlag.id}`}
            className="flex h-full flex-col gap-3 p-5 transition-colors hover:bg-bronze-wash"
          >
            <div className="flex items-center gap-3">
              <Monogram name={redFlag.name} size="md" />
              <span className="min-w-0 flex-1 truncate font-serif text-[0.9375rem] font-bold text-ink hover:underline">
                {redFlag.name}
              </span>
            </div>
            <span className="type-caption text-ink-faint">
              {redFlag.reasons.length} reason{redFlag.reasons.length === 1 ? "" : "s"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
