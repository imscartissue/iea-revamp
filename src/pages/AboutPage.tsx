import { useEffect } from "react";
import { Link } from "react-router";

import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { Rule } from "@/components/site/Rule";
import { StatBlock, StatRow } from "@/components/data-display/StatBlock";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/site/TeamCard";
import { SEO, applySeo } from "@/lib/seo";
import { bandCounts, meanResponses, meta, totalSchools } from "@/lib/data";
import { formatCount, formatCountPlus, formatDate } from "@/lib/format";

/**
 * The project, the limitations, and the people.
 *
 * On the live site this page is literally "Information Unavailable". It exists
 * because a ranking is a statistical claim about named institutions, and the
 * reader is entitled to know who made it, how, and how much to trust it. The
 * how — and the FAQ about what the score means — live on `/methodology`.
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

        {/* --- people ------------------------------------------------------ */}
        <Reveal className="py-8 md:py-20" delayMs={180}>
          <div className="text-center mb-20 md:mb-28">
            <p className="type-label text-bronze-ink uppercase tracking-[0.25em] mb-4">The people</p>
            <h2 className="type-title text-ink mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ink via-bronze to-ink">
              The team
            </h2>
          </div>

          {/* Founders */}
          <section className="relative mb-14 md:mb-20">
            <div className="absolute inset-0 -z-10 bg-bronze-soft/40 rounded-2xl blur-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
              <TeamCard
                name="Yogeshwor Sharma"
                role="Founder, President, & Head of Operations"
                featured
              />
              <TeamCard
                name="Eron Subedi"
                role="Founder, Chief Architect & Chief of Investigations"
                featured
              />
            </div>
          </section>

          {/* Leadership — Aarohan, Tikaram, Prajjwal */}
          <section className="mb-14 md:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 items-start justify-items-center">
              <TeamCard name="Aarohan Baral" role="Lead Developer" />
              <TeamCard name="Tikaram Sharma" role="Co-Founder & Lead Analyst" />
              <TeamCard name="Prajjwal Dhakal" role="Co-Founder" />
            </div>
          </section>

          {/* Research Executive */}
          <section className="mb-14 md:mb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
              <TeamCard name="Abinash Poudel" role="Lead of Online Research" />
              <TeamCard name="Nischal Ghimire" role="Research Executive" />
              <TeamCard name="Kaustuv Rimal" role="Research Executive" />
              <TeamCard name="Aaditya Jha" role="Research Executive" />
              <TeamCard name="Aishani Rai" role="Editorial Lead" />
            </div>
          </section>

          {/* Researcher */}
          <section className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
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
          We want to show our gratitude to all those who answered the surveys
          honestly and made this possible. Their name and the individual
          responses, however, won't be published anywhere to maintain their
          anonymity.
        </p>

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


