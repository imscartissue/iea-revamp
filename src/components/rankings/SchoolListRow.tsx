import { Link } from "react-router";

import { Monogram } from "@/components/data-display/Monogram";
import { ScoreBar } from "@/components/data-display/ScoreBar";
import { band } from "@/lib/scoring";
import type { School } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The mobile representation of a ranking row.
 *
 * Not a horizontally-scrolling table. A nine-column table on a 360px screen
 * means either pinch-zooming or a sticky first column and a lot of horizontal
 * scroll — both are worse than showing less information better. This shows the
 * two things that matter on a phone (who, and what) and puts the metrics
 * underneath in a compact grid.
 *
 * Rendered only below `md`. It is a different component rather than the same
 * table with responsive cells, because a table whose meaning changes with
 * viewport width is very hard to keep accessible.
 */
export function SchoolListRow({ school }: { school: School }) {
  const b = band(school.overallScore);

  return (
    <li className="border-b border-rule-soft last:border-b-0">
      <Link
        to={`/school/${school.id}`}
        className="flex items-center gap-3 py-4 transition-colors hover:bg-bronze-wash"
        aria-label={`${school.name}, rank ${school.rank}, overall ${school.overallScore.toFixed(1)}`}
      >
        <span className="w-6 shrink-0 text-right">
          <span
            className={cn("type-numeric-sm", school.rank <= 3 ? "text-bronze-ink" : "text-ink-faint")}
          >
            {school.rank}
          </span>
        </span>

        <Monogram name={school.name} label={school.initials} size="sm" />

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-serif text-[0.9375rem] font-bold text-ink">
            {school.name}
          </span>
          <span className="truncate type-caption text-ink-faint">
            {school.shortName} · {school.type}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "type-numeric-sm",
              b === "strong" && "text-band-strong",
              b === "fair" && "text-band-fair",
              b === "weak" && "text-band-weak",
            )}
          >
            {school.overallScore.toFixed(1)}
          </span>
          <ScoreBar value={school.overallScore} size="sm" className="w-14" />
        </span>
      </Link>

      {/* The four metrics, compactly. Present on mobile because the table
          cannot be, and a rank without its breakdown is not comparable. */}
      <dl className="grid grid-cols-4 gap-2 pb-4 pl-[3.75rem] pr-0">
        <Metric label="Env." value={school.categories.environment} />
        <Metric label="Infra" value={school.categories.infrastructure} />
        <Metric label="Cost" value={school.categories.cost} />
        <Metric label="Benefit" value={school.categories.benefit} />
      </dl>
    </li>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="type-caption text-ink-faint">{label}</dt>
      <dd
        className={cn(
          "type-numeric-sm",
          value >= 75 && "text-band-strong",
          value >= 50 && value < 75 && "text-band-fair",
          value < 50 && "text-band-weak",
        )}
      >
        {value.toFixed(0)}
      </dd>
    </div>
  );
}
