import { Link } from "react-router";

import { Monogram } from "@/components/data-display/Monogram";
import type { School } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * School identity in a table row: monogram, full name, short name, location.
 *
 * The name is a real `<Link>`. An entire `<tr>` cannot be a link — that is
 * invalid HTML and it breaks keyboard navigation — so the accessible target
 * lives here, and `RankingsTable` adds a click handler on the row for
 * convenience only.
 *
 * The visible name truncates, with the full name kept for screen readers via
 * the link's `aria-label`. The longest real name in the dataset is "SOS
 * Hermann Gmeiner Higher Secondary School", so truncation is not hypothetical.
 */
export function SchoolCell({ school, compact = false }: { school: School; compact?: boolean }) {
  return (
    <Link
      to={`/school/${school.id}`}
      className="flex min-w-0 items-center gap-3 rounded-sm"
      aria-label={`${school.name}, rank ${school.rank}, overall ${school.overallScore.toFixed(1)}`}
    >
      <Monogram name={school.name} label={school.initials} size={compact ? "sm" : "md"} />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate font-serif font-bold text-ink group-hover:underline",
            compact ? "text-[0.9375rem] leading-tight" : "text-[0.9375rem] leading-tight",
          )}
        >
          {school.name}
        </span>
        {!compact ? (
          <span className="truncate type-caption text-ink-faint">
            {school.shortName} · {school.location}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/**
 * Rank numeral.
 *
 * Bronze and serif for the top three, muted below. This is the site's one
 * decorative use of the accent, and it is what makes the leaderboard read as a
 * leaderboard rather than a sorted table.
 */
export function RankCell({ rank }: { rank: number }) {
  return (
    <span className={cn("type-numeric-sm", rank <= 3 ? "text-bronze-ink" : "text-ink-faint")}>
      <span className="sr-only">Rank </span>
      {rank}
    </span>
  );
}
