import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Container } from "@/components/site/Container";
import { Rule } from "@/components/site/Rule";
import { Portrait } from "@/components/data-display/Portrait";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { StatBlock, StatRow } from "@/components/data-display/StatBlock";
import { Button } from "@/components/ui/button";
import { contributors } from "@/data/contributors";
import { SEO, applySeo } from "@/lib/seo";
import { bandCounts, meanResponses, meta, totalSchools } from "@/lib/data";
import { formatCount, formatDate, isoDate } from "@/lib/format";

/**
 * The project, the method, the limitations, and the people.
 *
 * On the live site this page is literally "Information Unavailable". It exists
 * because a ranking is a statistical claim about named institutions, and the
 * reader is entitled to know who made it, how, and how much to trust it.
 *
 * The "does not mean" column is deliberately longer than the "does" column.
 * A methodology page that only lists strengths is marketing.
 *
 * The FAQ below the photos carries the two things a reader most often wants
 * after seeing a score: what it means, and where the number came from. Both are
 * collapsed by default, so the page does not open with a wall of caveats.
 */
export function AboutPage() {
  useEffect(() => applySeo(SEO.about), []);

  return (
    <Container>
      <div className="animate-route-in">
        <header className="pt-12 md:pt-20">
          <h1 tabIndex={-1} className="type-title measure-tight text-ink outline-none">
            About this project
          </h1>
          <p className="type-body-lg measure mt-6 text-ink-muted">
            IEA Institute is an independent, student-sourced ranking of Nepali +2 schools. It
            exists because choosing a school in Nepal is unusually opaque — brochures are
            unverifiable, fees are rarely published, and the people with the most direct
            experience had no way to compare notes.
          </p>
        </header>

        <Rule tone="rule" className="mt-10" />

        {/* --- the project in numbers ------------------------------------- */}
        <section className="py-12 md:py-16">
          <StatRow>
            <StatBlock
              value={formatCount(totalSchools)}
              label="schools rated"
              sublabel={`${formatDate(meta.publicationDate)}`}
            />
            <StatBlock
              value={formatCount(meta.totalResponses)}
              label="students answered"
              sublabel={`mean ${meanResponses} per school`}
            />
            <StatBlock
              value={formatCount(bandCounts.strong)}
              label="rated strong"
              sublabel={`${bandCounts.fair} fair, ${bandCounts.weak} weak`}
            />
          </StatRow>

          <p className="type-body measure mt-8 text-ink-muted">
            Every figure on this site comes from one anonymous survey. No school submitted its
            own numbers, no sponsor paid for placement, and no respondent is identifiable in
            anything published here.
          </p>
        </section>

        <Rule />

        {/* --- method ------------------------------------------------------ */}
        <section className="py-12 md:py-16">
          <SectionHeader eyebrow="Method" title="How the score is calculated" />
          <ol className="mt-8 flex flex-col">
            {[
              {
                title: "Who answered",
                body: `${formatCount(meta.totalResponses)} students across the ${meta.location}, reached through student networks rather than schools. Each rated the school they or their peers attended.`,
              },
              {
                title: "What was asked",
                body: "Four scored dimensions, each rated out of 100, plus open-text questions on fees, clubs, discipline and what they would recommend.",
              },
              {
                title: "How it is weighted",
                body: "School Environment 30%, Net Benefit 30%, Infrastructure 20%, Net Cost 20%. Complaint is collected but weighted at zero, because no usable complaint data came back.",
              },
              {
                title: "The cost inversion",
                body: "A lower cost burden is better, so the raw cost rating is turned upside down (100 − cost) before it is weighted. Without this, expensive schools would rank higher for being expensive.",
              },
              {
                title: "How a rank is assigned",
                body: "Schools are sorted by overall score, descending, and given consecutive ranks. Ties break on the published order, so the ranking is reproducible rather than dependent on sort internals.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="grid gap-x-8 gap-y-2 border-b border-rule-soft py-6 md:grid-cols-[3rem_minmax(0,1fr)]"
              >
                <span className="font-serif text-numeric-sm leading-6 text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="type-heading text-ink">{step.title}</h3>
                  <p className="type-body measure-snug text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Rule />

        {/* --- people ------------------------------------------------------ */}
        <section className="py-12 md:py-16">
          <SectionHeader
            eyebrow="The people"
            title="Who built this"
          />

          <ContributorGrid />

          <Rule className="mt-10" />

          <p className="type-body measure mt-6 text-ink-muted">
            And the {formatCount(meta.attributedResponses)} students who answered the survey,
            who are the reason any of this exists. They are not named here, and their
            individual answers are not published — only the aggregate reaches this page.
          </p>
        </section>

        <Rule />

        {/* --- FAQ --------------------------------------------------------- */}
        <section className="py-12 md:py-16">
          <SectionHeader eyebrow="FAQ" title="What the score means" />
          <div className="mt-8 flex flex-col gap-3">
            <FaqItem
              question="What does the score mean — and what does it not mean?"
              answer={
                <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <h3 className="type-label text-band-strong">What it does tell you</h3>
                    <ul className="flex flex-col gap-3">
                      {[
                        "How students at a school actually rate four things that matter.",
                        "Where a school sits relative to others rated on the same questions.",
                        "Which of the four dimensions is carrying a school, and which is holding it back.",
                      ].map((item) => (
                        <li key={item} className="type-body measure-snug text-ink-muted">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="type-label text-band-weak">What it does not</h3>
                    <ul className="flex flex-col gap-3">
                      {[
                        "It is not an accreditation, and no school body has approved it.",
                        "Samples are small — a mean of about 2.5 responses per school. Some schools have none at all.",
                        "It is self-reported, so it reflects who felt able to answer and how they felt on the day.",
                        "A single score hides tradeoffs. A school strong on benefit and weak on cost is a real school, not a bug.",
                        "It is not a fit score for your child. That depends on what they need and what you can afford.",
                      ].map((item) => (
                        <li key={item} className="type-body measure-snug text-ink-muted">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            />
            <FaqItem
              question="Where we got the numbers from"
              answer={
                <dl className="flex flex-col gap-3">
                  <Datum term="Published" value={formatDate(meta.publicationDate)} iso={meta.publicationDate} />
                  <Datum term="Source" value={meta.source} />
                  <Datum term="Scope" value={`${meta.location}, ${meta.gradeRange}`} />
                  <Datum term="Responses" value={formatCount(meta.totalResponses)} />
                  <Datum term="Attributed to a school" value={formatCount(meta.attributedResponses)} />
                  <Datum term="Unattributable" value={formatCount(meta.unattributedResponses)} />
                </dl>
              }
            />
          </div>
        </section>

        <Rule />

        {/* --- provenance --------------------------------------------------- */}
        <section className="py-12 md:py-16">
          <p className="type-body measure text-ink-muted">{meta.disclaimer}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Button asChild variant="outline">
              <Link to="/rankings">See the rankings</Link>
            </Button>
            <Button asChild variant="link">
              <Link to="/">Back to the home page</Link>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
}

function Datum({ term, value, iso }: { term: string; value: string; iso?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule-soft pb-3">
      <dt className="type-label min-w-[12rem] text-ink-faint">{term}</dt>
      <dd className="type-ui text-ink">{iso ? <time dateTime={isoDate(iso)}>{value}</time> : value}</dd>
    </div>
  );
}

/**
 * A collapsible FAQ item.
 *
 * A `<button>` wrapping the question, with the answer in a region that is hidden
 * until it is opened. `aria-expanded` on the button and `aria-hidden` on the
 * answer keep the state announced; the chevron is decorative.
 *
 * Both items start closed, so the page does not open with a wall of caveats.
 */
function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
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
          className={`type-caption shrink-0 text-ink-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-200 ease-brand ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{answer}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * The people.
 *
 * With no names supplied yet, the grid renders correctly-sized blank slots
 * rather than collapsing — so adding the real list later moves nothing. There
 * is no filler text and no invented team; see `src/data/contributors.ts`.
 */
function ContributorGrid() {
  if (!contributors.length) {
    return (
      <div className="mt-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* Reserved slot, same size as a real portrait. */}
              <div aria-hidden="true" className="h-52 w-39 rounded-md border border-rule-soft bg-sunken" />
              <div aria-hidden="true" className="h-3 w-24 rounded-sm bg-sunken" />
              <div aria-hidden="true" className="h-3 w-16 rounded-sm bg-sunken" />
            </div>
          ))}
        </div>
        <p className="type-caption text-ink-faint">
          Credits are being added. The space is reserved so nothing shifts when they arrive.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {contributors.map((person) => (
        <li key={person.id} className="flex flex-col gap-3">
          <Portrait contributor={person} size="lg" />

          <div className="flex flex-col gap-1">
            <span className="type-ui font-bold text-ink">{person.name || "—"}</span>
            {person.role ? <span className="type-caption text-bronze-ink">{person.role}</span> : null}
          </div>

          {person.links?.github ? (
            <a
              href={person.links.github}
              className="type-caption w-fit text-bronze-ink underline underline-offset-4 hover:decoration-2"
              rel="noreferrer noopener"
              target="_blank"
            >
              GitHub
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
