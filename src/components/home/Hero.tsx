import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/Container";
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
 * The masthead block sits on a FULL-BLEED INK NAVY band that starts at page
 * y=0 — it pulls up under the sticky header with a negative margin, so on `/`
 * the header goes transparent and the chrome, the band and THE MARCH photo
 * behind it all read as one continuous block from edge to edge.
 *
 * The photo is washed back with two ink veils: horizontal protects the text
 * column (solid at the left edge), vertical protects the standfirst and the
 * band's bottom edge. What survives is a window of photo in the upper right,
 * where the only occupant is the inverted CTA button. Light type on navy; the
 * stats and lists below stay on paper, in the same card/row design used
 * elsewhere, so the page makes its argument before the reader scrolls.
 */
export function Hero() {
  const top5 = schools.slice(0, 5);
  const flaggedIds = new Set([
    "ace-higher-secondary-school",
    "vs-niketan-secondary-school",
    "st-marys-school",
    "kathmandu-model-college",
  ]);
  const flaggedPreview = redFlags.filter((r) => flaggedIds.has(r.id));

  return (
    <section>
      {/*
        THE BAND — full-bleed ink navy, starting ABOVE this section's flow
        position so it slides under the sticky header (h-20/h-24 + 1px border;
        we overshoot to -mt-24/-mt-28 and restore it as pt-36/pt-48, so the
        eyebrow lands exactly where the old pt-12/md:pt-20 put it, with no
        1px sliver of paper at the top of the page).

        Decorative photo layer: aria-hidden, pointer-events-none, clipped by
        the band's overflow-hidden. Readability on navy inverts the paper
        version: the hazard is the photo's WHITE pixels (the march signs), so
        the veils are ink, not canvas. Horizontal is solid ink at the left
        edge (eyebrow, headline, standfirst), vertical is solid ink at the
        bottom edge (CTA links, band seam). The photo lives in the upper
        right at ~30% — behind the headline (large type, easy) and the
        inverted button, which reads on anything.

        The bronze hairline caps the band where it meets the paper.
      */}
      <div className="relative -mt-24 overflow-hidden border-b border-bronze/70 bg-ink md:-mt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            src="/images/madison/march.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/40 via-ink/75 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/75 to-ink" />
        </div>

        <Container className="pt-36 pb-12 md:pt-48 md:pb-14">
          <div className="animate-[page-settle_420ms_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="grid items-center gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <span className="type-label text-bronze-soft">
                  Edition {meta.edition}
                </span>

                <h1
                  tabIndex={-1}
                  className="type-display measure mt-5 text-ink-inverse outline-none"
                  style={{ animationDelay: "var(--intro-reveal-delay)" }}
                >
                  The worst and the best
                  <br />
                  of top high schools.
                </h1>

                <p className="type-body measure-snug mt-6 text-ink-inverse/70">
                  Highlighting the reality of high schools in Nepal beyond what
                  they advertise.
                </p>
              </div>

              <div className="flex flex-col gap-3 justify-self-start md:justify-self-end">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-bronze text-ink-inverse hover:bg-bronze-ink active:bg-bronze-ink sm:w-auto"
                >
                  <Link to="/rankings">View the rankings</Link>
                </Button>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <Link
                    to="/methodology"
                    className="type-caption text-bronze underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-soft hover:decoration-2"
                  >
                    Methodology
                  </Link>
                  <Link
                    to="/reports"
                    className="type-caption text-bronze underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-soft hover:decoration-2"
                  >
                    Annual report
                  </Link>
                  <Link
                    to="/about"
                    className="type-caption text-bronze underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-soft hover:decoration-2"
                  >
                    About us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <Rule tone="rule" className="mt-10 md:mt-14" />

        {/* Stats as a ruled row. */}
        <Reveal className="min-w-0" delayMs={60}>
          <div className="mt-8 grid grid-cols-2 gap-0 border-y border-rule-soft md:grid-cols-4">
            <StatCell value={formatCount(totalSchools)} label="schools rated" />
            <StatCell
              value={formatCountPlus(meta.totalResponses)}
              label="responses"
              border
            />
            <StatCell value={formatCount(redFlags.length)} label="red-flagged" border />
            <StatCell value={formatDate(meta.publicationDate)} label="published" border />
          </div>
        </Reveal>

        {/* Red-flag spotlight + top of the table, side by side. */}
        <div className="grid gap-12 pt-10 md:grid-cols-2 md:gap-16">
          <Reveal className="min-w-0" delayMs={120}>
            <div className="min-w-0">
              {/*
                Section header as a photo band. red-flag-students.svg is
                duotoned IN THE FILE (ink shadows / bronze mids / bronze-wash
                highlights), so the protest photo lands on palette — navy and
                gold instead of street colour. One horizontal veil does the
                reading work: solid canvas at the left edge where the heading
                link sits, opening to ~50% photo at the right, where nothing
                but the photo lives. Bronze hairline caps it — same language
                as the hero band.
              */}
              <div className="relative isolate mb-4 overflow-hidden border-b border-bronze/70">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10"
                >
                  <img
                    src="/images/red-flag-students.svg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-[center_45%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-canvas/50 via-canvas/90 to-canvas" />
                </div>
                <h2 className="type-label flex min-h-28 items-center md:min-h-36">
                  <Link
                    to="/rankings?view=redflags"
                    className="rounded-sm text-ink-faint underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-ink"
                  >
                    Red flag schools <span aria-hidden="true">→</span>
                  </Link>
                </h2>
              </div>
              <div className="grid gap-3">
                {flaggedPreview.map((redFlag) => (
                  <Link
                    key={redFlag.id}
                    to={`/red-flag/${redFlag.id}`}
                    className="group flex min-w-0 items-stretch gap-3 rounded-sm border border-rule-soft bg-surface p-3 transition-colors duration-[120ms] hover:border-band-weak"
                  >
                    <span aria-hidden="true" className="w-1 shrink-0 bg-band-weak" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[0.9375rem] font-bold text-ink group-hover:underline">
                        {redFlag.name}
                      </p>
                      <p className="type-caption mt-1 line-clamp-2 text-ink-muted">
                        {redFlag.reasons[0] ?? "Published reasons pending."}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="shrink-0 self-center text-ink-faint transition-transform duration-[120ms] group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                to="/rankings?view=redflags"
                className="type-caption mt-4 inline-block text-bronze-ink underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                See all {redFlags.length} flagged schools
              </Link>
            </div>
          </Reveal>

          <Reveal className="min-w-0" delayMs={180}>
            <aside className="min-w-0">
              <h2 className="type-label">
                <Link
                  to="/rankings?view=all"
                  className="rounded-sm text-ink-faint underline decoration-1 underline-offset-4 transition-colors duration-[120ms] hover:text-bronze-ink"
                >
                  Top of the table <span aria-hidden="true">→</span>
                </Link>
              </h2>
              <ol className="mt-4 flex flex-col">
                {top5.map((school, i) => (
                  <li
                    key={school.id}
                    className="border-b border-rule-soft py-3 last:border-b-0"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        to={`/school/${school.id}`}
                        className="flex min-w-0 items-baseline gap-2 rounded-sm"
                      >
                        <span className="font-serif type-numeric-sm text-bronze-ink">
                          {school.rank}
                        </span>
                        <span className="truncate font-serif text-[0.9375rem] font-bold text-ink hover:underline">
                          {school.name}
                        </span>
                      </Link>
                      <span className={`type-numeric-sm ${bandColor(school.overallScore)}`}>
                        {school.overallScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-2 pl-7">
                      <ScoreBar
                        value={school.overallScore}
                        size="sm"
                        delayMs={2160 + i * 60}
                        label={`${school.name}, overall ${school.overallScore.toFixed(1)}`}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function StatCell({
  value,
  label,
  border = false,
}: {
  value: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div
      className={
        border
          ? "border-t border-rule-soft px-4 py-5 md:border-l md:border-t-0"
          : "px-4 py-5 md:border-t-0"
      }
    >
      <StatBlock value={value} label={label} />
    </div>
  );
}
