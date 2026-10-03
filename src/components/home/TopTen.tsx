import { Link } from "react-router";

import { Rule } from "@/components/site/Rule";
import { AccentRule } from "@/components/site/Rule";
import { ScoreBar } from "@/components/data-display/ScoreBar";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { Button } from "@/components/ui/button";
import { bandColor } from "@/lib/scoring";
import { schools, totalSchools } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The leaderboard, as a list.
 *
 * A numbered list rather than a table, on purpose. A ranking is an argument, and
 * a list lets the rank numeral, the name and the score do it without a grid. The
 * bar appears on hover/focus only, so ten rows read as ten clean lines of type
 * rather than ten identical widgets.
 *
 * The top three get a short bronze rule above, which is the site's only
 * decorative nod to rank.
 */
export function TopTen() {
  const top = schools.slice(0, 10);

  return (
    <section className="defer-paint">
      <SectionHeader eyebrow="The ranking" title="Top ten schools" />

      <ol className="mt-8 flex flex-col border-t border-rule">
        {top.map((school) => (
          <li
            key={school.id}
            className={cn(
              "group relative border-b border-rule-soft",
              "transition-colors duration-[120ms] hover:bg-bronze-wash",
              "focus-within:bg-bronze-wash",
            )}
          >
            {school.rank <= 3 ? (
              <AccentRule className="absolute left-0 top-0 w-10" />
            ) : null}

            <Link
              to={`/school/${school.id}`}
              className="flex items-center gap-4 py-4 pl-1 pr-2"
              aria-label={`${school.name}, rank ${school.rank}, overall ${school.overallScore.toFixed(1)}`}
            >
              <span className="w-8 shrink-0 text-right font-serif text-numeric-sm text-bronze-ink">
                {school.rank}
              </span>

              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-serif text-heading leading-tight font-bold text-ink group-hover:underline">
                  {school.name}
                </span>
                <span className="truncate type-caption text-ink-faint">
                  {school.shortName} · {school.location} · {school.type}
                </span>
              </span>

              <span
                className={cn(
                  "type-numeric shrink-0",
                  bandColor(school.overallScore),
                )}
              >
                {school.overallScore.toFixed(1)}
              </span>

              {/* Hidden until hover or keyboard focus: the bar is a
                  secondary signal here, not the primary one. */}
              <span className="hidden w-24 shrink-0 opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 group-focus-within:opacity-100 lg:block">
                <ScoreBar
                  value={school.overallScore}
                  size="sm"
                  label={`Overall ${school.overallScore.toFixed(1)}`}
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Rule tone="rule" className="mt-10" />

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button asChild variant="outline">
          <Link to="/rankings">See all {totalSchools}</Link>
        </Button>
        <Button asChild variant="link">
          <Link to="/methodology">Methodology behind this</Link>
        </Button>
      </div>
    </section>
  );
}
