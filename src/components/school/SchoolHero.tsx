import { Link } from "react-router";

import { Monogram } from "@/components/data-display/Monogram";
import { ScoreDial } from "@/components/school/ScoreDial";
import { bandColor } from "@/lib/scoring";
import { totalSchools } from "@/lib/data";
import type { School } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The header of a school page: identity on the left, the score on the right.
 *
 * Stacks vertically below `md` with the dial centred, because a 200px dial
 * beside a 40-character school name does not fit on a phone.
 */
export function SchoolHero({ school }: { school: School }) {
  return (
    <section className="pt-8 md:pt-14">
      <nav aria-label="Breadcrumb" className="type-caption text-ink-faint">
        <Link to="/rankings" className="text-bronze-ink underline underline-offset-4 hover:decoration-2">
          Rankings
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span aria-current="page">{school.name}</span>
      </nav>

      <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-5 text-center md:items-start md:text-left">
          <div className="flex items-center gap-4">
            <Monogram name={school.name} label={school.initials} size="xl" />
            <div className="flex flex-col gap-1">
              <span className="type-label text-bronze-ink">
                Rank {school.rank} of {totalSchools}
              </span>
              <span className="type-caption text-ink-faint">
                {school.type} · {school.gradeRange} · {school.location}
              </span>
            </div>
          </div>

          <h1 tabIndex={-1} className="type-title text-ink outline-none">
            {school.name}
          </h1>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3">
          <ScoreDial value={school.overallScore} />
          <span className={cn("type-caption", bandColor(school.overallScore))}>
            Overall, out of 100
          </span>
        </div>
      </div>
    </section>
  );
}
