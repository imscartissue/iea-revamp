import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Rule } from "@/components/site/Rule";
import { ScoreBar } from "@/components/data-display/ScoreBar";
import { StatBlock } from "@/components/data-display/StatBlock";
import { bandColor } from "@/lib/scoring";
import { formatCount, formatCountPlus, formatDate } from "@/lib/format";
import { meta, redFlags, schools, totalSchools } from "@/lib/data";

/**
 * The landing masthead.
 *
 * Editorial, not marketing. The headline is a claim the data supports, and the
 * only decoration is a single hairline above the fold. No illustration, no hero
 * image, no gradient — all three would fight the type, and the type is the
 * design.
 *
 * `--i` and the animation delays here exist because the intro's exit stagger
 * IS this page's entrance animation. A second stagger on top of it would be two
 * animated moments on one route, which the design system explicitly forbids.
 */
export function Hero() {
  const top3 = schools.slice(0, 3);
  // A short teaser of the curated red-flag list. No rank or score: it is not a
  // slice of the ranking. The full, shuffled list lives on /rankings.
  const redFlagPreview = redFlags.slice(0, 3);

  return (
    <section className="pt-12 md:pt-20">
      {/* These settle in when the intro's wipe reveals the page.
          `--intro-reveal-delay` is 0ms unless the overlay is genuinely on
          screen, so a skipped intro shows the page immediately instead of
          leaving it invisible for two seconds. Staggered in 40ms steps. */}
      <div className="animate-[page-settle_420ms_cubic-bezier(0.16,1,0.3,1)_both]">
        {/*
          Headline left, report button right — a real two-column grid, not a
          wrapping flex row, so the button sits beside the headline on `md` and
          up instead of dropping below it whenever the viewport gets tight.
          Stacked on mobile, where side-by-side would crush both.
        */}
        <div className="grid items-center gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <span className="type-label text-bronze-ink">Edition {meta.edition}</span>

            <h1
              tabIndex={-1}
              className="type-display measure mt-5 text-ink outline-none"
              style={{ animationDelay: "var(--intro-reveal-delay)" }}
            >
              The worst and the best
              <br />
              of top high schools.
            </h1>
          </div>

          <div className="flex flex-col gap-3 justify-self-start md:justify-self-end">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/reports">Annual report</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/methodology">Methodology</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/about">About us</Link>
            </Button>
          </div>
        </div>
      </div>

      <Rule tone="rule" className="mt-10 md:mt-14" />

      {/*
        Three columns on `lg`, in this order:

          stats  ·  red flag schools  ·  top of the table

        The site's own pages live as buttons beside the headline instead, so
        the numbers stand alone here. The middle is the bottom three, because a
        ranking that only shows the top is half an argument. The right is the
        top three, which is what the page is for.

        Each column is wrapped in `Reveal` so it fades and rises into place as
        the reader scrolls down. `staggerMs` makes the buttons inside each
        column cascade one after another.
      */}
      <div className="grid gap-10 pt-8 md:grid-cols-2 md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-12">
        {/*
          `min-w-0` + `flex-wrap`: the published date is wide, and a grid/flex
          item defaults to `min-width: auto`, so without both the row would
          force the column wider than its track and spill into the red-flag
          column beside it. Wrapping keeps each figure inside its own column.
        */}
        <Reveal className="min-w-0" delayMs={60}>
          <div className="flex flex-wrap items-start gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
            <StatBlock value={formatCount(totalSchools)} label="schools" />
            <StatBlock value={formatCountPlus(meta.totalResponses)} label="responses" />
            <StatBlock value={formatDate(meta.publicationDate)} label="published" />
          </div>
        </Reveal>

        {/*
          The red-flag schools. A curated list with published reasons, not a
          slice of the ranking — so it carries no rank or score. The heading
          links to the full list on /rankings, and each name to its reasons.
        */}
        <Reveal className="min-w-0" delayMs={120}>
          <div className="min-w-0">
            <h2 className="type-label">
              <Link
                to="/rankings?view=redflags"
                className="rounded-sm text-ink-faint underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-ink"
              >
                Red flag schools <span aria-hidden="true">→</span>
              </Link>
            </h2>
            <ol className="mt-4 flex flex-col">
              {redFlagPreview.map((redFlag) => (
                <li key={redFlag.id} className="border-b border-rule-soft py-3 last:border-b-0">
                  <Link
                    to={`/red-flag/${redFlag.id}`}
                    className="flex min-w-0 items-stretch gap-3 rounded-sm"
                  >
                    <span aria-hidden="true" className="w-1 shrink-0 bg-band-weak" />
                    <span className="truncate font-serif text-[0.9375rem] font-bold text-ink hover:underline">
                      {redFlag.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              to="/rankings?view=redflags"
              className="type-caption mt-4 inline-block text-bronze-ink underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              See all {redFlags.length} flagged schools
            </Link>
          </div>
        </Reveal>

        {/* The top three, so the page makes its argument before you scroll.
            The heading links to the full table. */}
        <Reveal className="min-w-0 md:w-72" delayMs={180}>
          <aside className="min-w-0 md:w-72">
            <h2 className="type-label">
              <Link
                to="/rankings?view=all"
                className="rounded-sm text-ink-faint underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-ink"
              >
                Top of the table <span aria-hidden="true">→</span>
              </Link>
            </h2>
            <ol className="mt-4 flex flex-col">
              {top3.map((school, i) => (
                <li
                  key={school.id}
                  className="flex flex-col gap-2 border-b border-rule-soft py-3 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      to={`/school/${school.id}`}
                      className="flex min-w-0 items-baseline gap-2 rounded-sm"
                    >
                      <span className="font-serif text-numeric-sm text-bronze-ink">{school.rank}</span>
                      <span className="truncate font-serif text-[0.9375rem] font-bold text-ink hover:underline">
                        {school.name}
                      </span>
                    </Link>
                    <span className={`type-numeric-sm ${bandColor(school.overallScore)}`}>
                      {school.overallScore.toFixed(1)}
                    </span>
                  </div>
                  <ScoreBar
                    value={school.overallScore}
                    size="sm"
                    delayMs={2160 + i * 60}
                    label={`${school.name}, overall ${school.overallScore.toFixed(1)}`}
                  />
                </li>
              ))}
            </ol>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
