import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { schools } from "@/lib/data";
import type { School } from "@/lib/types";

/**
 * Previous / next by rank.
 *
 * A plain CSS transition on the underline, not the `layoutId` shared-element
 * highlight the original plan had. That was the one feature lost to dropping the
 * animation library (40.2 kB gzipped) — see `01-STACK.md § motion` — and a
 * transition is the right trade here anyway.
 *
 * Renders nothing at rank 1 or rank 42 rather than a disabled button: a control
 * that cannot do anything is noise, and the label would have to explain why.
 */
export function SchoolNavArrows({ school }: { school: School }) {
  const previous = school.rank > 1 ? schools[school.rank - 2] : undefined;
  const next = school.rank < schools.length ? schools[school.rank] : undefined;

  if (!previous && !next) return null;

  return (
    <nav aria-label="Other schools" className="flex flex-wrap items-center justify-between gap-4">
      {previous ? (
        <Button asChild variant="ghost" className="group justify-start">
          <Link to={`/school/${previous.id}`} className="flex items-center gap-2">
            <ChevronLeft aria-hidden="true" className="size-4" />
            <span className="flex flex-col items-start">
              <span className="type-caption text-ink-faint">Rank {previous.rank}</span>
              <span className="type-ui max-w-[14rem] truncate underline decoration-1 underline-offset-4 group-hover:decoration-2">
                {previous.name}
              </span>
            </span>
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {next ? (
        <Button asChild variant="ghost" className="group justify-end">
          <Link to={`/school/${next.id}`} className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="type-caption text-ink-faint">Rank {next.rank}</span>
              <span className="type-ui max-w-[14rem] truncate underline decoration-1 underline-offset-4 group-hover:decoration-2">
                {next.name}
              </span>
            </span>
            <ChevronRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
