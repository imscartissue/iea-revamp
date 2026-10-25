import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { Rule } from "@/components/site/Rule";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { StatBlock, StatRow } from "@/components/data-display/StatBlock";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/site/TeamCard";
import { SEO, applySeo } from "@/lib/seo";
import { bandCounts, meanResponses, meta, totalSchools } from "@/lib/data";
import { formatCount, formatCountPlus, formatDate, isoDate } from "@/lib/format";

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
          <Reveal staggerMs={60}>
            <h1 tabIndex={-1} className="type-title measure-tight text-ink outline-none">
              About this project
            </h1>
            <p className="type-body-lg measure mt-6 text-ink-muted">
              Institute for Educational Accountability is an independent, student-sourced ranking of
              Nepali +2 schools. We aim to highlight the reality of high schools in Nepal beyond what
              they advertise.
            </p>
          </Reveal>
        </header>

        <Rule tone="rule" className="mt-10" />

        {/* --- the project in numbers ------------------------------------- */}
        <Reveal className="py-12 md:py-16" delayMs={60}>
          <StatRow>
            <StatBlock
              value={formatCount(totalSchools)}
              label="schools rated"
              sublabel={`${formatDate(meta.publicationDate)}`}
            />
            <StatBlock
              value={formatCountPlus(meta.totalResponses)}
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
            All data was collected from anonymous surveys.
          </p>
        </Reveal>

        <Rule />

        {/* --- method ------------------------------------------------------ */}
        <Reveal className="py-12 md:py-16" delayMs={120}>
          <SectionHeader eyebrow="Method" title="How the score is calculated" />
          <ol className="mt-8 flex flex-col">
            {[
              {
                title: "Who answered",
                body: `${formatCountPlus(meta.totalResponses)} students across the ${meta.location}, reached through student networks rather than schools. Each rated the school they or their peers attended.`,
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
        </Reveal>

        <Rule />

        {/* --- people ------------------------------------------------------ */}
        <Reveal className="py-12 md:py-20" delayMs={180}>
          <SectionHeader
            eyebrow="The people"
            title="The team"
          />

          {/* Founders */}
          <section className="mt-16 md:mt-20">
            <p className="type-label text-bronze-ink uppercase tracking-[0.16em] mb-4">Founders</p>
            <div className="grid gap-12 md:grid-cols-2">
              <TeamCard
                name="Yogeshwor Sharma"
                role="Founder, President Head of Operations"
              />
              <TeamCard
                name="Eron Subedi"
                role="Founder, Chief Architect, & Chief of Investigations"
              />
            </div>
          </section>

          <Rule className="mt-16 md:mt-20" />

          {/* Leadership */}
          <section className="mt-12 md:mt-16">
            <p className="type-label text-bronze-ink uppercase tracking-[0.16em] mb-4">Leadership</p>
            <div className="grid gap-12 md:grid-cols-3">
              <TeamCard name="Aarohan Baral" role="Lead Developer" />
              <TeamCard name="Tikaram Sharma" role="Co-Founder Lead Analyst" />
              <TeamCard name="Prajjwal Dhakal" role="Co-Founder" />
            </div>
          </section>

          <Rule className="mt-16 md:mt-20" />

          {/* Research Executive */}
          <section className="mt-12 md:mt-16">
            <p className="type-label text-bronze-ink uppercase tracking-[0.16em] mb-4">Research Executive</p>
            <div className="grid gap-10 md:gap-12 md:grid-cols-5 sm:grid-cols-3">
              <TeamCard name="Abinash Poudel" role="Lead of Online Research" />
              <TeamCard name="Nischal Ghimire" role="Research Executive" />
              <TeamCard name="Kaustuv Rimal" role="Research Executive" />
              <TeamCard name="Aaditya Jha" role="Research Executive" />
              <TeamCard name="Aishani Rai" role="Editorial Lead" />
            </div>
          </section>

          <Rule className="mt-16 md:mt-20" />

          {/* Researcher */}
          <section className="mt-12 md:mt-16 mb-20">
            <p className="type-label text-bronze-ink uppercase tracking-[0.16em] mb-4">Researcher</p>
            <div className="grid gap-12 md:grid-cols-3 sm:grid-cols-2">
              <TeamCard name="Krinjal Timalsina" role="Researcher" />
              <TeamCard name="Aadarsha Pandey" role="Researcher" />
              <TeamCard name="Piyush Joshi" role="Researcher" />
              <TeamCard name="Pratyush Neupane" role="Researcher" />
              <TeamCard name="Sambriddhi Bhattarai" role="Researcher" />
              <TeamCard name="Kashyap Shrestha" role="Researcher" />
            </div>
          </section>
        </Reveal>

        <p className="type-body measure mt-6 text-ink-muted">
          And the 200 students who answered the survey, who are the reason any
          of this exists. They are not named here, and their individual answers
          are not published — only the aggregate reaches this page.
        </p>

        <Rule />

        {/* --- FAQ --------------------------------------------------------- */}
        <Reveal className="py-12 md:py-16" delayMs={220}>
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
                  <Datum term="Responses" value={formatCountPlus(meta.totalResponses)} />
                </dl>
              }
            />
          </div>
        </Reveal>

        <Rule />

        {/* --- provenance --------------------------------------------------- */}
        <Reveal className="py-12 md:py-16" delayMs={260}>
          <p className="type-body measure text-ink-muted">{meta.disclaimer}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Button asChild variant="outline">
              <Link to="/rankings">See the rankings</Link>
            </Button>
            <Button asChild variant="link">
              <Link to="/">Back to the home page</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}

function Datum({ term, value, iso }: { term: string; value: string; iso?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule-soft pb-3">
      <dt className="type-label w-24 shrink-0 text-ink-faint md:w-48">{term}</dt>
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


