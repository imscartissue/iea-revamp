import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router";

import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { Rule } from "@/components/site/Rule";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { applySeo, redFlagSeo } from "@/lib/seo";
import { getRedFlag } from "@/lib/data";
import type { RedFlag } from "@/lib/types";

/**
 * One flagged school and the reasons for it.
 *
 * A flagged school may not exist in the ranked roster (CCRC College, Kavya),
 * so this page never assumes a score, a rank or a band. An unknown id renders
 * the 404 in place rather than redirecting, keeping the reader's URL intact.
 */
export function RedFlagPage() {
  const { id } = useParams<{ id: string }>();
  const redFlag = getRedFlag(id);

  if (!redFlag) return <NotFoundPage />;

  return <RedFlagDetail redFlag={redFlag} />;
}

function RedFlagDetail({ redFlag }: { redFlag: RedFlag }) {
  useEffect(() => {
    applySeo(redFlagSeo(redFlag));
  }, [redFlag]);

  return (
    <Container>
      <div className="animate-route-in">
        <header className="pt-12 md:pt-24">
          <Reveal staggerMs={60}>
            <nav aria-label="Breadcrumb" className="type-caption text-ink-faint">
            <Link
              to="/rankings?view=redflags"
              className="text-bronze-ink underline underline-offset-4 hover:decoration-2"
            >
              Red flag schools
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page">{redFlag.name}</span>
          </nav>

          <div className="mt-8 md:mt-10">
            <h1 tabIndex={-1} className="type-title measure-tight text-ink outline-none">
              {redFlag.name}
            </h1>
          </div>
          </Reveal>
        </header>

        <Rule tone="rule" className="mt-12 md:mt-16" />

        <Reveal className="py-12 md:py-16" delayMs={60}>
          <SectionHeader
            eyebrow="Red flag"
            title="Why this school is flagged"
            className="mb-8 md:mb-10"
          />

          {redFlag.reasons.length === 0 ? (
            <p className="type-body-lg measure text-ink-muted">
              No specific reasons have been published for this school yet.
            </p>
          ) : (
            <ol className="mt-6 flex flex-col gap-4">
              {redFlag.reasons.map((reason, i) => (
                <li
                  key={reason}
                  className="grid gap-x-8 gap-y-2 border-b border-rule-soft py-6 last:border-b-0 last:pb-0 md:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <span
                    aria-hidden="true"
                    className="font-serif text-numeric-sm leading-6 text-bronze-ink"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="type-body-lg measure-snug font-bold text-ink leading-1.6">
                    {reason}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Reveal>

        <Rule tone="rule" className="mt-16 md:mt-20" />

        <Reveal className="py-12 md:py-16" delayMs={120}>
          <SectionHeader
            eyebrow="About this flag"
            title="Where this comes from"
            className="mb-8 md:mb-10"
          />
          <p className="type-body-lg measure text-ink-muted">
            IEA received reports of these abuses from student surveys and a
            detailed research of publicly available data.
          </p>
          <p className="type-body-lg measure mt-6 text-ink-muted">
            If you have any queries, please contact us at{" "}
            <a
              href="mailto:ins.edu.ac@gmail.com"
              className="text-bronze-ink underline underline-offset-4 hover:decoration-2"
            >
              ins.edu.ac@gmail.com
            </a>
            .
          </p>
        </Reveal>

        <Rule className="mt-16 md:mt-20 mb-10" />

        <Reveal delayMs={180}>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <ButtonLink to="/rankings?view=redflags">See all flagged schools</ButtonLink>
            <ButtonLink to="/">Back to the home page</ButtonLink>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}

function ButtonLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="type-ui font-bold text-bronze-ink underline underline-offset-4 hover:decoration-2"
    >
      {children}
    </Link>
  );
}
